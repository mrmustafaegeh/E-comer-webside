"use client";

import { useCart } from "../../context/cartContext";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [isRemoving, setIsRemoving] = useState(null);

  const parsePrice = (price) => {
    if (typeof price === "number") return price;

    const cleaned = price.toString().replace(/[^0-9.-]+/g, "");
    const parsed = parseFloat(cleaned);

    if (isNaN(parsed)) {
      console.warn(`Invalid price detected: ${price}`);
      return 0;
    }

    return parsed;
  };

  const validatedCartItems = cartItems
    .map((item) => ({
      ...item,
      price: parsePrice(item.price),
      qty: Math.max(1, Math.min(Number(item.qty) || 1, 99)),
      imgSrc: item.imgSrc || "/images/placeholder-product.jpg",
      id: item.id || Math.random().toString(36).substr(2, 9),
    }))
    .filter((item) => item.price > 0);

  const total = validatedCartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleRemove = async (id) => {
    setIsRemoving(id);
    await new Promise((resolve) => setTimeout(resolve, 300));
    removeFromCart(id);
    setIsRemoving(null);
  };

  if (validatedCartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-32 h-32 mb-6 text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-full h-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet
        </p>
        <motion.a
          href="/products"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
        >
          Continue Shopping
        </motion.a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto my-8 md:my-12 px-4 sm:px-6 max-w-6xl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
        >
          Your Shopping Cart
        </motion.h1>
        <motion.span
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
        >
          {validatedCartItems.length}{" "}
          {validatedCartItems.length === 1 ? "item" : "items"}
        </motion.span>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 divide-y divide-gray-100 border border-gray-100">
        <AnimatePresence>
          {validatedCartItems.map((item, index) => (
            <motion.div
              key={`${item.id}-${item.size || "default"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col md:flex-row justify-between items-start md:items-center p-6 transition-all duration-300 ${
                isRemoving === item.id
                  ? "opacity-0 scale-95"
                  : "opacity-100 hover:bg-blue-50/50"
              }`}
            >
              <div className="flex items-start w-full md:w-auto mb-4 md:mb-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden mr-4 flex-shrink-0 relative"
                >
                  <Image
                    src={item.imgSrc}
                    alt={item.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder-product.jpg";
                    }}
                  />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {formatPrice(item.price)} each
                  </p>
                  {item.size && (
                    <p className="text-gray-500 text-sm mt-1 bg-gray-100 px-2 py-1 rounded-md inline-block">
                      Size: {item.size}
                    </p>
                  )}
                  <div className="flex items-center mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.qty <= 1}
                        aria-label="Decrease quantity"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                          />
                        </svg>
                      </motion.button>
                      <span className="px-4 py-2 bg-white font-medium border-x border-gray-200 min-w-[3rem] text-center">
                        {item.qty}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-all"
                        onClick={() => increaseQuantity(item.id)}
                        aria-label="Increase quantity"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center w-full md:w-auto justify-between md:justify-end gap-4">
                <span className="text-gray-800 font-bold text-lg md:text-xl">
                  {formatPrice(item.price * item.qty)}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-all duration-200 hover:bg-red-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                  onClick={() => handleRemove(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                  disabled={isRemoving === item.id}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Order Summary */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 mb-8 border border-blue-100"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900 font-semibold">
              {formatPrice(total)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Shipping</span>
            <span className="text-green-600 font-semibold">Free</span>
          </div>
          <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
            <span className="text-lg font-bold">Total</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col-reverse sm:flex-row justify-end gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center font-medium shadow-lg hover:shadow-xl"
          onClick={clearCart}
          aria-label="Clear shopping cart"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Clear Cart
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 flex items-center justify-center font-medium shadow-lg hover:shadow-xl"
          aria-label="Proceed to checkout"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          Proceed to Checkout
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CartPage;
