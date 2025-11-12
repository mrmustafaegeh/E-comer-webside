import { configureStore } from "@reduxjs/toolkit";
import sliderReducer from "./sliderSlice";

export const store = configureStore({
  reducer: {
    slider: sliderReducer,
  },
});
