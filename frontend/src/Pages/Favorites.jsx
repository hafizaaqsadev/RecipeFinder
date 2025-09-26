import React, { useState, useEffect } from "react";
import bg from "../assets/bg.jpeg";

const Favorites = ({ user, token, handleLogout }) => {
  const [favorites, setFavorites] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [fetchedRecipes, setFetchedRecipes] = useState({});

  // ✅ Favorites load karo
  useEffect(() => {
    if (!user || !token) {
      const storedFavorites =
        JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(storedFavorites);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/favorites/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        } else {
          const storedFavorites =
            JSON.parse(localStorage.getItem("favorites")) || [];
          setFavorites(storedFavorites);
        }
      } catch (err) {
        const storedFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
      }
    };

    fetchFavorites();
  }, [user, token]);

  // ✅ Recipe expand + fetch details
  const handleClick = async (meal) => {
    const mealId = meal.idMeal;

    if (expandedId === mealId) {
      setExpandedId(null);
      return;
    }

    if (!fetchedRecipes[mealId]) {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
        );
        const data = await res.json();
        const fullMeal = data.meals?.[0] || {
          ...meal,
          strInstructions: "No detailed recipe found.",
        };
        setFetchedRecipes((prev) => ({
          ...prev,
          [mealId]: fullMeal,
        }));
      } catch (error) {
        setFetchedRecipes((prev) => ({
          ...prev,
          [mealId]: {
            ...meal,
            strInstructions: "❌ Error fetching recipe details.",
          },
        }));
      }
    }

    setExpandedId(mealId);
  };

  // ✅ Remove favorite
  const handleRemove = async (mealId) => {
    const updated = favorites.filter((m) => m.idMeal !== mealId);
    setFavorites(updated);

    localStorage.setItem("favorites", JSON.stringify(updated));

    if (token) {
      await fetch(`http://localhost:8000/api/favorites/${mealId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (expandedId === mealId) {
      setExpandedId(null);
    }
  };

  // ✅ Add favorite
  const handleAddFavorite = async (meal) => {
    if (!meal?.idMeal) return;

    const alreadyAdded = favorites.some((fav) => fav.idMeal === meal.idMeal);
    if (alreadyAdded) return;

    const updated = [...favorites, meal];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));

    if (token) {
      await fetch("http://localhost:8000/api/favorites/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(meal),
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-800 dark:text-white">
        <h2 className="text-2xl font-bold mb-4">
          Please login to view your favorites ❤️
        </h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-6 bg-cover bg-center dark:bg-gray-900"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        ❤️ Your Favorite Recipes
      </h1>

      {favorites.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          You haven’t saved any recipes yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((meal) => {
            const isExpanded = expandedId === meal.idMeal;
            const fullMeal = fetchedRecipes[meal.idMeal] || meal;

            return (
              <div
                key={meal.idMeal}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isExpanded ? "max-h-fit" : "max-h-[340px]"
                }`}
                onClick={() => handleClick(meal)}
              >
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                    {meal.strMeal}
                  </h2>

                  {isExpanded && fullMeal && (
                    <>
                      {fullMeal.strYoutube && (
                        <a
                          href={fullMeal.strYoutube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mb-3 text-blue-600 dark:text-blue-400 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          ▶️ Watch on YouTube
                        </a>
                      )}

                      <h3 className="font-semibold mb-1 text-gray-700 dark:text-gray-300">
                        🧂 Ingredients:
                      </h3>
                      <ul className="list-disc ml-5 text-sm text-gray-700 dark:text-gray-300">
                        {Array.from({ length: 20 }, (_, i) => {
                          const ingredient = fullMeal[`strIngredient${i + 1}`];
                          const measure = fullMeal[`strMeasure${i + 1}`];
                          return ingredient && ingredient.trim() !== "" ? (
                            <li key={i}>
                              {ingredient} - {measure}
                            </li>
                          ) : null;
                        })}
                      </ul>

                      <h3 className="font-semibold mt-3 mb-1 text-gray-700 dark:text-gray-300">
                        👨‍🍳 Recipe:
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {fullMeal.strInstructions ||
                          "No instructions available."}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(meal.idMeal);
                        }}
                        className="mt-4 w-full py-2 rounded font-semibold bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                      >
                        ❌ Remove from Favorites
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Test button: Add dummy recipe */}
      {/* <button
        onClick={() =>
          handleAddFavorite({
            idMeal: "52772",
            strMeal: "Chicken Handi",
            strMealThumb:
              "https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg",
          })
        }
        className="mt-6 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
      >
        ➕ Add Test Recipe
      </button> */}
    </div>
  );
};

export default Favorites; 