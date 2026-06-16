"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "../../Component/ui/LoadingSpinner";
import { useProducts } from "../../hooks/useProducts";
import ProductList from "../../Component/products/ProductsList";
import ProductFilters from "../../Component/products/ProductFilters";
import ProductPagination from "../../Component/products/ProductPagination";
import {
  Container,
  Select,
  Label,
  EmptyState,
  Button,
  Alert,
} from "../../Component/ui/primitives";

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "newest";

  const limit = 10;

  const [localFilters, setLocalFilters] = useState({
    search,
    category,
    minPrice,
    maxPrice,
    sort,
  });

  useEffect(() => {
    setLocalFilters({ search, category, minPrice, maxPrice, sort });
  }, [search, category, minPrice, maxPrice, sort]);

  const { data, isLoading, isPlaceholderData, error } = useProducts({
    page,
    limit,
    search,
    category,
    minPrice,
    maxPrice,
    sort,
  });

  const updateUrl = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newParams.page) {
        params.set("page", String(newParams.page));
      } else {
        params.set("page", "1");
      }

      Object.keys(newParams).forEach((key) => {
        if (key === "page") return;
        if (newParams[key]) {
          params.set(key, String(newParams[key]));
        } else {
          params.delete(key);
        }
      });

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleApplyFilters = () => {
    updateUrl(localFilters);
  };

  const handleClearFilters = () => {
    const cleared = { search: "", category: "", minPrice: "", maxPrice: "", sort: "newest" };
    setLocalFilters(cleared);
    updateUrl(cleared);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg)] py-32">
        <Container>
          <Alert variant="error">{error.message || "Failed to load products."}</Alert>
        </Container>
      </div>
    );
  }

  const products = data?.products || [];
  const totalItems = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <ProductFilters
        localFilters={localFilters}
        setLocalFilters={setLocalFilters}
        applyFilters={handleApplyFilters}
        clearFilters={handleClearFilters}
      />

      <Container className="pb-16">
        <div className="mb-8 flex flex-col gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--text-muted)]">
            Showing {products.length} of {totalItems} products
            {isPlaceholderData && " · Updating…"}
          </p>

          <div className="flex items-center gap-2">
            <Label htmlFor="sort" className="mb-0 whitespace-nowrap">
              Sort by
            </Label>
            <Select
              id="sort"
              value={localFilters.sort}
              onChange={(e) => {
                const newSort = e.target.value;
                setLocalFilters((p) => ({ ...p, sort: newSort }));
                updateUrl({ ...localFilters, sort: newSort });
              }}
              className="w-auto min-w-[160px]"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Rating</option>
            </Select>
          </div>
        </div>

        {isLoading && !products.length ? (
          <div className="flex justify-center py-24">
            <LoadingSpinner />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try adjusting your filters."
            action={
              <Button variant="secondary" onClick={handleClearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}>
            <ProductList products={products} />
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 border-t border-[var(--border)] pt-8">
            <ProductPagination
              page={page}
              totalPages={totalPages}
              onPageChange={(newPage) => updateUrl({ ...localFilters, page: newPage })}
            />
          </div>
        )}
      </Container>
    </div>
  );
}
