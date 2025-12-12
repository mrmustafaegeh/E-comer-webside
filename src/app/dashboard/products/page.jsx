"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProducts } from "@/redux/slices/productSlice";
import ProductTable from "@/components/dashboard/ProductTable";

export default function DashboardProducts() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.products.list);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  return <ProductTable products={products} />;
}
