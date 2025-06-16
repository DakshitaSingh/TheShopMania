import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { db } from '../firebase'; // <--- Import your Firestore instance
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthProvider'; // We still need the user from AuthProvider

// Create the context
const WishlistContext = createContext();

// Create a custom hook to use the wishlist context
export const useWishlist = () => {
  return useContext(WishlistContext);
};

// Create the Wishlist Provider component
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true); // New loading state for wishlist
  const { user, loading: authLoading } = useAuth(); // Get user and auth loading state

  // Function to fetch or set up a real-time listener for the user's wishlist
  const setupWishlistListener = useCallback(() => {
    if (user) {
      setLoadingWishlist(true);
      const userWishlistRef = doc(db, 'wishlists', user.uid); // Document for this user's wishlist

      // Set up a real-time listener
      const unsubscribe = onSnapshot(userWishlistRef, (docSnap) => {
        if (docSnap.exists()) {
          // If the document exists, set the wishlist from its data
          const data = docSnap.data();
          // Ensure 'items' exists and is an array
          setWishlist(Array.isArray(data.items) ? data.items : []);
        } else {
          // If the document doesn't exist, the wishlist is empty for this user
          console.log("No wishlist found for user:", user.uid);
          setWishlist([]);
          // Optionally, create the document if it doesn't exist (e.g., if you want an empty array immediately)
          // setDoc(userWishlistRef, { items: [] }, { merge: true });
        }
        setLoadingWishlist(false);
      }, (error) => {
        console.error("Error fetching wishlist:", error);
        setWishlist([]);
        setLoadingWishlist(false);
      });

      return unsubscribe; // Return the unsubscribe function for cleanup
    } else {
      // If no user is logged in, clear the wishlist and set loading to false
      setWishlist([]);
      setLoadingWishlist(false);
      return () => {}; // Return a no-op function for cleanup
    }
  }, [user]);

  // Effect to set up and clean up the listener
  useEffect(() => {
    // Only set up listener if auth is not loading
    if (!authLoading) {
      const unsubscribe = setupWishlistListener();
      return () => {
        if (unsubscribe) unsubscribe(); // Clean up the listener on component unmount or user change
      };
    }
  }, [authLoading, setupWishlistListener]);

  // Function to add/remove product from wishlist (interacts with Firestore)
  const toggleWishlist = useCallback(async (product) => {
    if (!user) {
      alert('Please log in to manage your wishlist!');
      return;
    }

    const userWishlistRef = doc(db, 'wishlists', user.uid);
    const exists = wishlist.some((item) => item.link === product.link);

    try {
      if (exists) {
        // Remove product from wishlist
        await updateDoc(userWishlistRef, {
          items: arrayRemove(product)
        });
        // The onSnapshot listener will automatically update the state
      } else {
        // Add product to wishlist
        // Check if the document exists first. If not, create it with setDoc.
        // If it exists, use updateDoc with arrayUnion.
        const docSnap = await getDoc(userWishlistRef);
        if (docSnap.exists()) {
          await updateDoc(userWishlistRef, {
            items: arrayUnion(product)
          });
        } else {
          // Document doesn't exist, create it with the first item
          await setDoc(userWishlistRef, {
            items: [product]
          });
        }
        // The onSnapshot listener will automatically update the state
      }
    } catch (error) {
      console.error(`Failed to ${exists ? 'remove from' : 'add to'} wishlist:`, error);
      alert('Failed to update wishlist. Please try again.');
    }
  }, [user, wishlist]); // wishlist is a dependency because `exists` depends on it

  // Function to check if a product is wishlisted (based on current frontend state)
  const isWishlisted = useCallback((product) => {
    return wishlist.some((item) => item.link === product.link);
  }, [wishlist]);

  // Value provided by the context
  const contextValue = {
    wishlist,
    toggleWishlist,
    isWishlisted,
    loadingWishlist // Export loading state for wishlist
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {/* Only render children when auth and wishlist are done loading */}
      {!authLoading && !loadingWishlist && children}
      {/* You might want a loading spinner here */}
      {(authLoading || loadingWishlist) && (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600 text-lg">Loading </p>
        </div>
      )}
    </WishlistContext.Provider>
  );
};