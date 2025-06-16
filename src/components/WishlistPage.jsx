import React from 'react';
import { useWishlist } from '../context/WishlistProvider'; // Import the hook
import { Heart } from 'lucide-react'; // For the icon

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist(); // Get wishlist and toggle function

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        ❤️ Your Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600 text-xl">Your wishlist is empty. Start adding some products!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product, idx) => (
            <div
              key={idx}
              className="relative bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-48 object-contain mb-3 rounded"
              />
              <h2 className="text-lg font-semibold mb-1 line-clamp-3 h-20 overflow-hidden">
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
              {/* Remove from Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)} // Use toggle to remove it
                className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <Heart size={18} className="fill-white" />
                <span>Remove from Wishlist</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;