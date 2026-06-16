"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container, Section, Button, SectionHeader } from "../../Component/ui/primitives";

function StrengthRow({ item, index, imageOnRight }) {
  return (
    <div
      className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
        index > 0 ? "mt-16 border-t border-[var(--border)] pt-16 md:mt-20 md:pt-20" : ""
      }`}
    >
      <div className={`${imageOnRight ? "lg:pr-8" : "lg:order-2 lg:pl-8"}`}>
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-[var(--text)] md:text-3xl">
          {item.title}
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--text-muted)]">
          {item.desc}
        </p>
      </div>

      <div className={imageOnRight ? "" : "lg:order-1"}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--bg-subtle)]">
          <Image
            src={item.img}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      </div>
    </div>
  );
}

const AboutUs = () => {
  const { t } = useTranslation();

  const featureItems = [
    {
      img: "/image/Fast-dilevery.jpg",
      title: t("about.fastDelivery"),
      desc: t("about.fastDeliveryDesc"),
    },
    {
      img: "/image/girl_with_earphone_image.png",
      title: t("about.topQuality"),
      desc: t("about.topQualityDesc"),
    },
    {
      img: "/image/boy_with_laptop_image.png",
      title: t("about.support24"),
      desc: t("about.support24Desc"),
    },
  ];

  return (
    <Section>
      <Container>
        <SectionHeader
          label={t("about.eyebrow", "About us")}
          title={t("about.title")}
          description={t("about.tagline")}
          className="max-w-2xl"
        />

        <div className="mt-4 md:mt-8">
          {featureItems.map((item, index) => (
            <StrengthRow
              key={item.title}
              item={item}
              index={index}
              imageOnRight={index % 2 === 0}
            />
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-10 md:mt-20 md:px-10 md:py-12">
          <h3 className="font-heading text-xl font-semibold text-[var(--text)] md:text-2xl">
            {t("about.missionTitle")}
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-muted)]">
            {t("about.missionText")}
          </p>
          <Link href="/contact" className="mt-8 inline-block">
            <Button>
              {t("about.getInTouch")}
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default AboutUs;
