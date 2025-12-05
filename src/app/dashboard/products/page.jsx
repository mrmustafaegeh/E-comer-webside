"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchProducts } from "../../../store/productSlice";
import ProductTable from "../../../components/admin/products/ProductTable";
import AddProductButton from "../../../components/admin/products/AddProductButton";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";

export default function AdminProducts() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.products);
  const { isLoading, isAuthenticated, user } = useKindeBrowserClient();
  const router = useRouter();

  // Check admin role and authentication
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/api/auth/login");
      } else if (!user?.roles?.includes("admin")) {
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && user?.roles?.includes("admin")) {
      dispatch(fetchProducts());
    }
  }, [dispatch, isAuthenticated, user]);

  if (isLoading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (!isAuthenticated || !user?.roles?.includes("admin")) {
    return null; // Will redirect
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <AddProductButton />
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <ProductTable products={list} />
      )}
    </div>
  );
}
