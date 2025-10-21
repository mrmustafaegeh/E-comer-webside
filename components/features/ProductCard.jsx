"use client";
import { StarIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product, addToCart }) => {
  const { t, i18n } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Safe translation function for products
  const safeTranslate = (key, fallback) => {
    return i18n.exists(key) ? t(key) : fallback;
  };

  // Get product translation key from product name
  const getProductKey = (productName) => {
    return productName
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");
  };

  const productKey = getProductKey(product.name);
  const translatedName = safeTranslate(
    `products.${productKey}.name`,
    product.name
  );
  const translatedDescription = safeTranslate(
    `products.${productKey}.description`,
    product.description || t("common.description")
  );

  const getPrice = (price) => {
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      const numericPrice = parseFloat(price.replace(/[^\d.-]/g, ""));
      return isNaN(numericPrice) ? 0 : numericPrice;
    }
    return 0;
  };

  const productPrice = getPrice(product.price);
  const productOfferPrice = product.offerPrice
    ? getPrice(product.offerPrice)
    : null;

  const handleAddToCart = async () => {
    if (!addToCart) {
      console.error("addToCart function is not available");
      return;
    }

    setIsAdding(true);
    try {
      const cartProduct = {
        id: product.id,
        name: product.name, // Keep original name for cart operations
        price: productOfferPrice || productPrice,
        imgSrc: product.imgSrc || "/images/placeholder-product.jpg",
        qty: 1,
        ...(product.size && { size: product.size }),
        ...(product.color && { color: product.color }),
      };

      addToCart(cartProduct);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const renderRatingStars = (rating) => {
    const numericRating =
      typeof rating === "number" ? rating : parseFloat(rating) || 0;
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(numericRating)
            ? "text-yellow-400 fill-current"
            : index === Math.floor(numericRating) && numericRating % 1 >= 0.5
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getSafeImageSrc = (imgSrc) => {
    if (!imgSrc) return "/images/placeholder-product.jpg";
    if (imgSrc.startsWith("http")) return imgSrc;
    if (imgSrc.startsWith("/")) return imgSrc;
    return `/${imgSrc}`;
  };

  const safeImgSrc = getSafeImageSrc(product.imgSrc);
  const rating =
    typeof product.rating === "number"
      ? product.rating
      : parseFloat(product.rating) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={imageError ? "/images/placeholder-product.jpg" : safeImgSrc}
          alt={translatedName}
          className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.isNew && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
            >
              {t("common.new")}
            </motion.span>
          )}
          {productOfferPrice && productOfferPrice < productPrice && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full"
            >
              {t("common.sale")}
            </motion.span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Rating and Name */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 flex-1 mr-2 leading-tight">
            {translatedName}
          </h3>
          <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-lg">
            {renderRatingStars(rating)}
            <span className="text-xs font-semibold text-gray-700 ml-1">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-grow">
          {translatedDescription}
        </p>

        {/* Price and Add to Cart */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              {productOfferPrice && productOfferPrice < productPrice ? (
                <>
                  <span className="text-2xl font-bold text-green-600">
                    ${productOfferPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${productPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-green-600">
                  ${productPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
              isAdding
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white relative overflow-hidden`}
          >
            {isAdding ? (
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                {t("common.adding")}
              </div>
            ) : (
              t("common.addToCart")
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
