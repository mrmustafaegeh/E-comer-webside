"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../../hooks/useCart";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  motion,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { useAuth } from "../../contexts/AuthContext";

const LanguageSwitcher = dynamic(() => import("../features/LanguageSwitcher"), { 
  ssr: false,
  loading: () => <div className="w-16 h-8 bg-black border border-white/5 animate-pulse rounded-none" />
});

const UserProfile = dynamic(() => import("./UserProfile"), { 
  ssr: false,
  loading: () => <div className="w-10 h-10 bg-black border border-white/5 animate-pulse rounded-none" />
});

// Motion shorthands
const MotionNav = m.nav;
const MotionDiv = m.div;
const MotionButton = m.button;
const MotionSpan = m.span;

// === HEADER COMPONENT ===
export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { cartItems } = useCart();
  const { user, loading } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  /** Safe Translation */
  const safeT = (key, fallback) => {
    try {
      const translated = t(key);
      return translated === key ? fallback : translated;
    } catch {
      return fallback;
    }
  };

  /** Scroll Listener */
  const handleScroll = useCallback(
    () => setIsScrolled(window.scrollY > 20),
    []
  );
  useEffect(() => {
    if (!mounted) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted, handleScroll]);

  /** Cart Count */
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.qty || 1), 0),
    [cartItems]
  );

  /** Navigation */
  const navItems = [
    { href: "/", label: safeT("common.home", "SYSTEM ROOT") },
    { href: "/products", label: safeT("common.products", "INVENTORY MATRIX") },
    { href: "/about", label: safeT("common.about", "ABOUT") },
    { href: "/contact", label: safeT("common.contact", "COMMUNICATION PROTOCOL") },
  ];

  /** Mobile toggle overflow */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isMobileMenuOpen]);

  return (
    <LazyMotion features={domAnimation}>
      <MotionNav
        initial={mounted ? { y: 0, opacity: 1 } : { y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`sticky top-0 z-50 transition-colors duration-700 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-3xl border-b border-white/20 shadow-2xl"
            : "bg-black/40 backdrop-blur-sm border-b border-white/5"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* LOGO */}
            <MotionDiv whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }}>
              <Link href="/" className="flex items-center gap-4 group">
                <span className="text-xl md:text-2xl font-mono font-black text-white tracking-tighter uppercase italic group-hover:translate-x-2 transition-transform duration-700">
                  // {safeT("common.siteTitle", "QUICKCART")}
                </span>
              </Link>
            </MotionDiv>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex flex-1 justify-between items-center ml-16">
              <ul className="flex space-x-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`relative px-6 py-2.5 text-[10px] font-mono font-black uppercase tracking-[0.4em] transition-colors rounded-none italic flex items-center group overflow-hidden ${
                        pathname === item.href ? "text-white" : "text-gray-500 hover:text-white"
                      }`}
                    >
                      <span className="relative z-10">{item.label}</span>
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white transform origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100"></span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex items-center space-x-8">
                <LanguageSwitcher />
                
                {loading ? (
                  <div className="w-24 h-12 bg-white/5 rounded-none animate-pulse"></div>
                ) : user ? (
                  <UserProfile user={user} />
                ) : (
                  <Link
                    href="/auth/login"
                    className="px-8 py-3 bg-white text-black text-[10px] font-mono font-black uppercase tracking-[0.4em] rounded-none hover:bg-black hover:text-white border border-white transition-colors duration-500 italic active:scale-95 shadow-2xl transform-gpu"
                  >
                    AUTHENTICATE
                  </Link>
                )}

                {/* CART */}
                <Link
                  href="/cart"
                  className="relative p-3 rounded-none bg-black border border-white/10 hover:bg-white hover:text-black hover:border-white transition-colors duration-500 text-white group shadow-2xl"
                  aria-label="Cart"
                >
                  <svg
                    className="w-5 h-5 transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  {cartCount > 0 && (
                    <MotionSpan
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-white text-black rounded-none text-[9px] font-mono h-6 w-6 flex items-center justify-center font-black shadow-2xl border border-white italic"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </MotionSpan>
                  )}
                </Link>
              </div>
            </div>

            {/* MOBILE NAV TOGGLE */}
            <div className="md:hidden flex items-center space-x-4">
              <Link
                href="/cart"
                className="relative p-2.5 rounded-none bg-black border border-white/10 text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black rounded-none text-[9px] font-mono h-5 w-5 flex items-center justify-center font-black border border-white italic">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              <MotionButton
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-none bg-black border border-white/10 text-white transition-all hover:border-white"
                onClick={() => setIsMobileMenuOpen((p) => !p)}
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </MotionButton>
            </div>
          </div>

          {/* MOBILE MENU CONTENT */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <MotionDiv
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-0 z-40 bg-black pt-24 px-6 md:hidden overflow-y-auto"
              >
                 {/* Decorative Background for Mobile Menu */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

                <div className="relative z-10 space-y-8 flex flex-col items-center justify-center min-h-[70vh]">
                  {navItems.map((item, idx) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-4xl font-heading font-black tracking-tighter uppercase italic transition-all duration-500 ${
                        pathname === item.href ? "text-white scale-110" : "text-gray-800 hover:text-white"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 + 0.2 }}
                        className="block"
                      >
                         {item.label}
                      </motion.span>
                    </Link>
                  ))}

                  <div className="pt-12 mt-8 border-t border-white/10 w-full flex flex-col items-center gap-10">
                    <LanguageSwitcher />
                    {user ? (
                      <UserProfile user={user} />
                    ) : (
                      <Link
                        href="/auth/login"
                        className="w-full text-center py-6 bg-white text-black font-mono font-black uppercase tracking-[0.5em] italic active:scale-95 text-[11px]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        // AUTHENTICATE
                      </Link>
                    )}
                  </div>
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </MotionNav>
    </LazyMotion>
  );
}
