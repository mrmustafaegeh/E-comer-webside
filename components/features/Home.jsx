"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { products } from "../../components/lib/productData.jsx";
import { useCart } from "../../context/cartContext.jsx";
import FeaturedProducts from "./FeaturedProducts.jsx";
import NewsletterSignup from "./NewLetterSignup.jsx";
import { FadeInUp, Floating } from "../../hooks/useAnimation.jsx";

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideRef = useRef(null);
  const intervalRef = useRef(null);
  const { addToCart } = useCart();

  const filteredProducts = products.filter((product) => product.rating >= 4.5);

  const slides = [
    {
      src: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      alt: "Modern electronics store with displays",
      cta: "Explore Our Showroom",
      description: "Discover the latest in technology",
    },
    {
      src: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      alt: "Electronics shop with various gadgets",
      cta: "New Arrivals Just In",
      description: "Fresh tech waiting for you",
    },
    {
      src: "https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      alt: "Store section with smartphones on display",
      cta: "Premium Smartphones 25% OFF",
      description: "Limited time offer",
    },
  ];

  const scrollToIndex = useCallback((index) => {
    if (slideRef.current) {
      const slideWidth = slideRef.current.clientWidth;
      slideRef.current.scrollTo({
        left: index * slideWidth,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (!isPaused) {
      const nextIndex = (currentIndex + 1) % slides.length;
      scrollToIndex(nextIndex);
    }
  }, [currentIndex, scrollToIndex, slides.length, isPaused]);

  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    scrollToIndex(prevIndex);
  }, [currentIndex, scrollToIndex, slides.length]);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(handleNext, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [handleNext, isPaused]);

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Carousel Section */}
        <section
          className="relative rounded-2xl overflow-hidden bg-gray-900 mb-12 shadow-2xl"
          onMouseEnter={handlePause}
          onMouseLeave={handleResume}
          aria-label="Featured products carousel"
        >
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-2xl">
            <ul
              ref={slideRef}
              className="flex w-full h-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
              style={{ scrollBehavior: "smooth" }}
            >
              {slides.map((slide, index) => (
                <li
                  key={index}
                  className="min-w-full h-full snap-start relative flex-shrink-0"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      className="object-cover brightness-75"
                      priority={index === 0}
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

                    <div className="absolute inset-0 flex items-center">
                      <div className="ml-8 md:ml-16 text-white max-w-md lg:max-w-2xl">
                        <FadeInUp delay={0.2}>
                          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                            {slide.cta}
                          </h2>
                        </FadeInUp>

                        {slide.description && (
                          <FadeInUp delay={0.4}>
                            <p className="text-lg md:text-xl text-gray-200 mb-6">
                              {slide.description}
                            </p>
                          </FadeInUp>
                        )}

                        <FadeInUp delay={0.6}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Link
                              href="/products"
                              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-3xl"
                            >
                              Shop Now
                              <ChevronRight className="ml-2 w-5 h-5" />
                            </Link>
                          </motion.div>
                        </FadeInUp>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Navigation Buttons */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-300"
            >
              <ChevronLeft size={28} className="text-white" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-300"
            >
              <ChevronRight size={28} className="text-white" />
            </motion.button>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
              {slides.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => scrollToIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "bg-white w-8"
                      : "bg-white/50 w-3 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Auto-play Status */}
            <div className="absolute top-4 right-4 z-10">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-3 h-3 rounded-full ${
                  isPaused ? "bg-red-400" : "bg-green-400"
                }`}
              />
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <FadeInUp delay={0.3}>
          <FeaturedProducts products={filteredProducts} addToCart={addToCart} />
        </FadeInUp>

        {/* Stats Section */}
        <section className="my-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "10K+", label: "Happy Customers", color: "blue" },
              { number: "500+", label: "Products", color: "green" },
              { number: "24/7", label: "Support", color: "purple" },
              { number: "5⭐", label: "Rating", color: "orange" },
            ].map((stat, index) => (
              <Floating key={index} intensity={0.03} duration={3 + index * 0.5}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              </Floating>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <FadeInUp delay={0.5}>
          <NewsletterSignup />
        </FadeInUp>

        {/* Trust Badges */}
        <FadeInUp delay={0.7}>
          <section className="text-center py-8">
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              {[
                "🔒 Secure Payments",
                "🚚 Free Shipping",
                "💯 Quality Guarantee",
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="text-2xl font-bold text-gray-400"
                >
                  {badge}
                </motion.div>
              ))}
            </div>
          </section>
        </FadeInUp>
      </div>
    </div>
  );
};

export default Home;
