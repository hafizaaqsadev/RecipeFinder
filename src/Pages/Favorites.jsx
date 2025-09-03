import React, { useState, useEffect } from "react";
import bg from "../assets/bg.jpeg";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [fetchedRecipes, setFetchedRecipes] = useState({});

  // Load from localStorage when component mounts
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

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

  const handleRemove = (mealId) => {
    const updated = favorites.filter((m) => m.idMeal !== mealId);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    if (expandedId === mealId) {
      setExpandedId(null);
    }
  };

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
                        {fullMeal.strInstructions || "No instructions available."}
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
    </div>
  );
};

export default Favorites;
