"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Button, Container } from "@/Component/ui/primitives";
import { getProductImageUrl } from "@/lib/productImage";

export default function HomeHero({ products = [] }) {
  const { t } = useTranslation();
  const heroProduct = products[0];

  return (
    <section className="border-b border-[var(--border)]">
      <Container className="py-16 md:py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {t("home.hero.eyebrow", "New collection")}
            </p>
            <h1 className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--text)] md:text-5xl lg:text-6xl">
              {t("home.hero.title", "Quality products, simply delivered.")}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
              {t(
                "home.hero.subtitle",
                "Browse curated essentials with clear pricing and fast checkout."
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} href="/products" variant="primary">
                {t("home.hero.cta", "Shop now")}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button as={Link} href="/about" variant="secondary">
                {t("home.hero.secondary", "Our story")}
              </Button>
            </div>
          </div>

          {heroProduct && (
            <Link
              href={`/products/${heroProduct.id}`}
              className="group relative mx-auto block w-full max-w-md overflow-hidden rounded-2xl bg-[var(--bg-subtle)] lg:max-w-none"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={getProductImageUrl(heroProduct)}
                  alt={heroProduct.name || heroProduct.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-6">
                <p className="text-sm font-medium text-white/90">
                  {heroProduct.name || heroProduct.title}
                </p>
                <p className="mt-0.5 text-xs text-white/70">
                  {t("home.hero.viewProduct", "View product")}
                </p>
              </div>
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}
