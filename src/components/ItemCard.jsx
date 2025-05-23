import React from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const ItemCard = ({ item }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToWishlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const wishlistRef = doc(
      db,
      "users",
      user.uid,
      "wishlist",
      item.id.toString()
    );

    try {
      await setDoc(wishlistRef, {
        name: item.name,
        price: item.price,
        platform: item.platform,
        image: item.image,
        link: item.link,
      });
      console.log("Added to wishlist");
      alert("Item added to wishlist");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const cartRef = doc(db, "users", user.uid, "cart", item.id.toString());

    try {
      await setDoc(cartRef, {
        name: item.name,
        price: item.price,
        platform: item.platform,
        image: item.image,
        link: item.link,
        quantity: 1,
      });
      console.log("Added to cart");
      alert("Item added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 hover:scale-105 transition-transform">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-contain rounded bg-gray-100"
      />
      <h3 className="mt-2 font-semibold text-lg">{item.name}</h3>
      <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
      <p className="text-sm text-gray-500">Platform: {item.platform}</p>
      <div className="flex justify-between items-center mt-4">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer"
        >
          Explore
        </a>
        <button
          onClick={handleAddToWishlist}
          className="text-red-500 text-lg hover:scale-125 transition-transform"
        >
          <FaHeart />
        </button>
      </div>
      <button
        onClick={handleAddToCart}
        className="mt-3 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        <FaShoppingCart />
        Add to Cart
      </button>
    </div>
  );
};

export default ItemCard;
