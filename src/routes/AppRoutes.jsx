// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import CreateFlashcard from "../pages/CreateFlashcard";
import MyFlashcards from "../pages/MyFlashcards";
import FlashcardDetails from "../pages/FlashcardDetails";

// ✅ MUST have default export
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CreateFlashcard />} />
      <Route path="/flashcards" element={<MyFlashcards />} />
      <Route path="/flashcards/:id" element={<FlashcardDetails />} />
    </Routes>
  );
}
