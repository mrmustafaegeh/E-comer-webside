"use client";

import HeroSlider from "../slider/HeroSlider";
import FeaturedProducts from "../features/FeaturedProducts";
import NewsletterSignup from "../features/NewLetterSignup";
import { FadeInUp, Floating } from "../../hooks/useAnimation.jsx";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/cartContext.jsx";
import { products } from "../lib/productData";

export default function HomePage() {
  const { addToCart } = useCart();
  const { t } = useTranslation();

  const safeTranslate = (key, fallback) => {
    try {
      const translation = t(key);
      return translation === key ? fallback : translation;
    } catch (error) {
      return fallback;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Slider */}
        <HeroSlider />

        {/* Featured Products */}
        <FadeInUp delay={0.3}>
          <FeaturedProducts products={products} addToCart={addToCart} />
        </FadeInUp>

        {/* Stats Section */}
        <section className="my-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                number: "10K+",
                label: safeTranslate("stats.customers", "Happy Customers"),
              },
              {
                number: "500+",
                label: safeTranslate("stats.products", "Products"),
              },
              {
                number: "24/7",
                label: safeTranslate("stats.support", "24/7 Support"),
              },
              {
                number: "5⭐",
                label: safeTranslate("stats.rating", "Top Rating"),
              },
            ].map((stat, index) => (
              <Floating key={index} intensity={0.03} duration={3 + index * 0.5}>
                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
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
                safeTranslate("badges.secure", "🔒 Secure Payments"),
                safeTranslate("badges.shipping", "🚚 Free Shipping"),
                safeTranslate("badges.quality", "💯 Quality Guarantee"),
              ].map((badge, index) => (
                <div key={index} className="text-2xl font-bold text-gray-400">
                  {badge}
                </div>
              ))}
            </div>
          </section>
        </FadeInUp>
      </div>
    </div>
  );
}
