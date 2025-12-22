"use client";

import AnimatedBackground from "./Component/AnimatedBackground";
import { useState, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import AnimatedBadge from "./Component/AnimatedBadge";
import HeroTitle from "./Component/HeroTitle";
import CTAButtons from "./Component/CtpButton";
import StatsSection from "./Component/StatsComponent";

import ProductCard from "./Component/ProductCard";
import ProductIndicators from "./Component/ProductIndicators";
import FloatingBadges from "./Component/FloatingBadges";
import HeroProductSkeleton from "./Component/HeroProductSkeleton";

import { useHeroProducts } from "../../hooks/useHeroProducts";

export default function AnimatedHeroSection() {
  const [activeProduct, setActiveProduct] = useState(0);
  const { scrollYProgress } = useScroll();

  const { products, loading, error } = useHeroProducts();

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  // ✅ demo products (same SHAPE as API)
  const defaultProducts = useMemo(
    () => [
      {
        id: "demo-1",
        title: "Wireless Headphones Pro",
        price: "$199.99",
        oldPrice: "$299.99",
        discount: "-33%",
        rating: 4.9,
        imageUrl: null,
        emoji: "🎧",
        gradient: "from-blue-500 to-purple-600",
      },
      {
        id: "demo-2",
        title: "Smart Watch Ultra",
        price: "$349.99",
        oldPrice: "$499.99",
        discount: "-30%",
        rating: 4.8,
        imageUrl: null,
        emoji: "⌚",
        gradient: "from-purple-500 to-pink-600",
      },
      {
        id: "demo-3",
        title: "Premium Camera 4K",
        price: "$899.99",
        oldPrice: "$1299.99",
        discount: "-31%",
        rating: 5.0,
        imageUrl: null,
        emoji: "📷",
        gradient: "from-pink-500 to-orange-600",
      },
    ],
    []
  );

  // ✅ Normalize API products to the SAME shape as ProductCard expects
  const normalizeHeroProducts = (arr) =>
    (arr ?? []).map((p, idx) => ({
      id: p._id || p.id || `api-${idx}`,
      title: p.title || p.name || "Untitled Product",

      // ✅ keep strings from API like "$199.99"
      price: p.price ?? "",
      oldPrice: p.oldPrice ?? null,

      discount: p.discount ?? null,
      rating: typeof p.rating === "number" ? p.rating : Number(p.rating) || 4.8,

      // ✅ IMPORTANT: correct API keys
      imageUrl: p.imageUrl || null,
      emoji: p.emoji || "🛍️",

      gradient: p.gradient || "from-slate-700 to-slate-900",
    }));

  // ✅ Decide what to display
  const displayProducts = useMemo(() => {
    if (loading) return defaultProducts;
    const normalized = normalizeHeroProducts(products);
    return normalized.length > 0 ? normalized : defaultProducts;
  }, [products, loading, defaultProducts]);

  // ✅ Keep activeProduct safe when list changes
  useEffect(() => {
    if (activeProduct >= displayProducts.length) setActiveProduct(0);
  }, [activeProduct, displayProducts.length]);

  // ✅ Auto-rotate products
  useEffect(() => {
    if (displayProducts.length <= 1) return;

    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % displayProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [displayProducts.length]);

  const handleProductSelect = (index) => setActiveProduct(index);

  const currentProduct = displayProducts[activeProduct];

  return (
    <div className="relative bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden">
      <AnimatedBackground />

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen flex items-center"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* Left */}
          <div className="space-y-8 text-center lg:text-left">
            <AnimatedBadge />
            <HeroTitle />
            <CTAButtons />
            <StatsSection />
          </div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
            className="relative"
          >
            {/* Loading */}
            {loading ? (
              <HeroProductSkeleton />
            ) : (
              <>
                {/* Error Warning */}
                {!loading && error ? (
                  <div className="mb-3 text-center lg:text-left">
                    <p className="text-sm text-yellow-400">
                      Couldn’t load hero products. Showing demo products.
                    </p>
                  </div>
                ) : null}

                <AnimatePresence mode="wait">
                  <ProductCard
                    key={currentProduct?.id}
                    product={currentProduct}
                  />
                </AnimatePresence>

                <FloatingBadges />

                <ProductIndicators
                  products={displayProducts}
                  activeProduct={activeProduct}
                  setActiveProduct={handleProductSelect}
                />
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom demo section */}
      <div className="relative z-10 py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Featured Categories
            </h2>
            <p className="text-gray-400 mb-12">
              Explore our curated collection of premium products
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {["Electronics", "Fashion", "Home & Living"].map(
                (category, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10"
                  >
                    <div className="text-5xl mb-4">
                      {idx === 0 ? "💻" : idx === 1 ? "👔" : "🏠"}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {category}
                    </h3>
                    <p className="text-gray-400">Discover amazing deals</p>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
