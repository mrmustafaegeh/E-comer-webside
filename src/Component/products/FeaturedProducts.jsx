"use client";

import { memo, useMemo } from "react";
import ProductCard from "../products/ProductCard";

const FALLBACK_IMG = "/images/default-product.png";

function normalizeImageSrc(src) {
  // ✅ support arrays (images: ["..."])
  if (Array.isArray(src)) src = src[0];

  // ✅ support objects (cloudinary-like)
  if (src && typeof src === "object") {
    src = src.url || src.secure_url || src.src || "";
  }

  let s = String(src || "").trim();
  if (!s) return FALLBACK_IMG;

  // ✅ fix broken protocol from your API: "https:/..." -> "https://..."
  if (s.startsWith("https:/") && !s.startsWith("https://")) {
    s = s.replace(/^https:\//, "https://");
  }
  if (s.startsWith("http:/") && !s.startsWith("http://")) {
    s = s.replace(/^http:\//, "http://");
  }

  // ✅ keep absolute URLs untouched
  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  // ✅ normalize relative paths
  const withSlash = s.startsWith("/") ? s : `/${s}`;
  return withSlash.replace(/\/{2,}/g, "/");
}

function normalizeProducts(products) {
  if (!Array.isArray(products)) return [];

  return products.map((p) => {
    const title = p?.title ?? p?.name ?? "Untitled product";
    const name = p?.name ?? p?.title ?? "Product";

    const price = Number(p?.price) || 0;

    const offerPrice =
      p?.offerPrice != null && p?.offerPrice !== ""
        ? Number(p.offerPrice)
        : p?.salePrice != null && p?.salePrice !== ""
        ? Number(p.salePrice)
        : null;

    const image = normalizeImageSrc(p?.image || p?.thumbnail || p?.images);

    return {
      ...p,
      id: p?.id ?? p?._id,
      _id: p?._id ?? p?.id,
      title,
      name,
      price,
      offerPrice: Number.isFinite(offerPrice) ? offerPrice : null,
      image,
      rating: Number(p?.rating) || 0,
      numReviews: Number(p?.numReviews) || 0,
      stock: p?.stock != null ? Number(p.stock) : undefined,
      category: p?.category || "Uncategorized",
    };
  });
}

function FeaturedProducts({ products = [], addToCart }) {
  const normalized = useMemo(() => normalizeProducts(products), [products]);

  if (!normalized.length) {
    return (
        <div className="text-center py-24 bg-black border border-white/10 rounded-none mix-blend-screen shadow-2xl relative overflow-hidden group">
        
        {/* Animated background lines */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_99%,rgba(255,255,255,0.05)_100%)] bg-[size:20px_100%]"></div>
        
        {/* Glitchy Icon */}
        <div className="relative inline-block isolate z-10 mb-8 px-6 py-4 bg-black border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-105 group-hover:border-white transition-[transform,border-color] duration-500 transform-gpu will-change-transform">
          <svg
             className="w-12 h-12 text-white/50 group-hover:text-white transition-colors duration-500 relative z-10 isolate mix-blend-screen"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor"
          >
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M4 12h16M7 16h10" />
          </svg>
        </div>

        <p className="text-white font-mono font-black text-xl uppercase tracking-[0.4em] italic mb-4 relative z-10 isolate drop-shadow-lg">
          [ INVENTORY DEPLETED ]
        </p>
        <p className="text-gray-500 font-mono text-xs tracking-[0.2em] mb-8 relative z-10 isolate italic">
          // No units available for acquisition
        </p>

        <code className="inline-block bg-white text-black px-6 py-3 rounded-none text-xs font-mono font-black tracking-widest relative z-10 isolate italic">
          &gt; await initialize_catalog()
        </code>
      </div>
    );
  }

  return (
    <section aria-label="Inventory Matrix">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-white/10">
        {normalized.map((product, index) => (
          <ProductCard
            key={product?.id || product?._id || `${index}`}
            product={product}
            index={index}
            addToCart={addToCart}
          />
        ))}
      </div>
    </section>
  );
}

export default memo(FeaturedProducts);
