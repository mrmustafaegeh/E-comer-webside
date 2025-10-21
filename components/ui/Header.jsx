"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cartContext";
import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../features/LanguageSwitcher";

// Lazy load heavy animations
const MotionNav = m.nav;
const MotionDiv = m.div;
const MotionSpan = m.span;
const MotionButton = m.button;

const Header = () => {
  const { t } = useTranslation();
  const { cartItems } = useCart();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fixed safe translation function
  const safeTranslate = (key, fallback) => {
    try {
      const translation = t(key);
      return translation === key ? fallback : translation;
    } catch (error) {
      return fallback;
    }
  };

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let ticking = false;
    const updateScroll = () => {
      handleScroll();
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll, mounted]);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + (item.qty || 1), 0),
    [cartItems]
  );

  const navItems = useMemo(
    () => [
      { href: "/", label: safeTranslate("common.home", "Home") },
      {
        href: "/products",
        label: safeTranslate("common.products", "Products"),
      },
      { href: "/about", label: safeTranslate("common.about", "About Us") },
      { href: "/contact", label: safeTranslate("common.contact", "Contact") },
    ],
    [t]
  );

  const isActive = useCallback(
    (path) =>
      pathname === path
        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-300",
    [pathname]
  );

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mounted) return;

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, mounted]);

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm h-16 md:h-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center">
              <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-200 rounded-xl animate-pulse" />
              <span className="ml-3 text-xl md:text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text">
                {safeTranslate("common.siteTitle", "QuickCart")}
              </span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <MotionNav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-blue-100/50"
            : "bg-white/80 backdrop-blur-sm shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <MotionDiv whileHover={{ scale: 1.05 }} className="flex-shrink-0">
              <Link href="/" className="flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">QC</span>
                </div>
                <span className="ml-3 text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {safeTranslate("common.siteTitle", "QuickCart")}
                </span>
              </Link>
            </MotionDiv>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 justify-between items-center">
              <ul className="flex space-x-1 ml-10">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 ${isActive(
                        item.href
                      )}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Desktop Cart, Language Switcher & Sign In */}
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />

                <Link
                  href="/form"
                  className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold text-sm"
                >
                  {safeTranslate("common.signIn", "Sign In")}
                </Link>

                <Link
                  href="/cart"
                  className="relative p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-300 group"
                  aria-label={safeTranslate("cart.title", "Shopping Cart")}
                >
                  <svg
                    className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cartCount > 0 && (
                    <MotionSpan
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </MotionSpan>
                  )}
                </Link>
              </div>
            </div>

            {/* Mobile Header Right Section */}
            <div className="flex items-center space-x-3 md:hidden">
              {/* Mobile Language Switcher */}
              <LanguageSwitcher />

              {/* Mobile Cart Icon */}
              <Link
                href="/cart"
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={safeTranslate("cart.title", "Shopping Cart")}
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <MotionButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={toggleMobileMenu}
                aria-label={safeTranslate("common.toggleMenu", "Toggle menu")}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </MotionButton>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 mt-2 overflow-hidden"
              >
                <ul className="space-y-1 p-2">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${isActive(
                          item.href
                        )}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}

                  {/* Mobile Sign In Button */}
                  <li className="border-t border-gray-200 pt-2 mt-2">
                    <Link
                      href="/form"
                      className="block px-4 py-3 text-center border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {safeTranslate("common.signIn", "Sign In")}
                    </Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MotionNav>
    </LazyMotion>
  );
};

export default Header;
