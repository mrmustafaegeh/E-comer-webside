"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full min-h-[80vh] bg-gray-900 flex items-center">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Full width container */}
      <div className="w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
            {/* Text Content */}
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in">
                {t("hero.title", "Amazing")}{" "}
                <span className="text-blue-400">
                  {t("hero.titleHighlight", "E-commerce Offers")}
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg animate-fade-in animation-delay-200">
                {t(
                  "hero.subtitle",
                  "Discover unbeatable deals on electronics, fashion, home goods and more. Shop now and save big!"
                )}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in animation-delay-400">
                <Link
                  href="/products"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition duration-300 transform hover:scale-105 text-center"
                >
                  {t("hero.shopNow", "Shop Now")}
                </Link>

                <Link
                  href="/FeaturedProducts"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 rounded-lg transition duration-300 text-center"
                >
                  {t("hero.browseCollections", "Browse Collections")}
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-700 max-w-md animate-fade-in animation-delay-600">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {t("hero.stats.products", "10K+")}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {t("hero.stats.productsLabel", "Products")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {t("hero.stats.support", "24/7")}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {t("hero.stats.supportLabel", "Support")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {t("hero.stats.customers", "50K+")}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {t("hero.stats.customersLabel", "Happy Customers")}
                  </div>
                </div>
              </div>
            </div>

            {/* Image/Visual Content */}
            <div className="relative animate-fade-in animation-delay-300">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
                  <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <svg
                        className="w-20 h-20 mx-auto mb-4 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-xl font-semibold mb-2">
                        {t("hero.showcase.title", "Hot Deals")}
                      </p>
                      <p className="text-gray-400">
                        {t("hero.showcase.subtitle", "Limited Time Offers")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3 bg-blue-500 text-white px-3 py-1 rounded-lg shadow-lg text-sm animate-float">
                {t("hero.badges.new", "🔥 New")}
              </div>
              <div className="absolute -bottom-3 -left-3 bg-green-500 text-white px-3 py-1 rounded-lg shadow-lg text-sm animate-float animation-delay-1000">
                {t("hero.badges.fast", "⚡ Fast")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}
