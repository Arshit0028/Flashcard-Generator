import { createSlice } from "@reduxjs/toolkit";

// Load flashcards from localStorage (if any)
const loadFlashcards = () => {
  try {
    const stored = localStorage.getItem("flashcards");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save flashcards to localStorage
const saveFlashcards = (flashcards) => {
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
};

const flashcardSlice = createSlice({
  name: "flashcards",
  initialState: {
    items: loadFlashcards(),
  },
  reducers: {
    addFlashcard: (state, action) => {
      state.items.push(action.payload);
      saveFlashcards(state.items);
    },
    deleteFlashcard: (state, action) => {
      state.items = state.items.filter((fc) => fc.id !== action.payload);
      saveFlashcards(state.items);
    },
  },
});

export const { addFlashcard, deleteFlashcard } = flashcardSlice.actions;
export default flashcardSlice.reducer;
