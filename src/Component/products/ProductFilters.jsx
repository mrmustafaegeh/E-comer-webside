"use client";

import { Search, X, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Container,
  SectionHeader,
  Input,
  Label,
  Select,
  Button,
} from "../ui/primitives";

export default function ProductFilters({
  localFilters,
  setLocalFilters,
  applyFilters,
  clearFilters,
}) {
  const [categories, setCategories] = useState([]);

  const safe = localFilters || {
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/category");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="border-b border-[var(--border)] bg-[var(--bg)] py-10 md:py-12">
      <Container>
        <SectionHeader
          label="Shop"
          title="All products"
          description="Browse our full catalog."
          className="mb-8 md:mb-10"
        />

        <div className="grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-4 md:grid-cols-2 lg:grid-cols-5 lg:items-end lg:p-5">
          <div className="lg:col-span-2">
            <Label htmlFor="product-search">Search</Label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <Input
                id="product-search"
                type="text"
                placeholder="Search products"
                value={safe.search}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...(prev || {}),
                    search: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyFilters();
                }}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="product-category">Category</Label>
            <Select
              id="product-category"
              value={safe.category}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...(prev || {}),
                  category: e.target.value,
                }))
              }
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id || cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="product-min">Min price</Label>
            <Input
              id="product-min"
              type="number"
              placeholder="0"
              value={safe.minPrice}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...(prev || {}),
                  minPrice: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="product-max">Max price</Label>
            <Input
              id="product-max"
              type="number"
              placeholder="Any"
              value={safe.maxPrice}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...(prev || {}),
                  maxPrice: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex gap-2 lg:col-span-5">
            <Button onClick={applyFilters}>
              <Filter size={16} />
              Apply filters
            </Button>
            <Button variant="secondary" onClick={clearFilters}>
              <X size={16} />
              Clear
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
