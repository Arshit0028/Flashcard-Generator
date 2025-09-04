import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiArrowLeft, FiTrash2, FiShare2 } from "react-icons/fi";
import { deleteFlashcard } from "../redux/flashcardSlice";

// Main component to display a single flashcard set
export default function FlashcardDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Find the flashcard by its ID
  const flashcard = useSelector((state) =>
    state.flashcards.items.find((fc) => fc.id === id)
  );

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this flashcard set?")) {
      dispatch(deleteFlashcard(id));
      navigate("/flashcards");
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/flashcards/${id}`;
    const title = flashcard?.title || "Flashcard Set";

    if (navigator.share) {
      // ✅ Native Web Share API
      navigator
        .share({
          title: title,
          text: `Check out this flashcard set: ${title}`,
          url: url,
        })
        .catch((err) => console.log("Share cancelled", err));
    } else {
      // ✅ Fallback (e.g., WhatsApp)
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `Check out this flashcard set: ${title} - ${url}`
      )}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  if (!flashcard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          ❌ Flashcard not found.
        </h2>
        <p className="text-gray-500 mt-2">
          It might have been deleted or the link is incorrect.
        </p>
        <Link
          to="/flashcards"
          className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md"
        >
          Go Back to My Flashcards
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with Navigation and Actions */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <FiArrowLeft size={20} /> <span className="font-medium">Back</span>
        </button>

        <div className="flex items-center gap-4">
          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <FiShare2 size={20} /> <span className="font-medium">Share</span>
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors"
          >
            <FiTrash2 size={20} /> <span className="font-medium">Delete Set</span>
          </button>
        </div>
      </div>

      {/* Main Flashcard Info Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 mb-10 border border-gray-200">
        {flashcard.image && (
          <img
            src={flashcard.image}
            alt={flashcard.title}
            className="w-full h-56 object-cover rounded-xl mb-6 shadow-sm"
          />
        )}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          {flashcard.title}
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          {flashcard.description}
        </p>
      </div>

      {/* Terms Section */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📘 Terms</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {flashcard.terms.map((t, index) => (
          <TermCard key={index} term={t} />
        ))}
      </div>
    </div>
  );
}

// A separate component for a single term card
const TermCard = ({ term }) => {
  return (
    <div className="bg-white border border-indigo-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-1">
      <h3 className="text-xl font-semibold text-indigo-700 mb-2">
        {term.term}
      </h3>
      <p className="text-gray-700 mb-3">{term.definition}</p>
      {term.image && (
        <img
          src={term.image}
          alt={term.term}
          className="w-full h-36 object-cover rounded-md mt-3"
        />
      )}
    </div>
  );
};
