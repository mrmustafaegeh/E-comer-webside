"use client";
import { StarIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product, addToCart }) => {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // This fixes the hydration issue
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Simple price formatting that works on both server and client
  const formatPrice = (price) => {
    const numPrice = typeof price === "number" ? price : parseFloat(price) || 0;
    return numPrice.toFixed(2);
  };

  // Don't render motion animations until mounted
  if (!isMounted) {
    return (
      <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
        <div className="h-48 sm:h-56 bg-gray-200"></div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {product.name}
          </h3>
          <span className="text-2xl font-bold text-green-600">
            ${formatPrice(product.price)}
          </span>
          <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold mt-4">
            {t("common.addToCart")}
          </button>
        </div>
      </div>
    );
  }

  // Your existing component logic here, but wrap motion components with isMounted check
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 flex flex-col h-full"
    >
      {/* Rest of your component */}
    </motion.div>
  );
};

export default ProductCard;
