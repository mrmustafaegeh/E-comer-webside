"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/productSlice";
import AddProductButton from "@/components/admin/products/AddProductButton";
import ProductTable from "@/components/admin/products/ProductTable";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <AddProductButton />
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading products...</div>
      ) : (
        <ProductTable products={list} />
      )}
    </div>
  );
}
