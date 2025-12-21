"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import ProductList from "../../components/products/ProductsList";
import ProductFilters from "../../components/products/ProductFilters";
import ProductPagination from "../../components/products/ProductPagination";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [localFilters, setLocalFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const limit = 12;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (appliedFilters.search) params.append("search", appliedFilters.search);
      if (appliedFilters.category)
        params.append("category", appliedFilters.category);
      if (appliedFilters.minPrice)
        params.append("minPrice", appliedFilters.minPrice);
      if (appliedFilters.maxPrice)
        params.append("maxPrice", appliedFilters.maxPrice);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      } else {
        console.error(data.error || "Failed to fetch products");
        setProducts([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Fetch products failed:", err);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, appliedFilters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const applyFilters = () => {
    setAppliedFilters({ ...localFilters });
    setPage(1);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    };
    setLocalFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  const hasActiveFilters =
    appliedFilters.search ||
    appliedFilters.category ||
    appliedFilters.minPrice ||
    appliedFilters.maxPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6">
          <ProductFilters
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
            applyFilters={applyFilters}
            clearFilters={clearFilters}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : products.length === 0 ? (
          <div className="py-20">
            <EmptyState
              message={
                hasActiveFilters
                  ? "No products match your filters. Try adjusting your search criteria."
                  : "No products found"
              }
            />
            {hasActiveFilters && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="mb-8">
              <ProductList products={products} />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <ProductPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
