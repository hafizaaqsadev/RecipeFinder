import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo Section */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="FoodFusion Hub"
            className="w-12 h-12  object-contain transition-transform duration-300 hover:scale-125"
          />
        </Link>

        {/* Nav Items */}
        <div className="flex items-center gap-5 sm:gap-6">
          <Link
            to="/"
            className="text-gray-700 dark:text-gray-200 hover:text-yellow-500 text-sm sm:text-base"
          >
            Home
          </Link>
          <Link
            to="/favorites"
            className="text-gray-700 dark:text-gray-200 hover:text-yellow-500 text-sm sm:text-base"
          >
            Favorites
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
