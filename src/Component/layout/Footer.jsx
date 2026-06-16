"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Container, Input, Button } from "@/Component/ui/primitives";

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const year = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="section-dark border-t border-[var(--border-on-dark)]">
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" className="font-heading text-xl font-semibold text-[var(--text-on-dark)]">
              QuickQart
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--text-muted-on-dark)]">
              {t(
                "footer.brandDescription",
                "Curated electronics, fashion, and home essentials with clear pricing and secure checkout."
              )}
            </p>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.12em] text-[var(--text-muted-on-dark)]">
              Explore
            </h3>
            <ul className="space-y-3 text-sm text-[var(--text-muted-on-dark)]">
              <li>
                <Link href="/products" className="transition-colors hover:text-[var(--text-on-dark)]">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-[var(--text-on-dark)]">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-[var(--text-on-dark)]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.12em] text-[var(--text-muted-on-dark)]">
              Newsletter
            </h3>
            <p className="mb-4 text-sm text-[var(--text-muted-on-dark)]">
              {t("footer.newsletterHint", "Updates on new arrivals and offers.")}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                aria-label="Email for newsletter"
                className="border-[var(--border-on-dark)] bg-[var(--bg-dark-elevated)] text-[var(--text-on-dark)] placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-700/30"
              />
              <Button
                type="submit"
                className="shrink-0 bg-white px-4 text-neutral-900 hover:bg-neutral-100"
              >
                Join
              </Button>
            </form>
            {subscribed && (
              <p className="mt-2 text-xs text-green-400">Thanks for subscribing.</p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--border-on-dark)] pt-8 text-sm text-[var(--text-muted-on-dark)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} QuickQart</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-[var(--text-on-dark)]">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[var(--text-on-dark)]">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
