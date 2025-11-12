"use client";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full min-h-[80vh] bg-gray-900 flex items-center overflow-hidden">
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
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                {t("hero.title")}{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {t("hero.titleHighlight")}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg"
              >
                {t("hero.subtitle")}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <a
                  href="#shop"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition duration-300 transform hover:scale-105 text-center"
                >
                  {t("hero.shopNow")}
                </a>
                <a
                  href="#collections"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 rounded-lg transition duration-300 text-center"
                >
                  {t("hero.browseCollections")}
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-700 max-w-md"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {t("hero.stats.products")}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {t("hero.stats.productsLabel")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {t("hero.stats.support")}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {t("hero.stats.supportLabel")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {t("hero.stats.customers")}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {t("hero.stats.customersLabel")}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Image/Visual Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative"
            >
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
                        {t("hero.showcase.title")}
                      </p>
                      <p className="text-gray-400">
                        {t("hero.showcase.subtitle")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-3 -right-3 bg-blue-500 text-white px-3 py-1 rounded-lg shadow-lg text-sm"
              >
                {t("hero.badges.new")}
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-3 -left-3 bg-green-500 text-white px-3 py-1 rounded-lg shadow-lg text-sm"
              >
                {t("hero.badges.fast")}
              </motion.div>
            </motion.div>
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
    </section>
  );
}
