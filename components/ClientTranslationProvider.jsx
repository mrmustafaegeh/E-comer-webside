// components/ClientTranslationProvider.jsx
"use client";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../app/i18n";

export default function ClientTranslationProvider({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a skeleton or loading state during SSR
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
