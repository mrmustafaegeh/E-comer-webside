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
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
