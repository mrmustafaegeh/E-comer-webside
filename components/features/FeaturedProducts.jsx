"use client";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { productAPI } from "../lib/api";

const FeaturedProducts = () => {
  // Remove addToCart prop
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const productsData = await productAPI.getFeaturedProducts();
        setFeaturedProducts(productsData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="mb-12 mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg"></div>
              <div className="bg-gray-200 h-4 mt-2 rounded"></div>
              <div className="bg-gray-200 h-4 mt-1 rounded w-3/4"></div>
              <div className="bg-gray-200 h-6 mt-2 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ... rest of your component (remove addToCart from ProductCard)
  return (
    <section className="mb-12 mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {t("featured.title")}
        </h2>
        <Link
          href="/products"
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          {t("common.viewAll")} →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            // Remove addToCart prop here too
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
