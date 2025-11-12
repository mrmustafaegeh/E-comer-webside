"use client";
import { StarIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product, addToCart }) => {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

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
    name: product.title, // API uses 'title' instead of 'name'
    description: product.description,
    price: product.price,
    rating: product.rating?.rate || 0, // API has rating.rate
    image: product.image, // API uses 'image' instead of 'imgSrc'
    category: product.category,
  };

  if (!isMounted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 flex flex-col h-full"
    >
      <div className="relative h-48 sm:h-56 w-full">
        <img
          src={productData.image}
          alt={productData.name}
          className="w-full h-full object-contain p-4 bg-white"
          onError={(e) => {
            e.target.src = "/images/placeholder.jpg";
          }}
        />
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
