// i18n.js - Place this in your project root or lib folder
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation resources
const resources = {
  en: {
    translation: {
      "featured.title": "Featured Products",
      "common.viewAll": "View All",
      "common.addToCart": "Add to Cart",
      "All Products": "All Products",
      // Add all your translations here
    },
  },
  tr: {
    translation: {
      "featured.title": "Öne Çıkan Ürünler",
      "common.viewAll": "Tümünü Gör",
      "common.addToCart": "Sepete Ekle",
      "All Products": "Tüm Ürünler",
      // Turkish translations
    },
  },
};

// Initialize i18next
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",

    // This is important for SSR
    react: {
      useSuspense: false, // Disable suspense for SSR compatibility
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Debug mode (disable in production)
    debug: process.env.NODE_ENV === "development",
  });

export default i18n;
