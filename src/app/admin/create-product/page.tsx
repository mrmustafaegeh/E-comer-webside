"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import ProductForm from "../../../Component/dashboard/ProductForm";
import ProtectedAdmin from "../../../Component/dashboard/ProtectedAdmin";
import AdminPageShell from "../../../Component/admin/AdminPageShell";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { createAdminProduct } from "../../../store/adminProductSlice";
import { Alert, Card } from "../../../Component/ui/primitives";

export default function AdminCreateProduct() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const apiValues = {
        ...data,
        salePrice: data.offerPrice || 0,
        featured: data.featured || false,
      };

      const result = await dispatch(createAdminProduct(apiValues) as any).unwrap();

      if (result?.id || result?._id) {
        router.push("/admin/admin-products");
        router.refresh();
      } else {
        throw new Error("Failed to create product.");
      }
    } catch (err: any) {
      console.error("Failed to create product:", err);
      setError(err?.error || err?.message || "Could not create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedAdmin>
      <AdminPageShell
        eyebrow="Catalog"
        title="Add product"
        description="Create a new product listing."
      >
        <Link
          href="/admin/admin-products"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <ProductForm initialValues={{}} onSaved={handleSave} />

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <Card className="flex flex-col items-center p-8">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-[var(--text-muted)]" />
              <p className="text-sm text-[var(--text-muted)]">Saving product…</p>
            </Card>
          </div>
        )}
      </AdminPageShell>
    </ProtectedAdmin>
  );
}
