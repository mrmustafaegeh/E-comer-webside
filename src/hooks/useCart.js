// hooks/useCart.js
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../store/cartSlice";

import {
  selectCartItems,
  selectCartTotal,
  selectCartItemsCount,
  selectCartItemById,
} from "../store/cartSelectors";

export const useCart = () => {
  const dispatch = useDispatch();

  // Global selectors (safe)
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemsCount = useSelector(selectCartItemsCount);

  // New SAFE approach for selecting item by id:
  const getCartItem = (id) => {
    return useSelector((state) => selectCartItemById(id)(state));
  };

  return {
    // State
    cartItems,
    cartTotal,
    cartItemsCount,

    // Selectors
    getCartItem,

    // Actions
    addToCart: (product) => dispatch(addToCart(product)),
    increaseQuantity: (id) => dispatch(increaseQuantity(id)),
    decreaseQuantity: (id) => dispatch(decreaseQuantity(id)),
    removeFromCart: (id) => dispatch(removeFromCart(id)),
    clearCart: () => dispatch(clearCart()),
  };
};
