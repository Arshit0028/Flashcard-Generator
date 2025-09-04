import { configureStore } from "@reduxjs/toolkit";
import flashcardReducer from "./flashcardSlice";

const store = configureStore({
  reducer: {
    flashcards: flashcardReducer,
  },
});

export default store;
