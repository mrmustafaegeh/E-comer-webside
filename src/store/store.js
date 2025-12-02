import { configureStore } from "@reduxjs/toolkit";
import sliderReducer from "./sliderSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    slider: sliderReducer,
  },
});
