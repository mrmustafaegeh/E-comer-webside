"use client";
import AnimatedBackground from "./AnimatedBackground";
import { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

export default function AnimatedHeroSection() {
  const [activeProduct, setActiveProduct] = useState(0);
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  const products = [
    {
      title: "Wireless Headphones",
      price: "$199.99",
      oldPrice: "$299.99",
      discount: "-33%",
      rating: 4.9,
      image: "🎧",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      title: "Smart Watch Pro",
      price: "$349.99",
      oldPrice: "$499.99",
      discount: "-30%",
      rating: 4.8,
      image: "⌚",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      title: "Premium Camera",
      price: "$899.99",
      oldPrice: "$1299.99",
      discount: "-31%",
      rating: 5.0,
      image: "📷",
      gradient: "from-pink-500 to-orange-600",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden">
      <AnimatedBackground />

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen flex items-center"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <AnimatedBadge />
            <HeroTitle />
            <CTAButtons />
            <StatsSection />
          </div>

          {/* Right Content - Product Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <ProductCard
                key={activeProduct}
                product={products[activeProduct]}
              />
            </AnimatePresence>

            <FloatingBadges />
            <ProductIndicators
              products={products}
              activeProduct={activeProduct}
              setActiveProduct={setActiveProduct}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll for More Content Demo */}
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
