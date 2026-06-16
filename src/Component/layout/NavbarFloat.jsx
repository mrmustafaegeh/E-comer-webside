"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, User, Menu, X, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Container } from "@/Component/ui/primitives";
import { useCart } from "@/hooks/useCart";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function NavbarFloat() {
  const { t } = useTranslation();
  const { cartItemsCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[var(--border)] transition-colors ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-[var(--bg)]"
      }`}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-sm text-white">
            Q
          </span>
          QuickQart
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Main">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              {t(`nav.${label.toLowerCase()}`, label)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/products"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text)]"
            aria-label="Search products"
          >
            <Search size={18} />
          </Link>
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text)]"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {cartItemsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-semibold text-white">
                {cartItemsCount}
              </span>
            )}
          </Link>
          <Link
            href="/profile"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text)]"
            aria-label="Account"
          >
            <User size={18} />
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] md:hidden"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-expanded={mobileMenuOpen}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      {mobileMenuOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--bg)] md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[var(--bg-subtle)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/profile"
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[var(--bg-subtle)]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Account
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
