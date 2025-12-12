import { configureStore } from "@reduxjs/toolkit";
import sliderReducer from "./sliderSlice";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import productSlice from "./productSlice";
import adminProductSlice from "./adminProductSlice";
import orderSlice from "./orderSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    slider: sliderReducer,
    wishlist: wishlistReducer,
    products: productSlice,
    adminProducts: adminProductSlice,
    orders: orderSlice,
  },
});
