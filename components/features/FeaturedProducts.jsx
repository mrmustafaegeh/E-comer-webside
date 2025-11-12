"use client";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { productAPI } from "../lib/api";

const FeaturedProducts = ({ addToCart }) => {
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
          {/* Loading skeletons */}
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

  if (error) {
    return (
      <section className="mb-12 mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("featured.title")}
          </h2>
        </div>
        <div className="text-center py-8 text-red-600">
          <p>Error loading featured products: {error}</p>
        </div>
      </section>
    );
  }

  if (!featuredProducts || featuredProducts.length === 0) {
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
        <div className="text-center py-8">
          <p className="text-gray-500">No featured products available</p>
        </div>
      </section>
    );
  }

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
            addToCart={addToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
