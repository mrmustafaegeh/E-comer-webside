// This file is a Server Component by default, ensuring optimal performance
// by reducing client-side JavaScript bundle size.

import Link from "next/link";
// Use next/image for automatic optimization, format conversion (WebP/AVIF), and lazy loading (disabled for the main hero visual).
import Image from "next/image";
// Use next/font to automatically self-host and preload fonts.
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function HeroSection() {
  return (
    <section
      className={`relative w-full min-h-[80vh] bg-gray-900 flex items-center overflow-hidden ${inter.className}`}
    >
      {/* Background with Gradient and Pattern (Pure CSS, no JS overhead) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content */}
      <div className="w-full relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 lg:py-20">
            {/* Text Content (Server Rendered) */}
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Amazing{" "}
                <span className="text-blue-400 block sm:inline-block">
                  E-commerce Offers
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                Discover unbeatable deals on electronics, fashion, home goods
                and more. Shop now and save big!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Use next/link for client-side routing optimization */}
                <Link
                  href="/products"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-center shadow-lg hover:shadow-xl"
                >
                  Shop Now
                </Link>
                <Link
                  href="/products"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 rounded-lg transition-all duration-300 text-center hover:border-transparent"
                >
                  Explore
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-700 max-w-md">
                {/* ... stat items (can remain static for performance) ... */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-gray-400 text-sm">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-gray-400 text-sm">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-gray-400 text-sm">Happy Customers</div>
                </div>
              </div>
            </div>

            {/* Visual Content with Next.js Image Optimization */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
                  {/* Using next/image for LCP (Largest Contentful Paint) image */}
                  <Image
                    src="/images/hero-showcase.png" // Replace with your image path
                    alt="Hot Deals Showcase"
                    width={500}
                    height={300}
                    priority // Prioritizes loading this LCP image
                    className="aspect-video rounded-lg object-cover"
                  />
                </div>
              </div>

              {/* Floating Elements as simple CSS or simple client components */}
              <div className="absolute -top-3 -right-3 bg-blue-500 text-white px-3 py-1 rounded-lg shadow-lg text-sm">
                🔥 New
              </div>
              <div className="absolute -bottom-3 -left-3 bg-green-500 text-white px-3 py-1 rounded-lg shadow-lg text-sm">
                ⚡ Fast
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
