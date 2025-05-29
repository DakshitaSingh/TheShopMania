import React from 'react';

const ProductCard = ({ product }) => (
  <div className="bg-white border rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
    <img
      src={product['Image URL'] || 'https://via.placeholder.com/150'}
      alt={product.Title || 'Product Image'}
      className="h-48 w-full object-contain mb-3"
    />
    <h3 className="text-lg font-semibold mb-1">{product.Title}</h3>
    <p className="text-green-600 font-medium mb-1">{product.Price}</p>
    <p className="text-yellow-600 mb-2">⭐ {product.Rating}</p>
    <a
      href={product.Link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-2 text-blue-600 hover:underline"
    >
      Buy Now
    </a>
  </div>
);

export default ProductCard;
