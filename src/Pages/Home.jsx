import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import RecipeCard from "../Components/RecipeCard";
import bgImage from "../assets/bgImg.jpg";

const Home = ({ favorites, setFavorites }) => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const recipeRef = useRef(null);

  const fetchRecipes = async (searchQuery) => {
    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
      );
      setRecipes(res.data.meals || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
      );
      const catList = res.data.meals.map((cat) => cat.strCategory);
      setCategories(catList);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const saveToFavorites = (meal) => {
    const exists = favorites.find((fav) => fav.idMeal === meal.idMeal);
    if (!exists) {
      const updated = [...favorites, meal];
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };

  const popular = [
    { name: "🍛 Biryani", keyword: "biryani" },
    { name: "🥗 Salad", keyword: "Salad" },
    { name: "🍔 Burger", keyword: "burger" },
    { name: "🍲 Soup", keyword: "Soup" },
    { name: "🎂 Cake", keyword: "cake" },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        recipeRef.current &&
        recipeRef.current.scrollTop > 200 &&
        recipes.length > 0
      ) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    const currentRef = recipeRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [recipes]);

  return (
    <div
      className="h-screen bg-cover bg-center text-white dark:text-white transition-colors duration-300 flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-black bg-opacity-60 backdrop-blur-sm w-full max-w-screen-xl mx-auto p-6 rounded-xl">
        {/* Header */}
        <div className="text-center mb-6 shrink-0">
          <h1 className="text-4xl font-bold mb-2">FoodFusion Hub</h1>
          <p className="text-lg italic opacity-90">
            “Explore, Cook, and Savor the World of Flavors”
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4 shrink-0">
          <input
            type="text"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p-2 rounded text-black w-full sm:w-1/2"
          />
          {/* <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 rounded text-black"
          >
            <option value="">Filter by Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select> */}
          <button
            onClick={() => fetchRecipes(query)}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white"
          >
            🔍 Search
          </button>
        </div>

        {/* Popular Buttons */}
        <div className="overflow-x-auto whitespace-nowrap mb-4 shrink-0">
          <div className="flex gap-4 justify-center items-center px-2">
            {popular.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setQuery(item.keyword);
                  fetchRecipes(item.keyword);
                }}
                className="flex flex-col items-center px-3 py-2 rounded-lg bg-white bg-opacity-20 backdrop-blur hover:bg-yellow-400 transition-all text-white animate-blink-animation"
              >
                <span className="text-2xl">{item.name.split(" ")[0]}</span>
                <span className="mt-1 text-xs font-medium">
                  {item.name.split(" ")[1]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recipes Section */}
        <div
          ref={recipeRef}
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${
            recipes.length > 0 ? "max-h-[70vh] overflow-y-auto pb-2" : ""
          }`}
        >
          {recipes.length > 0 ? (
            recipes.map((meal) => (
              <RecipeCard
                key={meal.idMeal}
                meal={meal}
                onSave={saveToFavorites}
                isSaved={favorites.some((fav) => fav.idMeal === meal.idMeal)}
              />
            ))
          ) : (
            <p className="text-center col-span-full text-white">
              No recipes found
            </p>
          )}
        </div>

        {/* Back to Top */}
        {showTopBtn && (
          <button
            onClick={() => {
              if (recipeRef.current) {
                recipeRef.current.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full shadow-lg z-50"
          >
            ⬆ Back to Top
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
