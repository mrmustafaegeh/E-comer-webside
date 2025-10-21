"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import tr from "./locales/tr/translation.json";
import ar from "./locales/ar/translation.json";
import sm from "./locales/sm/translation.json";

// Initialize only on the client side to avoid SSR issues
if (typeof window !== "undefined" && !i18n.isInitialized) {
  i18n
    .use(LanguageDetector) // Automatically detect user language
    .use(initReactI18next) // Bind i18n to React
    .init({
      resources: {
        en: { translation: en },
        tr: { translation: tr },
        ar: { translation: ar },
        sm: { translation: sm },
      },
      supportedLngs: ["en", "tr", "ar", "sm"],
      fallbackLng: "en",
      detection: {
        order: [
          "localStorage",
          "navigator",
          "htmlTag",
          "cookie",
          "path",
          "subdomain",
        ],
        caches: ["localStorage"], // Store detected language for later
      },
      interpolation: {
        escapeValue: false, // React already escapes output
      },
      debug: process.env.NODE_ENV === "development",
      load: "languageOnly",
    });
}

export default i18n;
