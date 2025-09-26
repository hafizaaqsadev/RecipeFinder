import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Favorites from "./Pages/Favorites";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Logout from "./Pages/Logout";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const App = () => {
  // Safe initialization of user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser && savedUser !== "undefined"
        ? JSON.parse(savedUser)
        : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    return savedToken && savedToken !== "undefined" ? savedToken : null;
  });

  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      localStorage.removeItem("favorites");
      return [];
    }
  });

  // Sync favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // On initial load, restore user from token if not set
  useEffect(() => {
    if (!user && token) {
      try {
        const decoded = jwt_decode(token);
        setUser({ username: decoded.username || "User" });
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, [token, user]);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      {/* Key ensures Navbar re-renders on user change */}
      <Navbar
        key={user?.username || "guest"}
        user={user}
        setUser={setUser}
        setToken={setToken}
        handleLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              user={user}
              token={token}
              favorites={favorites}
              setFavorites={setFavorites}
              handleLogout={handleLogout}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <Favorites
              user={user}
              token={token}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          }
        />
        <Route
          path="/login"
          element={<Login setUser={setUser} setToken={setToken} />}
        />
        <Route
          path="/signup"
          element={<Signup setUser={setUser} setToken={setToken} />}
        />
        <Route
          path="/logout"
          element={<Logout setUser={setUser} setToken={setToken} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
