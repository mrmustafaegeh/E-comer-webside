"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Watch, Headphones, Camera, Laptop, Gamepad } from "lucide-react";
import { useState, useEffect } from "react";

const categories = [
  {
    id: "electronics",
    name: "Tech & Gadgets",
    description: "Future-forward essentials",
    icon: Smartphone,
    href: "/products?category=electronics",
    image: "/images/categories/electronics.png",
    gridSpan: "md:col-span-2",
  },
  {
    id: "fashion",
    name: "Life & Style",
    description: "Curated wardrobe",
    icon: Watch,
    href: "/products?category=fashion",
    image: "/images/categories/fashion.png",
    gridSpan: "md:col-span-1",
  },
  {
    id: "computing",
    name: "Pro Computing",
    description: "Built for performance",
    icon: Laptop,
    href: "/products?category=computing",
    image: "/images/categories/computing.png",
    gridSpan: "md:col-span-3",
  },
];

const CategorySection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by only rendering motion content after mount
  if (!mounted) {
    return (
      <section className="py-24 md:py-48 bg-black relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 z-10 relative">
           <div className="h-[600px] w-full bg-black border border-white/10 animate-pulse rounded-none" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-48 bg-black relative overflow-hidden border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 z-10 relative">
        <div className="mb-24">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono font-black tracking-[0.6em] uppercase text-gray-700 mb-6 block flex items-center gap-3 italic"
          >
            <span className="w-1.5 h-1.5 bg-white animate-pulse"></span>
            Data Sectors // CLASSIFIED
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-9xl font-heading font-black text-white tracking-tighter uppercase italic leading-none"
          >
            Explore <br className="md:hidden" /> The Core.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 xl:gap-20">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8 }}
              className={category.gridSpan}
            >
              <Link
                href={category.href}
                className="group relative flex flex-col justify-end p-10 md:p-16 h-[500px] md:h-[700px] rounded-none bg-black overflow-hidden transition-all duration-700 hover:shadow-2xl border border-white/10 hover:border-white"
              >
                                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-1000 grayscale group-hover:grayscale-0 contrast-150 group-hover:contrast-100">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                </div>
                
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/90 to-transparent z-0" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-700 pointer-events-none"></div>

                                <div className="relative z-10 text-white space-y-8">
                  <category.icon size={40} strokeWidth={1} className="text-white opacity-20 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                  <div>
                    <h3 className="text-4xl md:text-6xl font-heading font-black mb-4 tracking-tighter text-white uppercase italic transition-transform duration-700 group-hover:translate-x-3">
                        {category.name}
                    </h3>
                    <p className="text-[10px] font-mono font-black tracking-[0.4em] uppercase text-gray-800 mb-10 max-w-xs group-hover:text-gray-500 transition-colors italic">
                        // {category.description}
                    </p>
                  </div>
                  
                  <div className="inline-flex items-center text-[10px] font-mono font-black uppercase tracking-[0.5em] bg-white text-black border border-white px-10 py-5 rounded-none group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-2xl active:scale-90">
                    Initialize Node <ArrowRight className="ml-5 w-5 h-5 transition-transform duration-500 group-hover:translate-x-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
