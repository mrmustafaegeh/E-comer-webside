"use client";

import { StarIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/app/store/cartSlice";
import { fakestoreLoader } from "@/components/lib/loaders";

const ADD_TO_CART_ARIA_LABEL = "Add to cart";
const ADDED_TO_CART_TEXT = "Added to Cart";

const ProductCard = ({ product, index = 0 }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatPrice = (price) => parseFloat(price).toFixed(2);

  const isPriorityImage = index < 2;
  const isInCart = cartItems.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
      })
    );
  };

  return (
    // ❗ Replaced div with <article> (correct semantic structure)
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 flex flex-col h-full"
    >
      {/* IMAGE */}
      <div className="relative h-48 sm:h-56 w-full bg-gray-100 overflow-hidden">
        {imageError ? (
          <div
            className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-400"
            role="img"
            aria-label={`Image for ${product.title} failed to load`}
          >
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
          <>
            {imageLoading && (
              <div
                className="absolute inset-0 bg-gray-200 animate-pulse z-10"
                role="status"
              >
                <span className="sr-only">Loading product image...</span>
              </div>
            )}

            <Image
              loader={fakestoreLoader}
              src={product.image}
              alt={product.title}
              width={400}
              height={400}
              loading={isPriorityImage ? "eager" : "lazy"}
              priority={isPriorityImage}
              className={`w-full h-full object-contain p-4 bg-white transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              onLoad={() => setImageLoading(false)}
              sizes="(max-width: 640px) 100vw,
                     (max-width: 768px) 50vw,
                     (max-width: 1024px) 33vw,
                     25vw"
              unoptimized={true}
            />
          </>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {product.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {product.description}
        </p>

        {/* RATING */}
        <div
          className="flex items-center mb-4"
          aria-label={`Rating ${product.rating?.rate || 0} out of 5`}
        >
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(product.rating?.rate || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-500">
            {product.rating?.rate || 0} ({product.rating?.count || 0})
          </span>
        </div>

        {/* PRICE + ADD BUTTON */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            ${formatPrice(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              isInCart
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            aria-label={
              isInCart
                ? `${ADDED_TO_CART_TEXT}: ${product.title}`
                : `${ADD_TO_CART_ARIA_LABEL}: ${product.title}`
            }
          >
            {isInCart ? ADDED_TO_CART_TEXT : t("Add to Cart")}
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
