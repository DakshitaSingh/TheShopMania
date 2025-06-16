import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
// No need to import useWishlist here and call clearWishlist directly.
// The WishlistProvider's useEffect will automatically handle clearing
// when the user state becomes null from AuthProvider's logout.

const Logout = () => {
    const { logout } = useAuth(); // Get the logout function from AuthProvider
    const navigate = useNavigate();

    useEffect(() => {
        // Call the Firebase signOut function
        logout()
            .then(() => {
                // Successfully logged out from Firebase
                navigate('/login'); // Redirect to login or home page
            })
            .catch((error) => {
                console.error("Error logging out:", error);
                // Handle logout error, perhaps show a message
                navigate('/'); // Redirect anyway or handle error gracefully
            });
    }, [logout, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <p className="text-xl text-gray-700">Logging out...</p>
        </div>
    );
};

export default Logout;