import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [category, setCategory] = useState('men');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${category}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Snapdeal Products Dashboard</h1>
      <div className="flex justify-center mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 rounded border border-gray-300 shadow"
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all"
          >
            <img
              src={product.image_url}
              alt={product.title}
              className="h-48 w-full object-contain mb-4"
            />
            <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
            <p className="text-green-600 font-bold">{product.price}</p>
            <p className="text-sm text-gray-500">Rating: {product.rating}</p>
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-blue-500 hover:underline"
            >
              View Product
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
