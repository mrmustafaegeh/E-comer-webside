"use client";

import { useEffect, useMemo, useState, use } from "react";
import ProductCard from "../../../Component/products/ProductCard";
import { get } from "../../../services/api";
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Container,
  PageHeader,
  Button,
  Input,
  Label,
  Card,
  EmptyState,
} from "../../../Component/ui/primitives";

export default function CategoryClient({ params }) {
  const resolvedParams = use(params);
  const categoryName = decodeURIComponent(resolvedParams.name);
  const displayName = categoryName.replaceAll("-", " ");

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [localFilters, setLocalFilters] = useState({
    search: "",
    category: categoryName,
    minPrice: "",
    maxPrice: "",
  });

  const [appliedFilters, setAppliedFilters] = useState(localFilters);

  const queryParams = useMemo(() => {
    const p = { page: String(meta.page), limit: String(meta.limit) };
    if (appliedFilters.category) p.category = appliedFilters.category;
    if (appliedFilters.search) p.search = appliedFilters.search;
    if (appliedFilters.minPrice) p.minPrice = appliedFilters.minPrice;
    if (appliedFilters.maxPrice) p.maxPrice = appliedFilters.maxPrice;
    return p;
  }, [appliedFilters, meta.page, meta.limit]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await get("products", queryParams);
        if (!cancelled) {
          setProducts(data.products || []);
          setMeta((m) => ({ ...m, total: data.total || 0, totalPages: data.totalPages || 1 }));
        }
      } catch (e) {
        console.error("Fetch failed:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [queryParams]);

  useEffect(() => {
    setLocalFilters((f) => ({ ...f, category: categoryName }));
    setAppliedFilters((f) => ({ ...f, category: categoryName }));
    setMeta((m) => ({ ...m, page: 1 }));
  }, [categoryName]);

  const clearFilters = () => {
    const cleared = { search: "", category: categoryName, minPrice: "", maxPrice: "" };
    setLocalFilters(cleared);
    setAppliedFilters(cleared);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-16 pt-24">
      <Container>
        <PageHeader
          eyebrow="Category"
          title={displayName}
          description={
            loading
              ? "Loading products…"
              : `${meta.total} product${meta.total === 1 ? "" : "s"} in this category`
          }
          actions={
            <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={16} />
              {showFilters ? "Hide filters" : "Filters"}
            </Button>
          }
        />

        {showFilters && (
          <Card className="mb-8 grid gap-4 p-6 md:grid-cols-3">
            <div>
              <Label htmlFor="cat-search">Search</Label>
              <Input
                id="cat-search"
                type="text"
                value={localFilters.search}
                onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                placeholder="Search products"
              />
            </div>
            <div>
              <Label htmlFor="cat-min">Min price</Label>
              <Input
                id="cat-min"
                type="number"
                value={localFilters.minPrice}
                onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button className="flex-1" onClick={() => setAppliedFilters(localFilters)}>
                Apply
              </Button>
              <Button variant="secondary" onClick={clearFilters} aria-label="Clear filters">
                <X size={18} />
              </Button>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try adjusting your filters or browse all products."
            action={
              <Button variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <Button
              variant="secondary"
              disabled={meta.page <= 1}
              onClick={() => setMeta((m) => ({ ...m, page: m.page - 1 }))}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </Button>
            <span className="text-sm text-[var(--text-muted)]">
              Page {meta.page} of {meta.totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={meta.page >= meta.totalPages}
              onClick={() => setMeta((m) => ({ ...m, page: m.page + 1 }))}
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
