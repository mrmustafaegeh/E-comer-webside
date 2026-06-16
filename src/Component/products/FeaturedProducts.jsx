"use client";

import { memo, useMemo } from "react";
import ProductCard from "./ProductCard";
import { EmptyState } from "@/Component/ui/primitives";

const MAX_FEATURED = 10;

function normalizeProducts(products) {
  if (!Array.isArray(products)) return [];
  return products.slice(0, MAX_FEATURED).map((p) => ({
    ...p,
    id: p?.id ?? p?._id,
    _id: p?._id ?? p?.id,
    title: p?.title ?? p?.name ?? "Untitled product",
    name: p?.name ?? p?.title ?? "Product",
    price: Number(p?.price) || 0,
    category: p?.categorySlug || p?.category || "",
  }));
}

function FeaturedProducts({ products = [] }) {
  const normalized = useMemo(() => normalizeProducts(products), [products]);

  if (!normalized.length) {
    return (
      <EmptyState
        title="No products yet"
        description="Check back soon or browse all categories."
      />
    );
  }

  return (
    <section aria-label="Featured products">
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        {normalized.map((product, index) => (
          <ProductCard
            key={product?.id || product?._id || `${index}`}
            product={product}
            showActions={false}
          />
        ))}
      </div>
    </section>
  );
}

export default memo(FeaturedProducts);
