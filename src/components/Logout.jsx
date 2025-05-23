// src/components/Logout.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        // navigate to home or login page after logout
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-700 text-lg">Logging you out...</p>
    </div>
  );
};

export default Logout;
