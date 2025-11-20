"use client";

// ✅ Custom loader for external images
export const fakestoreLoader = ({ src, width, quality }) => {
  return src;
};

export const optimizedLoader = ({ src, width, quality = 75 }) => {
  return src;
};
