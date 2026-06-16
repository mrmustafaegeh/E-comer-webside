"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Container, Section, SectionHeader } from "@/Component/ui/primitives";

const PLACEHOLDER = "/images/product-placeholder.svg";

export default function CategorySection({ categories = [] }) {
  const { t } = useTranslation();
  const display = categories.slice(0, 3);

  if (display.length === 0) return null;

  return (
    <Section className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
      <Container>
        <SectionHeader
          label={t("home.categories.eyebrow", "Categories")}
          title={t("home.categories.title", "Shop by category")}
          description={t(
            "home.categories.subtitle",
            "Find what you need across our main collections."
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {display.map((cat) => (
            <Link
              key={cat.id ?? cat.name}
              href={`/category/${encodeURIComponent(cat.name)}`}
              className="group relative overflow-hidden rounded-2xl bg-[var(--bg-subtle)]"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={cat.image || PLACEHOLDER}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-heading text-xl font-semibold text-white">{cat.name}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm text-white/80 transition-colors group-hover:text-white">
                    {t("home.categories.browse", "Browse")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
