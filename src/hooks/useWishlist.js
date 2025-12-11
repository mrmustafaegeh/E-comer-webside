// src/hooks/useWishlist.js
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../store/wishlistSlice";

export const useWishlist = () => {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.wishlist.items);

  return {
    items,
    count: items.length,
    isSaved: (id) => items.some((i) => i.id === id),
    add: (product) => dispatch(addToWishlist(product)),
    remove: (id) => dispatch(removeFromWishlist(id)),
    clear: () => dispatch(clearWishlist()),
  };
};
