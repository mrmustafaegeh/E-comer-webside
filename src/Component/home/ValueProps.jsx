"use client";

import { useTranslation } from "react-i18next";
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import { Container } from "@/Component/ui/primitives";

const ICONS = [Truck, ShieldCheck, RotateCcw, Headphones];

export default function ValueProps() {
  const { t } = useTranslation();

  const items = [
    {
      title: t("home.valueProps.shipping.title", "Free shipping"),
      desc: t("home.valueProps.shipping.desc", "On orders over $50"),
    },
    {
      title: t("home.valueProps.secure.title", "Secure checkout"),
      desc: t("home.valueProps.secure.desc", "Encrypted payments"),
    },
    {
      title: t("home.valueProps.returns.title", "Easy returns"),
      desc: t("home.valueProps.returns.desc", "30-day return policy"),
    },
    {
      title: t("home.valueProps.support.title", "Support"),
      desc: t("home.valueProps.support.desc", "Help when you need it"),
    },
  ];

  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
      <Container className="py-10 md:py-12">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <div key={item.title} className="flex flex-col gap-2">
                <Icon className="h-5 w-5 text-[var(--text)]" strokeWidth={1.5} />
                <p className="text-sm font-medium text-[var(--text)]">{item.title}</p>
                <p className="text-xs leading-relaxed text-[var(--text-muted)]">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
