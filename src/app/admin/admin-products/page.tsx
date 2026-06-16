"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Filter, Search, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { fetchAdminProducts } from "../../../store/adminProductSlice";
import ProductTable from "../../../Component/dashboard/ProductTable";
import AdminPageShell from "../../../Component/admin/AdminPageShell";
import {
  AppPanel,
  Button,
  Input,
  Select,
  EmptyState,
  Alert,
} from "../../../Component/ui/primitives";

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const {
    items: products,
    loading,
    error,
  } = useSelector((state: any) => state.adminProducts);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchAdminProducts() as any);
  }, [dispatch]);

  const categories = [
    "all",
    ...new Set(
      (Array.isArray(products) ? products : [])
        .map((p) => p.category)
        .filter(Boolean)
    ),
  ];

  const filteredProducts = (Array.isArray(products) ? products : []).filter(
    (product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }
  );

  return (
    <AdminPageShell
      eyebrow="Catalog"
      title="Products"
      description="Manage your product inventory."
      actions={
        <Link href="/admin/create-product">
          <Button>
            <Plus size={16} /> Add product
          </Button>
        </Link>
      }
    >
      <AppPanel className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            type="text"
            placeholder="Search products…"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative w-full md:w-56">
          <Filter size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <Select
            value={selectedCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
            className="pl-9"
          >
            {categories.map((cat) => (
              <option key={cat as string} value={cat as string}>
                {cat === "all" ? "All categories" : (cat as string)}
              </option>
            ))}
          </Select>
        </div>
      </AppPanel>

      <AppPanel className="overflow-hidden p-0">
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center">
            <Loader2 className="mb-3 animate-spin text-[var(--text-muted)]" size={28} />
            <p className="text-sm text-[var(--text-muted)]">Loading products…</p>
          </div>
        ) : error ? (
          <div className="p-8">
            <Alert variant="error">{error}</Alert>
            <Button variant="secondary" className="mt-4" onClick={() => dispatch(fetchAdminProducts() as any)}>
              Retry
            </Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No products found"
              description={
                searchTerm || selectedCategory !== "all"
                  ? "Try a different search or category."
                  : "Add your first product to get started."
              }
              action={
                !searchTerm && selectedCategory === "all" ? (
                  <Link href="/admin/create-product">
                    <Button>
                      <Plus size={14} /> Add product
                    </Button>
                  </Link>
                ) : null
              }
            />
          </div>
        ) : (
          <ProductTable products={filteredProducts} />
        )}
      </AppPanel>
    </AdminPageShell>
  );
}
