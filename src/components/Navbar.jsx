import { FaSearch, FaUser, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="w-full px-6 py-4 relative bg-white z-50">
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-10">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Get it all here</span>
            <span className="text-3xl font-bold text-gray-900">ShopMania</span>
          </div>
        </div>

        <ul className="hidden md:flex space-x-6 text-lg text-gray-900 font-medium">
          <li>
            <NavLink
              to="/"
              className="hover:text-black cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li className="hover:text-black cursor-pointer flex items-center space-x-1">
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
        {/* Center: Search (visible on md and up) */}
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-1 rounded-md w-64">
          <FaSearch className="text-blue-500 mr-2 text-sm" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none text-sm w-full"
          />
        </div>

        {/* Right: Icons and Menu Toggle */}
        <div className="flex items-center space-x-5 text-lg text-blue-500 font-semibold">
          {/* Desktop links */}

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
                <>
                  <li>
                    <NavLink
                      to="/login"
                      className="block py-2 px-4 hover:text-gray-400"
                      onClick={() => setIsOpen(false)}
                    >
                      Login/SignUp
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/wishlist"
                      className="flex items-center space-x-1 hover:text-black"
                    >
                      <FaHeart />
                      <span className="text-gray-600">1</span>
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            <NavLink
              to="/wishlist"
              className="flex items-center space-x-1 hover:text-black"
            >
              <FaHeart />
              <span className="text-gray-600">1</span>
            </NavLink>
          </div>

          {/* Hamburger menu for mobile */}
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
                to="/categories"
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
            <li>
              <NavLink
                to="/login"
                className="block hover:text-black"
                onClick={() => setIsOpen(false)}
              >
                Login/SignUp
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wishlist"
                className="block hover:text-black"
                onClick={() => setIsOpen(false)}
              >
                Wishlist (1)
              </NavLink>
            </li>
          </ul>

          {/* Mobile search */}
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-full mt-4">
            <FaSearch className="text-blue-500 mr-2 text-sm" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent focus:outline-none text-sm w-full"
            />
          </div>
        </div>
      )}
    </nav>
  );
};
