import { configureStore } from "@reduxjs/toolkit";
import sliderReducer from "./sliderSlice";
import cartReducer from "./cartSlice";
import formReducer from "./formSlice";
import productReducer from "./productSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    slider: sliderReducer,
    form: formReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
