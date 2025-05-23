// src/components/Wishlist.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;

      const wishlistRef = collection(db, "users", user.uid, "wishlist");
      const snapshot = await getDocs(wishlistRef);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setWishlistItems(items);
    };

    fetchWishlist();
  }, [user]);

  if (!user) return <div>Please log in to view your wishlist.</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {wishlistItems.map((item) => (
            <li key={item.id} className="border rounded p-4 shadow">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p>{item.description}</p>
              <img src={item.image} alt={item.name} className="w-full mt-2" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
