import { Suspense } from 'react';
import HeroSlider from "../Component/slider/HeroSlider";
import FeaturedProductsClient from "../Component/features/FeaturedProductsClient";
import { getHeroProductsData, getFeaturedProductsData } from "@/services/productService";

import CategorySection from "../Component/home/CategorySection";
import ValueProps from "../Component/home/ValueProps";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Premium Tech & Lifestyle | QuickCart",
  description: "Discover premium tech products and lifestyle essentials with unbeatable deals.",
  openGraph: {
    title: "Premium Tech & Lifestyle | QuickCart", 
    description: "Discover premium tech products and lifestyle essentials with unbeatable deals.",
    type: "website",
  }
};

export default async function HomePage() {
  const [heroProducts, featuredProducts] = await Promise.all([
    getHeroProductsData(),
    getFeaturedProductsData()
  ]);

  return (
    <main className="bg-black min-h-screen text-white selection:bg-white selection:text-black font-mono relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay z-0"></div>
      
            <section className="relative z-10 border-b border-white/10">
        <HeroSlider initialProducts={heroProducts} />
      </section>

            <div className="relative z-10 border-b border-white/10">
         <ValueProps />
      </div>

            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 md:py-40 relative z-10" id="features">
        <div className="mb-20">
          <span className="text-[10px] font-mono font-black tracking-[0.5em] uppercase text-gray-500 mb-6 block flex items-center gap-3 italic">
            <span className="w-1.5 h-1.5 bg-white animate-pulse"></span>
            Global Collection ID
          </span>
          <h2 className="text-5xl md:text-8xl font-heading font-black text-white tracking-tighter leading-none uppercase italic">
            Asset Inventory. <br className="hidden md:block" /> Framework // BW.
          </h2>
        </div>
        <FeaturedProductsClient initialProducts={featuredProducts} />
      </section>

            <div className="relative z-10 border-t border-white/10">
         <CategorySection />
      </div>
    </main>
  );
}
