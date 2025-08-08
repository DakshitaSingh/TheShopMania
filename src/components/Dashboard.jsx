import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Filter, Heart } from 'lucide-react';
import { FaSearch } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistProvider.jsx';

// Define your backend URLs
const NODE_BACKEND_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3001'; // This is for Flipkart
const FLASK_BACKEND_URL = import.meta.env.VITE_FLASK_API_URL || 'http://localhost:5000';

// =================================================================
// CHANGE 1: Added a new, separate URL for your deployed Myntra service
// =================================================================
const MYNTRA_BACKEND_URL = import.meta.env.VITE_MYNTRA_API_URL || 'https://myntra-scraper-service.onrender.com';


const Dashboard = () => {
    const [platform, setPlatform] = useState('flipkart');
    const [category, setCategory] = useState('men');
    const [searchQuery, setSearchQuery] = useState('');
    const [triggerSearch, setTriggerSearch] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { wishlist, toggleWishlist, isWishlisted } = useWishlist();

    const fetchMarketplaceProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        setProducts([]);

        const query = searchQuery.trim() !== '' ? searchQuery : category;

        try {
            let response;

            // =================================================================
            // CHANGE 2: Updated logic to call the specific backend for each platform
            // =================================================================
            if (platform === 'flipkart') {
                // Use the original Node.js backend URL for Flipkart
                response = await axios.get(`${NODE_BACKEND_URL}/api/products/flipkart/${encodeURIComponent(query)}`);
            } else if (platform === 'myntra') {
                // Use the new, dedicated Myntra backend URL
                response = await axios.get(`${MYNTRA_BACKEND_URL}/api/products/myntra/${encodeURIComponent(query)}`);
            } else {
                // Use the Flask backend URL for other platforms (Snapdeal, Shopclues)
                response = await axios.get(`${FLASK_BACKEND_URL}/api/products/${platform}/${encodeURIComponent(query)}`);
            }

            setProducts(response.data);

            if (response.data.length === 0) {
                setError(`No products found for "${query}" on ${platform.charAt(0).toUpperCase() + platform.slice(1)}.`);
            }
        } catch (err) {
            console.error(`Error fetching products from ${platform}:`, err);
            setError(`Failed to fetch products from ${platform}. Check your backend server.`);
        } finally {
            setLoading(false);
        }
    }, [platform, category, searchQuery, triggerSearch]);

    useEffect(() => {
        fetchMarketplaceProducts();
    }, [platform, triggerSearch, fetchMarketplaceProducts]);

    const handleSearchClick = () => setTriggerSearch(prev => prev + 1);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
            <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
                🛒 E-Commerce Product Dashboard
            </h1>

            {/* Platform selection (No changes needed here) */}
            <div className="flex justify-center mb-6 gap-4 flex-wrap">
                {['flipkart', 'myntra', 'shopclues', 'snapdeal'].map((plat) => (
                    <button
                        key={plat}
                        onClick={() => {
                            setPlatform(plat);
                            setCategory('men');
                            setSearchQuery('');
                        }}
                        className={`px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300 ${
                            platform === plat ? 'bg-blue-600 text-white scale-105' : 'bg-white text-gray-700 hover:bg-blue-100'
                        }`}
                    >
                        {plat.charAt(0).toUpperCase() + plat.slice(1)}
                    </button>
                ))}
            </div>

            {/* The rest of your JSX remains exactly the same */}
            {/* ... (Search, Category, Button, Loading, Error, Product Grid) ... */}
            <div className="flex justify-center items-center gap-4 mb-8 flex-wrap">
                <div className="relative w-72">
                    <FaSearch className="absolute top-3.5 left-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <select
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setSearchQuery('');
                        handleSearchClick();
                    }}
                    className="p-3 border border-gray-300 rounded-full shadow bg-white"
                >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="electronics">Electronics</option>
                    <option value="home">Home & Living</option>
                    <option value="fashion">Fashion</option>
                    <option value="beauty">Beauty</option>
                </select>
                <button
                    onClick={handleSearchClick}
                    className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition-colors duration-300"
                    disabled={loading}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>
            {loading && (
                <div className="text-center text-blue-600 text-lg font-medium mb-4">
                    Loading products...
                </div>
            )}
            {error && (
                <div className="text-center text-red-600 text-lg font-medium mb-4 p-3 bg-red-100 border border-red-400 rounded">
                    {error}
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {!loading && products.length > 0 ? (
                    products.map((product, idx) => (
                        <div
                            key={product.link || idx}
                            className="relative bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
                        >
                            <button
                                onClick={() => toggleWishlist(product)}
                                className="absolute top-3 right-3 p-1 rounded-full z-10"
                            >
                                <Heart
                                    size={20}
                                    className={`transition-colors duration-300 ${
                                        isWishlisted(product) ? 'text-red-500 fill-red-500' : 'text-gray-400'
                                    }`}
                                />
                            </button>
                            <img
                                src={product.image_url}
                                alt={product.title}
                                className="w-full h-48 object-contain mb-3 rounded"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/150?text=Image+Not+Found";
                                }}
                            />
                            <h2 className="text-lg font-semibold mb-1 line-clamp-3 h-20 overflow-hidden">
                                {product.title}
                            </h2>
                            <p className="text-green-600 font-bold mb-1">{product.price}</p>
                            {product.platform && <p className="text-sm text-gray-500 mb-2">Platform: {product.platform}</p>}
                            {product.rating && <p className="text-sm text-gray-500 mb-2">Rating: {product.rating}</p>}
                            <a
                                href={product.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-blue-600 hover:underline"
                            >
                                View Product
                            </a>
                        </div>
                    ))
                ) : (
                    !loading && !error && (
                        <p className="text-center col-span-full text-gray-500">
                            Click 'Search' to find products.
                        </p>
                    )
                )}
            </div>
        </div>
    );
};

export default Dashboard;