import React, { useState, useEffect } from "react";
import axios from "axios";

const ReviewSection = ({ user, token }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Fetch reviews from backend or fallback dummy
  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/reviews/");
      const formatted = res.data.map((r) => ({
        id: r.id,
        text: r.text,
        user: r.user || { username: "Anonymous" },
      }));
      setReviews(formatted);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      // Dummy fallback reviews
      setReviews([
        {
          id: 1,
          user: { username: "Areesha" },
          text: "Loved the Biryani recipe!",
        },
        {
          id: 2,
          user: { username: "Zoi" },
          text: "The Cake recipe was amazing!",
        },
        {
          id: 3,
          user: { username: "Ali" },
          text: "Burger recipe is my favorite!",
        },
      ]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Add review
  const handleAddReview = async () => {
    if (!newReview.trim() || !user) return;

    const reviewData = { text: newReview };

    try {
      const res = await axios.post(
        "http://localhost:8000/api/reviews/",
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([
        ...reviews,
        {
          id: res.data.id || Date.now(),
          text: newReview,
          user: { username: user.username },
        },
      ]);
      setNewReview("");
    } catch (err) {
      console.error("Failed to add review", err);
      setReviews([
        ...reviews,
        { id: Date.now(), text: newReview, user: { username: user.username } },
      ]);
      setNewReview("");
    }
  };

  // Edit review
  const handleEditReview = async (id) => {
    if (!editingText.trim()) return;
    try {
      await axios.put(
        `http://localhost:8000/api/reviews/${id}/`,
        { text: editingText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(
        reviews.map((r) =>
          r.id === id
            ? { ...r, text: editingText, user: { username: user.username } }
            : r
        )
      );
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error("Failed to edit review", err);
      setReviews(
        reviews.map((r) =>
          r.id === id
            ? { ...r, text: editingText, user: { username: user.username } }
            : r
        )
      );
      setEditingId(null);
      setEditingText("");
    }
  };

  // Delete review
  const handleDeleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/reviews/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete review", err);
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  return (
    <section className="py-12 px-6 md:px-20 bg-gray-50 dark:bg-gray-800">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-500">
        💬 User Reviews
      </h2>

      {/* Add Review (only logged-in user) */}
      {user && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-8">
          <input
            type="text"
            placeholder="Write your review..."
            value={editingId ? editingText : newReview}
            onChange={(e) =>
              editingId
                ? setEditingText(e.target.value)
                : setNewReview(e.target.value)
            }
            className="p-2 md:p-3 rounded w-full md:w-2/3 text-black"
          />
          {editingId ? (
            <button
              onClick={() => handleEditReview(editingId)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              Save
            </button>
          ) : (
            <button
              onClick={handleAddReview}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              Add Review
            </button>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white dark:bg-gray-700/70 p-4 rounded-lg shadow-md relative border-l-4 border-yellow-400 dark:border-yellow-300"
          >
            {/* Username in yellow for visibility */}
            <p className="font-medium text-sm mb-2 text-yellow-500 dark:text-yellow-400">
              {rev.user?.username || "Anonymous"}
            </p>

            <p className="text-gray-800 dark:text-white">{rev.text}</p>

            {/* Edit/Delete only for logged-in user's own reviews */}
            {user && rev.user?.username === user.username && (
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(rev.id);
                    setEditingText(rev.text);
                  }}
                  className="bg-teal-200 text-white px-3 py-1 rounded hover:bg-teal-300 transition text-xs shadow-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteReview(rev.id)}
                  className="bg-orange-200 text-white px-3 py-1 rounded hover:bg-orange-300 transition text-xs shadow-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;
