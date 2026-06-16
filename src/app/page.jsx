import FeaturedProductsClient from "../Component/features/FeaturedProductsClient";
import {
  getHeroProductsData,
  getFeaturedProductsData,
  getCategoriesData,
} from "@/services/productService";
import HomeHero from "../Component/home/HomeHero";
import ValueProps from "../Component/home/ValueProps";
import CategorySection from "../Component/home/CategorySection";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section, Button, SectionHeader } from "@/Component/ui/primitives";

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: "QuickQart — Shop electronics, fashion & home",
    description:
      "Curated products with clear pricing, secure checkout, and fast delivery.",
    alternates: { canonical: "https://quickqart.com/" },
    openGraph: {
      title: "QuickQart — Shop electronics, fashion & home",
      description: "Curated products with clear pricing and secure checkout.",
      url: "https://quickqart.com",
      siteName: "QuickQart",
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function HomePage() {
  const [heroProducts, featuredProducts, categories] = await Promise.all([
    getHeroProductsData(),
    getFeaturedProductsData(),
    getCategoriesData(),
  ]);

  const heroList = Array.isArray(heroProducts)
    ? heroProducts
    : heroProducts?.products || [];

  return (
    <div className="w-full bg-[var(--bg)]">
      <HomeHero products={heroList} />
      <ValueProps />

      <Section className="border-t border-[var(--border)]">
        <Container>
          <SectionHeader
            label="Featured"
            title="Popular right now"
            description="Hand-picked products with clear pricing and fast checkout."
            actions={
              <Button as={Link} href="/products" variant="secondary" className="gap-2">
                View all
                <ArrowRight size={16} />
              </Button>
            }
          />
          <FeaturedProductsClient initialProducts={featuredProducts} />
        </Container>
      </Section>

      <CategorySection categories={categories} />
    </div>
  );
}
