import { configureStore } from "@reduxjs/toolkit";
import sliderReducer from "./sliderSlice";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    slider: sliderReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
