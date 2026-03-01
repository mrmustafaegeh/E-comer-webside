// Component/hero/AnimatedHeroSection.jsx
"use client";

import { useState, useEffect, useRef, Suspense, useMemo, memo } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// ✅ Critical LCP - static import
import HeroProductCard from "./Component/ProductCard";
import HeroTitle from "./Component/HeroTitle";
import CTAButtons from "./Component/CtpButton";
import ProductIndicators from "./Component/ProductIndicators";

// ✅ Lazy loaded components - strictly non-critical/interactive only
const AnimatedBadge = dynamic(() => import("./Component/AnimatedBadge"), {
  ssr: false,
  loading: () => <div className="h-8 w-40" />,
});

const StatsSection = dynamic(() => import("./Component/StatsComponent"), {
  ssr: false,
  loading: () => <div className="h-24" />,
});

const FloatingBadges = dynamic(() => import("./Component/FloatingBadges"), {
  ssr: false,
  loading: () => null,
});

function AnimatedHeroSection({ initialProducts = [] }) {
  const [activeProduct, setActiveProduct] = useState(0);
  const heroRef = useRef(null);

  // ✅ Normalize Data with Memoization
  const products = useMemo(() => {
    if (!initialProducts || initialProducts.length === 0) {
      // Demo fallback if server data fails
      return [
        {
          id: "demo-1",
          title: "Wireless Headphones Pro",
          price: "$199.99",
          oldPrice: "$299.99",
          discount: "-33%",
          rating: 4.9,
          imageUrl: null,
          emoji: "🎧",
          gradient: "from-gray-800 to-black",
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
          gradient: "from-gray-900 to-black",
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
          gradient: "from-gray-700 to-black",
        },
      ];
    }

    return initialProducts.map((p, idx) => ({
      id: p._id || p.id || `api-${idx}`,
      title: p.title || p.name || "Untitled Product",
      price: p.price ?? "",
      oldPrice: p.oldPrice ?? null,
      discount: p.discount ?? null,
      rating:
        typeof p.rating === "number" ? p.rating : Number(p.rating) || 4.8,
      imageUrl: p.imageUrl || null,
      emoji: p.emoji || "🛍️",
      gradient: p.gradient || "from-black to-black", // Force black
    }));
  }, [initialProducts]);

  // Handle auto-rotation
  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % products.length);
    }, 6000); // Slower rotation for premium feel

    return () => clearInterval(interval);
  }, [products.length]);

  useEffect(() => {
    let animationFrameId;

    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      
      animationFrameId = requestAnimationFrame(() => {
        const { left, top, width, height } = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        heroRef.current.style.setProperty('--mouse-x', x);
        heroRef.current.style.setProperty('--mouse-y', y);
      });
    };

    const heroEl = heroRef.current;
    if (heroEl) {
      heroEl.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (heroEl) {
        heroEl.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const currentProduct = products[activeProduct];

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={heroRef}
        className="hero-section relative bg-black overflow-hidden border-b border-white/10" 
        style={{ minHeight: "90vh" }}
        aria-label="Hero section"
      >
        {/* Subtle white radial glow from top left */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.03),transparent_60%)] pointer-events-none z-10"></div>
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
        
        <div className="relative z-20 max-w-[1600px] mx-auto px-6 lg:px-12 py-24 min-h-[90vh] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center w-full">
            {/* Left Column - Content */}
            <div className="space-y-12 text-center lg:text-left order-2 lg:order-1">
              <div className="min-h-[40px]">
                <Suspense fallback={<div className="h-8" />}>
                  <AnimatedBadge />
                </Suspense>
              </div>

              <div className="min-h-[250px]">
                <HeroTitle />
              </div>

              <div className="min-h-[80px]">
                <CTAButtons />
              </div>

              <div className="min-h-[120px] pt-12 border-t border-white/5">
                <Suspense fallback={<div className="h-24" />}>
                  <StatsSection />
                </Suspense>
              </div>
            </div>

            {/* Right Column - Product Visualization */}
            <div className="relative order-1 lg:order-2" style={{ minHeight: "500px" }}>
              <div className="product-card group relative transform-gpu" style={{
                transform: "rotateX(calc(var(--mouse-y, 0) * -16deg)) rotateY(calc(var(--mouse-x, 0) * 20deg))",
                transformStyle: "preserve-3d",
                transition: "transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)",
                willChange: "transform"
              }}>
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={currentProduct?.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.05, y: -20 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <HeroProductCard product={currentProduct} />
                  </m.div>
                </AnimatePresence>
                
                {/* Visual shadow effect for 3D feel */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-white/5 blur-3xl rounded-full"></div>
              </div>

              <Suspense fallback={null}>
                <FloatingBadges />
              </Suspense>

              <div className="absolute -bottom-12 lg:-bottom-24 left-0 right-0 z-30">
                <ProductIndicators
                  products={products}
                  activeProduct={activeProduct}
                  setActiveProduct={setActiveProduct}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

export default memo(AnimatedHeroSection);
