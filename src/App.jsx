import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Favorites from "./Pages/Favorites";
import Navbar from "./Components/Navbar";
import { useState, useEffect } from "react";

const App = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Home favorites={favorites} setFavorites={setFavorites} />}
        />
        <Route
          path="/favorites"
          element={<Favorites favorites={favorites} setFavorites={setFavorites} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
