import { FaUser, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useWishlist } from "../context/WishlistProvider";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { wishlist } = useWishlist();

  return (
    <nav className="w-full px-6 py-4 relative bg-white z-50 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Get it all here</span>
          <span className="text-3xl font-bold text-gray-900">ShopMania</span>
        </div>

        {/* Center: Navigation Links (now centered) */}
        <ul className="hidden md:flex space-x-15 text-lg text-gray-900 font-medium absolute left-1/2 transform -translate-x-1/2">
          <li>
            <NavLink
              to="/"
              className="hover:text-black cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className="hover:text-black cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Categories
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className="hover:text-black cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              About
            </NavLink>
          </li>
        </ul>

        {/* Right: Icons and Menu Toggle */}
        <div className="flex items-center space-x-5 text-lg text-blue-500 font-semibold">
          <div className="hidden md:flex items-center space-x-5">
            <ul className="hidden md:flex items-center space-x-5">
              {user ? (
                <li>
                  <NavLink
                    to="/logout"
                    className="block py-2 px-4 hover:text-gray-400"
                    onClick={() => setIsOpen(false)}
                  >
                    Log Out
                  </NavLink>
                </li>
              ) : (
                <li>
                  <NavLink
                    to="/login"
                    className="block py-2 px-4 hover:text-gray-400"
                    onClick={() => setIsOpen(false)}
                  >
                    Login/SignUp
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to="/wishlist"
                  className="flex items-center space-x-1 hover:text-black relative"
                >
                  <FaHeart />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Hamburger (Mobile) */}
          <button
            className="md:hidden text-xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 bg-white border-t pt-4 space-y-4">
          <ul className="space-y-4 text-gray-700 text-sm font-medium">
            <li>
              <NavLink
                to="/"
                className="block hover:text-black"
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard"
                className="block hover:text-black"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className="block hover:text-black"
                onClick={() => setIsOpen(false)}
              >
                About
              </NavLink>
            </li>
            {user ? (
              <li>
                <NavLink
                  to="/logout"
                  className="block hover:text-black"
                  onClick={() => setIsOpen(false)}
                >
                  Log Out
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink
                  to="/login"
                  className="block hover:text-black"
                  onClick={() => setIsOpen(false)}
                >
                  Login/SignUp
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to="/wishlist"
                className="block hover:text-black flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <FaHeart />
                <span>Wishlist ({wishlist.length})</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};
