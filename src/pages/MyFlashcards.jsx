import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FiTrash2, FiExternalLink, FiShare2 } from "react-icons/fi";
import { deleteFlashcard } from "../redux/flashcardSlice";
import { useState } from "react";

export default function MyFlashcards() {
  const flashcards = useSelector((state) => state.flashcards.items);
  const dispatch = useDispatch();
  const [copiedId, setCopiedId] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this flashcard?")) {
      dispatch(deleteFlashcard(id));
    }
  };

  const handleShare = (id) => {
    const url = `${window.location.origin}/flashcards/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">
        📂 My Flashcards
      </h1>

      {flashcards.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          No flashcards created yet.{" "}
          <Link
            to="/"
            className="text-indigo-600 font-medium hover:underline ml-1"
          >
            Create one
          </Link>
          ✨
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map((fc) => (
            <div
              key={fc.id}
              className="bg-white shadow-md hover:shadow-xl border rounded-2xl p-6 transition-all flex flex-col"
            >
              {/* Flashcard */}
              <div className="flex-1">
                {fc.image && (
                  <img
                    src={fc.image}
                    alt={fc.title}
                    className="w-full h-32 object-cover rounded-xl mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {fc.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {fc.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {fc.terms.length} terms
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 mt-6">
                <Link
                  to={`/flashcards/${fc.id}`}
                  className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition text-sm"
                >
                  <FiExternalLink size={16} /> View
                  </Link>

                <button
                  onClick={() => handleShare(fc.id)}
                  className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-2 rounded-md hover:bg-indigo-100 transition text-sm relative"
                  >
                  <FiShare2 size={16} /> Share
                  {copiedId === fc.id && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded shadow">
                      Copied!
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(fc.id)}
                  className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100 transition text-sm"
                  >
                  <FiTrash2 size={16} /> Delete
                    </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
