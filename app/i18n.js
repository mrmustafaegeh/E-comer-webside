"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import tr from "./locales/tr/translation.json";
import ar from "./locales/ar/translation.json";
import sm from "./locales/sm/translation.json";

// Simple initialization without complex client/server logic
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        tr: { translation: tr },
        ar: { translation: ar },
        sm: { translation: sm },
      },
      supportedLngs: ["en", "tr", "ar", "sm"],
      fallbackLng: "en",
      lng: "en", // Force English as default for consistent SSR
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;
