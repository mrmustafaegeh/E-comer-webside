// src/store/slices/wishlistSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getInitial = () => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("wishlist");
    return raw ? JSON.parse(raw) : [];
  }
  return [];
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: getInitial() },
  reducers: {
    addToWishlist(state, action) {
      const item = action.payload;
      if (!state.items.find((i) => i.id === item.id)) {
        state.items.push(item);
      }
      if (typeof window !== "undefined")
        localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
    removeFromWishlist(state, action) {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
      if (typeof window !== "undefined")
        localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
    clearWishlist(state) {
      state.items = [];
      if (typeof window !== "undefined") localStorage.removeItem("wishlist");
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
