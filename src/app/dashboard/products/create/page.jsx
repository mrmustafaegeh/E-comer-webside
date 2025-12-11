// src/app/(admin)/products/create/page.jsx
"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { createAdminProduct } from "@/store/slices/adminProductSlice";
import ProductForm from "@/components/admin/ProductForm";
import ProtectedAdmin from "@/components/admin/ProtectedAdmin";
import { useRouter } from "next/navigation";

export default function AdminCreateProduct() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSave = async (data) => {
    const created = await dispatch(createAdminProduct(data)).unwrap();
    if (created?.id || created?._id) {
      // navigate to admin list or edit
      router.push("/admin/products");
    }
  };

  return (
    <ProtectedAdmin>
      <div className="p-6 max-w-3xl">
        <h1 className="text-2xl font-semibold mb-4">Create product</h1>
        <ProductForm onSaved={handleSave} />
      </div>
    </ProtectedAdmin>
  );
}
