"use client";

import { memo, useMemo } from "react";
import ProductCardFloat from "./ProductCardFloat";

const FALLBACK_IMG = "/images/default-product.png";

function normalizeImageSrc(src) {
  if (Array.isArray(src)) src = src[0];
  if (src && typeof src === "object") {
    src = src.url || src.secure_url || src.src || "";
  }
  let s = String(src || "").trim();
  if (!s) return FALLBACK_IMG;
  if (s.startsWith("https:/") && !s.startsWith("https://")) {
    s = s.replace(/^https:\//, "https://");
  }
  if (s.startsWith("http:/") && !s.startsWith("http://")) {
    s = s.replace(/^http:\//, "http://");
  }
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  const withSlash = s.startsWith("/") ? s : `/${s}`;
  return withSlash.replace(/\/{2,}/g, "/");
}

function normalizeProducts(products) {
  if (!Array.isArray(products)) return [];
  return products.map((p) => {
    const title = p?.title ?? p?.name ?? "Untitled product";
    const name = p?.name ?? p?.title ?? "Product";
    const price = Number(p?.price) || 0;
    const image = normalizeImageSrc(p?.image || p?.thumbnail || p?.images);
    return {
      ...p,
      id: p?.id ?? p?._id,
      _id: p?._id ?? p?.id,
      title,
      name,
      price,
      image,
      rating: Number(p?.rating) || 0,
      categorySlug: p?.categorySlug || p?.category || "Electronics",
    };
  });
}

function FeaturedProducts({ products = [], addToCart }) {
  const normalized = useMemo(() => normalizeProducts(products), [products]);

  if (!normalized.length) {
    return (
      <div className="text-center py-24 glass-island relative overflow-hidden group">
        <p className="text-white font-display font-black text-2xl uppercase tracking-widest mb-4 relative z-10">
          THE VOID IS EMPTY
        </p>
        <p className="text-text-secondary font-mono text-xs tracking-widest mb-8 relative z-10">
          // AWAITING INVENTORY MANIFEST
        </p>
      </div>
    );
  }

  return (
    <section aria-label="QuickQart Inventory">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {normalized.map((product, index) => (
          <div 
            key={product?.id || product?._id || `${index}`}
            style={{ marginTop: (index % 4) * 20 + 'px' }}
            className="transition-all duration-700"
          >
            <ProductCardFloat product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(FeaturedProducts);
