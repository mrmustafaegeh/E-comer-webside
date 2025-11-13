"use client";
import { Suspense } from "react";
import HeroSlider from "../slider/HeroSlider";
import dynamic from "next/dynamic";
import { useCart } from "@/hooks/useCart";
import NewsletterSignup from "../features/NewLetterSignup";

const FeaturedProducts = dynamic(() => import("../features/FeaturedProducts"), {
  ssr: false,
  loading: () => (
    <section className="mb-12 mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg"></div>
            <div className="bg-gray-200 h-4 mt-2 rounded"></div>
            <div className="bg-gray-200 h-4 mt-1 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </section>
  ),
});

export default function HomePage() {
  const { addToCart } = useCart();

  return (
    <>
      <Suspense fallback={<div className="min-h-[80vh] bg-gray-900" />}>
        <HeroSlider />
      </Suspense>
      <FeaturedProducts className="max-w-7xl" addToCart={addToCart} />
      <NewsletterSignup />
    </>
  );
}
