import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Filter } from 'lucide-react';

const Dashboard = () => {
  const [platform, setPlatform] = useState('snapdeal');
  const [category, setCategory] = useState('men');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const query = searchQuery.trim() !== '' ? searchQuery : category;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${platform}/${encodeURIComponent(query)}`
        );
        setProducts(response.data);
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [platform, category, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        🛒 E-Commerce Product Dashboard
      </h1>

      {/* Platform Tabs */}
      <div className="flex justify-center mb-6 gap-4">
        {['snapdeal', 'shopclues'].map((plat) => (
          <button
            key={plat}
            onClick={() => {
              setPlatform(plat);
              setCategory('men');
              setSearchQuery('');
            }}
            className={`px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300 ${
              platform === plat
                ? 'bg-blue-600 text-white scale-105'
                : 'bg-white text-gray-700 hover:bg-blue-100'
            }`}
          >
            {plat.charAt(0).toUpperCase() + plat.slice(1)}
          </button>
        ))}
      </div>

      {/* Search Bar with Filter */}
      <div className="flex justify-center items-center gap-4 mb-8 flex-wrap">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Filter className="absolute left-3 top-3 text-gray-500" size={18} />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border border-gray-300 rounded-full shadow bg-white"
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-48 object-contain mb-3 rounded"
              />
              <h2 className="text-lg font-semibold mb-1 line-clamp-2 h-12 overflow-hidden">
                {product.title}
              </h2>
              <p className="text-green-600 font-bold mb-1">{product.price}</p>
              <p className="text-sm text-gray-500 mb-2">Rating: {product.rating}</p>
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
          <p className="text-center col-span-full text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;