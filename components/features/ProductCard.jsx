"use client";
import { StarIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatPrice = (price) => {
    const numPrice = typeof price === "number" ? price : parseFloat(price) || 0;
    return numPrice.toFixed(2);
  };

  // Map API fields to your expected fields
  const productData = {
    id: product.id,
    name: product.title,
    description: product.description,
    price: product.price,
    rating: product.rating?.rate || 0,
    image: product.image,
    category: product.category,
  };

  if (!isMounted) {
    return null;
  }

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 flex flex-col h-full"
    >
      <div className="relative h-48 sm:h-56 w-full bg-gray-100">
        {imageError ? (
          // Fallback UI when image fails to load
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-400">
            <svg
              className="w-12 h-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">No Image</span>
          </div>
        ) : (
          <img
            src={productData.image}
            alt={productData.name}
            className="w-full h-full object-contain p-4 bg-white"
            onError={handleImageError}
          />
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {productData.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {productData.description}
        </p>

        <div className="flex items-center mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(productData.rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-500">
            ({product.rating?.count || 0})
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            ${formatPrice(productData.price)}
          </span>

          <button
            onClick={() => addToCart(productData)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {t("common.addToCart")}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
