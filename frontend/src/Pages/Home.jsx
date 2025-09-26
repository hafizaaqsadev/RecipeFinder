import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import RecipeCard from "../Components/RecipeCard";
import Footer from "../Components/Footer";
import ReviewSection from "../Components/ReviewSection";
import popularRecipes from "../data/popularRecipes.json";
import bgImage from "../assets/bgImg.jpg";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

const Home = ({ user, token, favorites, setFavorites }) => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState(null);
  const [sliderRecipes, setSliderRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const firstCardRef = useRef(null);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch recipes based on search query
  const fetchRecipes = async (searchQuery) => {
    if (!user || !token) {
      alert("Please login to search recipes.");
      return;
    }
    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
      );

      const apiRecipes = res.data.meals || [];
      const matchedStatic = popularRecipes.filter((item) =>
        item.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setRecipes([...matchedStatic, ...apiRecipes]);
      setSelectedRecipe(null);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
    }
  };

  // Fetch random recipes for slider
  const fetchRandomForSlider = async () => {
    try {
      const res = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/search.php?s="
      );
      setSliderRecipes(res.data.meals?.slice(0, 10) || []);
    } catch (error) {
      console.error("Error fetching slider recipes:", error);
    }
  };

  // Save recipe to favorites
  const saveToFavorites = (meal) => {
    if (!user || !token) return alert("Login to save favorites!");

    const exists = favorites.find((fav) => fav.idMeal === meal.idMeal);
    if (!exists) {
      const updated = [...favorites, meal];
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));

      // save to backend (optional)
      axios
        .post(
          "http://localhost:8000/api/favorites/",
          {
            mealId: meal.idMeal,
            mealName: meal.strMeal,
            mealThumb: meal.strMealThumb,
            strInstructions: meal.strInstructions,
            strYoutube: meal.strYoutube,
            ingredients: Object.keys(meal)
              .filter((k) => k.startsWith("strIngredient") && meal[k])
              .map((k) => ({
                name: meal[k],
                measure: meal["strMeasure" + k.slice(13)] || "",
              })),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .catch((err) => console.error(err));
    }
  };

  const popular = [
    { name: "🍛 Biryani", keyword: "biryani" },
    { name: "🥗 Salad", keyword: "salad" },
    { name: "🍔 Burger", keyword: "burger" },
    { name: "🍲 Soup", keyword: "soup" },
    { name: "🎂 Cake", keyword: "cake" },
  ];

  useEffect(() => {
    fetchRandomForSlider();

    const savedRecipe = localStorage.getItem("selectedRecipe");
    if (savedRecipe) setSelectedRecipe(JSON.parse(savedRecipe));

    const handleScroll = () => {
      if (firstCardRef.current) {
        const topPos = firstCardRef.current.getBoundingClientRect().top;
        setShowTopBtn(topPos < -50);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelectRecipe = (meal) => {
    setSelectedRecipe(meal);
    localStorage.setItem("selectedRecipe", JSON.stringify(meal));
    window.scrollTo({ top: 0, behavior: "smooth" });
    setRecipes([meal]);
  };

  const handleCloseRecipe = () => {
    setSelectedRecipe(null);
    localStorage.removeItem("selectedRecipe");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-cover bg-center text-white dark:text-white transition-colors duration-300 flex flex-col">
      {/* Hero Section */}
      <div
        className="min-h-[90vh] flex flex-col items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm relative"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="text-center p-4 md:p-6 rounded-xl z-20 mt-32">
          <h1 className="text-5xl font-bold mb-2 text-orange-300">
            FoodFusion Hub
          </h1>
          <p className="text-lg italic opacity-90 mb-6 text-black">
            “Explore, Cook, and Savor the World of Flavors”
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 mb-6">
            <input
              type="text"
              placeholder="Search recipes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="p-2 md:p-3 rounded text-black w-full sm:w-1/2"
            />
            <button className="text-black" onClick={() => fetchRecipes(query)}>
              🔍 Search
            </button>
          </div>

          {/* Popular buttons */}
          <div className="overflow-x-auto whitespace-nowrap">
            <div className="flex gap-3 md:gap-4 justify-center items-center px-2">
              {popular.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setQuery(item.keyword);
                    fetchRecipes(item.keyword); // This will now work
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex flex-col items-center px-2 md:px-3 py-1 md:py-2 hover:bg-yellow-400 transition-all text-white animate-blink-animation mt-4"
                >
                  <span className="text-2xl">{item.name.split(" ")[0]}</span>
                  <span className="mt-1 text-xs text-black font-medium">
                    {item.name.split(" ")[1]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recipes Grid Section */}
      {recipes && (
        <section className="py-6 md:py-8 bg-gray-800 px-4 md:px-12 -mt-12 md:-mt-16">
          <h2 className="text-3xl font-bold text-center mb-6">Recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recipes.length > 0 ? (
              recipes.map((meal, index) => (
                <div
                  key={meal.idMeal}
                  className="relative"
                  ref={index === 0 ? firstCardRef : null}
                >
                  <RecipeCard
                    meal={meal}
                    onSave={saveToFavorites}
                    isSaved={favorites.some(
                      (fav) => fav.idMeal === meal.idMeal
                    )}
                    animation={index % 2 === 0 ? "left" : "right"}
                  />
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-white">
                {user ? "No recipes found" : "Please login to search recipes."}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Slider Section */}
      <section className="py-8 bg-gradient-to-r from-[#f8f8f9] via-[#e6e8ea] to-[#d6d9c9] mt-20">
        <h2 className="text-3xl font-bold text-center mb-6 text-black font-serif italic">
          Popular Dishes
        </h2>
        <div className="overflow-hidden w-full">
          <motion.div
            className="flex gap-6 px-6"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...sliderRecipes, ...sliderRecipes].map((meal, i) => (
              <div
                key={meal.idMeal + i}
                className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-500 shadow-lg cursor-pointer hover:scale-110 transition-transform"
                onClick={() => handleSelectRecipe(meal)}
              >
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cooking Tips */}
      <section className="py-12 px-6 md:px-20 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-8 text-orange-500">
          📖 Quick Cooking Tips
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            "Always preheat your pan 🔥",
            "Use fresh herbs 🌿 for flavor boost",
            "Don’t overcrowd the pan 🍳",
            "Store spices in a cool, dark place 🌶️",
            "Sharp knives = safer cutting 🔪",
            "Let meat rest before slicing 🥩",
            "Balance flavors: sweet, sour, salty ⚖️",
            "Clean as you go 🧽",
          ].map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                rotate: [0, 2, -2, 0],
                boxShadow: "0 12px 20px rgba(255,165,0,0.15)",
              }}
              className="bg-white/80 dark:bg-gray-700/70 text-gray-900 dark:text-white p-4 shadow-md cursor-pointer transform rounded-tl-[35px] rounded-tr-[10px] rounded-bl-[20px] rounded-br-[25px] w-40 h-32 flex flex-col items-center justify-center gap-2"
            >
              <Lightbulb className="text-yellow-400 text-xl" />
              <p className="font-medium text-sm text-center">{tip}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1470&q=80')`,
          }}
        ></div>

        <h2 className="text-4xl font-bold text-center mb-12 text-orange-600 z-10 relative">
          ✨Fun Food Facts
        </h2>

        <div className="relative flex flex-wrap justify-center gap-6 z-10">
          {[
            { emoji: "🍕", text: "Largest pizza ever baked: 1261 m²!" },
            { emoji: "🍫", text: "Chocolate was once currency!" },
            { emoji: "🥑", text: "Avocados are berries!" },
            { emoji: "🥦", text: "Broccoli is a flower!" },
            { emoji: "🥚", text: "Eggs can be different colors!" },
            { emoji: "🍓", text: "Strawberries aren’t true berries!" },
          ].map((fact, i) => (
            <motion.div
              key={i}
              initial={{ y: -40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              animate={{
                y: [0, -12, 0],
                x: [0, 8, -8, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "mirror",
                delay: i * 0.3,
                ease: "easeInOut",
              }}
              className="relative w-52 h-52 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/40 dark:bg-gray-800/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                <motion.span
                  className="text-5xl mb-2"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  {fact.emoji}
                </motion.span>
                <p className="font-medium text-gray-800 dark:text-white text-sm md:text-base">
                  {fact.text}
                </p>
              </div>
              {[...Array(5)].map((_, star) => (
                <motion.span
                  key={star}
                  className="absolute text-yellow-400 text-xs"
                  style={{
                    top: `${Math.random() * 80}%`,
                    left: `${Math.random() * 80}%`,
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + Math.random() * 2,
                  }}
                >
                  ⭐
                </motion.span>
              ))}
            </motion.div>
          ))}
        </div>
      </section>

      <ReviewSection user={user} token={token} />

      <Footer />

      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform z-50"
        >
          ⬆️
        </button>
      )}
    </div>
  );
};

export default Home;
