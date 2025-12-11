// src/app/(admin)/products/edit/[id]/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateAdminProduct } from "@/store/slices/adminProductSlice";
import ProductForm from "@/components/admin/ProductForm";
import { adminService } from "@/services/adminService";
import ProtectedAdmin from "@/components/admin/ProtectedAdmin";

export default function AdminEditProduct() {
  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();
  const router = useRouter();
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await adminService.getProduct(id);
        if (mounted) setInitial(data);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => (mounted = false);
  }, [id]);

  const handleSave = async (data) => {
    await dispatch(updateAdminProduct({ id, payload: data })).unwrap();
    router.push("/admin/products");
  };

  if (!initial) return <div className="p-6">Loading...</div>;

  return (
    <ProtectedAdmin>
      <div className="p-6 max-w-3xl">
        <h1 className="text-2xl font-semibold mb-4">Edit product</h1>
        <ProductForm initialValues={initial} onSaved={handleSave} />
      </div>
    </ProtectedAdmin>
  );
}
