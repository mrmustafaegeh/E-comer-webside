"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, ChevronDown, Terminal } from "lucide-react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "ENGLISH" },
  { code: "ar", name: "العربية" },
  { code: "sm", name: "SOOMAALI" },
  { code: "tr", name: "TÜRKÇE" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (newLocale) => {
    // Basic i18n switching logic
    i18n.changeLanguage(newLocale);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-3 text-[10px] font-mono font-black text-white bg-black border border-white/10 rounded-none hover:border-white transition-all duration-500 focus:outline-none uppercase tracking-[0.4em] italic group shadow-2xl"
      >
        <Terminal size={14} strokeWidth={2.5} className="text-gray-700 group-hover:text-white transition-colors" />
        <span>{currentLanguage.code}</span>
        <ChevronDown size={14} className={`transition-all duration-500 text-gray-800 group-hover:text-white ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 w-52 mt-4 origin-top-right bg-black border border-white/20 rounded-none shadow-[0_20px_60px_rgba(0,0,0,1)] outline-none z-50 overflow-hidden divide-y divide-white/5">
           {/* Decorative Background */}
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>

          <div className="py-0 relative z-10">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center justify-between w-full px-8 py-5 text-[10px] font-mono font-black text-left uppercase tracking-[0.4em] italic transition-all duration-500 border-l-2 ${
                  i18n.language === lang.code
                    ? "bg-white text-black border-white"
                    : "text-gray-700 hover:bg-white/5 hover:text-white border-transparent"
                }`}
              >
                <span>{lang.name}</span>
                <span className="text-[8px] opacity-40">[{lang.code}]</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
