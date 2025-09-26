import React from "react";

const RecipeCard = ({ meal, onSave, isSaved, animation, user }) => {
  // animation: "left" | "right" | undefined
  const animationClass =
    animation === "left"
      ? "animate-slide-left"
      : animation === "right"
      ? "animate-slide-right"
      : "";

  const handleSave = () => {
    // Backend/localStorage dono ko handle parent karega (onSave)
    onSave(meal, user);
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 duration-300 ${animationClass}`}
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

        <h3 className="font-semibold mb-1 text-gray-700 dark:text-gray-300">
          🧂 Ingredients:
        </h3>
        <ul className="list-disc ml-5 text-sm text-gray-700 dark:text-gray-300">
          {Object.keys(meal)
            .filter((key) => key.startsWith("strIngredient") && meal[key])
            .map((key, i) => (
              <li key={i}>
                {meal[key]} - {meal[`strMeasure${key.slice(13)}`]}
              </li>
            ))}
        </ul>

        <h3 className="font-semibold mt-3 mb-1 text-gray-700 dark:text-gray-300">
          👨‍🍳 Recipe:
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {meal.strInstructions || "No instructions available."}
        </p>

        {/* 🎥 YouTube Button */}
        {meal.strYoutube && (
          <a
            href={meal.strYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 mb-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-all duration-200"
          >
            ▶️ Watch on YouTube
          </a>
        )}

        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`mt-2 w-full py-2 rounded font-semibold transition-all duration-200 ${
            isSaved
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {isSaved ? "✅ Saved" : "💾 Save to Favorites"}
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;