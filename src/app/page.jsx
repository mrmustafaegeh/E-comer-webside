import { Suspense } from 'react';
import FeaturedProductsClient from "../Component/features/FeaturedProductsClient";
import { getHeroProductsData, getFeaturedProductsData } from "@/services/productService";
import ZeroGHero from "../Component/home/ZeroGHero";
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: "QuickQart 1/1 // SHOP THE VOID",
    description: "Experience the future of commerce. QuickQart shopping inside the infinite void powered by QuickQart 1/1 Architecture.",
    alternates: {
      canonical: 'https://quickqart.com/',
    },
    openGraph: {
      title: "QuickQart 1/1 // SHOP THE VOID",
      description: "Experience the future of commerce. QuickQart shopping inside the infinite void.",
      url: "https://quickqart.com",
      siteName: "QuickQart",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: 'summary_large_image',
      title: "QuickQart 1/1 // SHOP THE VOID",
      description: "Experience the future of commerce. QuickQart shopping inside the infinite void.",
    },
  };
}

export default async function HomePage() {
  const [heroProducts, featuredProducts] = await Promise.all([
    getHeroProductsData(),
    getFeaturedProductsData()
  ]);

  return (
    <div className="flex flex-col gap-0 items-center w-full">
      {/* HERO SECTION */}
      <ZeroGHero />

      {/* CATEGORY EXPLORER (Quick Orbit) */}
      <section className="w-full max-w-[1440px] px-6 lg:px-12 py-24">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.5em] text-cyan-400 uppercase">// SECTOR ANALYTICS</span>
            <h2 className="text-5xl md:text-8xl font-display font-black leading-tight tracking-tighter uppercase grayscale group-hover:grayscale-0 transition-all duration-700">
              FEATURED <br /> INVENTORY.
            </h2>
          </div>
          <div className="flex gap-4">
            {['Electronics', 'Fashion', 'Home', 'Sports'].map((cat) => (
              <Link 
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="px-6 py-2 glass-island text-[10px] font-mono uppercase tracking-widest hover:border-cyan-400/50 transition-all"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* FEATURED PRODUCTS GRID */}
        <FeaturedProductsClient initialProducts={featuredProducts} />
      </section>

      {/* ADDED WOW FACTOR SECTION */}
      <section className="w-full py-40 bg-gradient-to-b from-transparent to-violet-900/10">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-4xl md:text-6xl font-display font-black mb-8 leading-none">
            DEFIANCE OF <br /> TRADITIONAL COMMERCE.
          </h3>
          <p className="text-text-secondary text-lg mb-12">
            Every interaction is calculated. Every pixel is weighted by the void. 
            Welcome to the 2026 Shopify-Killer Architecture.
          </p>
          <div className="inline-block p-[1px] bg-gradient-to-r from-cyan-400 via-magenta-500 to-violet-500 rounded-full animate-pulse">
            <Link href="/products" className="bg-[#000208] px-12 py-6 rounded-full block text-xs font-mono tracking-widest hover:bg-transparent transition-colors">
              ACQUIRE ASSETS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
