"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "../products/ProductCard";
import { Container, PageHeader } from "../ui/primitives";

export default function RelatedProducts({ category, currentId }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadRelated() {
      if (!category) {
        setRelated([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams({
          category,
          limit: "4",
          page: "1",
        });
        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();
        if (!mounted) return;
        const filtered = (data.products || []).filter(
          (p) => (p.id || p._id) !== currentId
        );
        setRelated(filtered.slice(0, 4));
      } catch (err) {
        console.error("RelatedProducts error", err);
        setRelated([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadRelated();
    return () => {
      mounted = false;
    };
  }, [category, currentId]);

  if (loading) {
    return (
      <Container className="mt-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg bg-[var(--bg-subtle)]" />
          ))}
        </div>
      </Container>
    );
  }

  if (!related.length) return null;

  return (
    <Container className="mt-16 border-t border-[var(--border)] pt-12">
      <PageHeader
        title="Related products"
        className="mb-6 [&_h1]:text-2xl"
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {related.map((p) => (
          <ProductCard key={p.id || p._id} product={p} showActions={false} />
        ))}
      </div>
    </Container>
  );
}
