// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Logout from "./components/Logout";
import Wishlist from "./components/Wishlist";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import Dashboard from "./components/Dashboard";
import { WishlistProvider } from './context/WishlistProvider';
import WishlistPage from './components/WishlistPage'; 
import About from './components/About'


// Example protected Dashboard component

function App() {
  return (
    <div className="font-sans">
      <AuthProvider>
        <WishlistProvider> 
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/wishlist" element={<WishlistPage />} /> {/* <--- New Wishlist Page route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </BrowserRouter>
         </WishlistProvider>
      </AuthProvider>
    </div>
  );
}

export default App; 