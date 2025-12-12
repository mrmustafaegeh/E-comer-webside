"use client";

import { useState, useEffect } from "react";

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(stored);
  }, []);

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item._id === product._id);

      let updated;
      if (exists) {
        updated = prev.filter((item) => item._id !== product._id);
      } else {
        updated = [...prev, product];
      }

      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  return { wishlistItems, toggleWishlist };
}
