"use client";
import { useState, useEffect } from "react";
import HeroSlider from "../slider/HeroSlider";
import FeaturedProducts from "../features/FeaturedProducts";
import { useCart } from "@/context/cartContext"; // Import cart context

export default function HomePage() {
  const { addToCart } = useCart(); // Get addToCart function

  return (
    <>
      <HeroSlider />
      <FeaturedProducts addToCart={addToCart} /> {/* Pass addToCart */}
    </>
  );
}
