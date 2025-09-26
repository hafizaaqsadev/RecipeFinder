import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/logo.png";

const Navbar = ({ user, setUser, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);

    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="FoodFusion Hub"
            className="w-12 h-12 object-contain transition-transform duration-300 hover:scale-125"
          />
        </Link>

        <div className="flex items-center gap-5 sm:gap-6">
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-yellow-500 text-sm sm:text-base">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/favorites" className="text-gray-700 dark:text-gray-200 hover:text-yellow-500 text-sm sm:text-base">
                Favorites
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm sm:text-base transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-yellow-500 text-sm sm:text-base">
                Login
              </Link>
              <Link to="/signup" className="text-gray-700 dark:text-gray-200 hover:text-yellow-500 text-sm sm:text-base">
                Signup
              </Link>
            </>
          )}

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
