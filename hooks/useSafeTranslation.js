// hooks/useSafeTranslation.js
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export const useSafeTranslation = () => {
  const { t, i18n, ready } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const safeTranslate = (key, fallback) => {
    // During SSR or if i18n isn't ready, return fallback
    if (!isClient || !ready) {
      return fallback;
    }

    try {
      const translation = t(key);
      return translation === key ? fallback : translation;
    } catch (error) {
      return fallback;
    }
  };

  return { safeTranslate, t, i18n, ready };
};
