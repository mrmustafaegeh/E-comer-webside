// app/components/component/ProductCard.jsx
"use client";

import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  if (!product) return null;

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const isImagePath =
    typeof product.image === "string" &&
    (product.image.startsWith("/") || product.image.startsWith("http"));

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: 90 }}
      transition={{ duration: 0.6 }}
      className="relative group"
    >
      {/* Glow */}
      <motion.div
        className={`absolute -inset-1 bg-gradient-to-r ${product.gradient} rounded-2xl blur opacity-25`}
        animate={{ opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Card */}
      <motion.div
        whileHover={{ y: -10 }}
        className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-8 backdrop-blur-xl border border-white/10"
      >
        {/* Image / Emoji */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700 mb-6 flex items-center justify-center"
        >
          {isImagePath ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="text-9xl">{product.image}</div>
          )}
        </motion.div>

        {/* Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold text-white">
              {product.title}
            </h3>

            <div className="flex items-center gap-1 shrink-0">
              <svg
                className="w-5 h-5 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="text-white font-medium">
                {Number(product.rating).toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              {product.oldPrice ? (
                <p className="text-sm text-gray-400 line-through">
                  {product.oldPrice}
                </p>
              ) : (
                <p className="text-sm text-gray-400">&nbsp;</p>
              )}
              <p className="text-2xl font-bold text-white">{product.price}</p>
            </div>

            {product.discount ? (
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`px-4 py-2 bg-gradient-to-r ${product.gradient} text-white text-sm font-bold rounded-full`}
              >
                {product.discount}
              </motion.div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
