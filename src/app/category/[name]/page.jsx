// app/category/[name]/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProductFilters from "../../../components/products/ProductFilters";
import useDebouncedValue from "../../../hooks/useDebouncedValue";

export default function CategoryPage({ params }) {
  const categoryName = decodeURIComponent(params.name);

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 24,
  });
  const [loading, setLoading] = useState(true);

  // filters state
  const [filters, setFilters] = useState({
    search: "",
    category: categoryName, // default to this category page
    minPrice: "",
    maxPrice: "",
  });

  // debounce ONLY the search text
  const debouncedSearch = useDebouncedValue(filters.search, 450);

  // build query
  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("page", String(meta.page));
    sp.set("limit", String(meta.limit));

    // category: from page route param OR dropdown
    if (filters.category) sp.set("category", filters.category);

    if (debouncedSearch) sp.set("search", debouncedSearch);
    if (filters.minPrice !== "") sp.set("minPrice", filters.minPrice);
    if (filters.maxPrice !== "") sp.set("maxPrice", filters.maxPrice);

    return sp.toString();
  }, [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    debouncedSearch,
    meta.page,
    meta.limit,
  ]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?${queryString}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Failed");

        if (!cancelled) {
          setProducts(data.products || []);
          setMeta((m) => ({
            ...m,
            total: data.total || 0,
            totalPages: data.totalPages || 1,
          }));
        }
      } catch (e) {
        console.error("Category fetch failed:", e);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  // keep category in sync if route changes
  useEffect(() => {
    setFilters((f) => ({ ...f, category: categoryName }));
    setMeta((m) => ({ ...m, page: 1 }));
  }, [categoryName]);

  return (
    <div className="px-6 md:px-16 py-10">
      <h1 className="text-3xl font-bold capitalize mb-2">
        {categoryName.replaceAll("-", " ")}
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        {loading ? "Loading..." : `${meta.total} product(s)`}
      </p>

      <ProductFilters
        value={filters}
        onChange={(next) => {
          setFilters(next);
          setMeta((m) => ({ ...m, page: 1 })); // reset paging on filter change
        }}
        categories={[
          categoryName, // ensure current is present
          "electronics",
          "fashion",
          "home",
          "sports",
        ]}
      />

      {loading ? (
        <div className="py-16 text-center text-gray-600">
          Loading {categoryName}...
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="p-4 border rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src={product.image || product.thumbnail || "/placeholder.png"}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-48 object-contain mb-4"
                />

                <h2 className="font-semibold text-lg mb-2 line-clamp-2">
                  {product.title}
                </h2>

                <p className="text-blue-600 font-bold text-xl mb-2">
                  ${product.salePrice ?? product.price}
                </p>

                <p className="text-sm text-gray-500">
                  ⭐ {product.rating ?? 0}
                </p>

                <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
                  View Product
                </button>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              className="px-4 py-2 rounded border disabled:opacity-50"
              disabled={meta.page <= 1}
              onClick={() => setMeta((m) => ({ ...m, page: m.page - 1 }))}
            >
              Prev
            </button>

            <span className="text-sm text-gray-600">
              Page {meta.page} / {meta.totalPages}
            </span>

            <button
              className="px-4 py-2 rounded border disabled:opacity-50"
              disabled={meta.page >= meta.totalPages}
              onClick={() => setMeta((m) => ({ ...m, page: m.page + 1 }))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
