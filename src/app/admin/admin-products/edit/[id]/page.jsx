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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getProduct(id);
        if (mounted) {
          setInitial(data);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        if (mounted) {
          setError(err.message || "Failed to load product");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSave = async (data) => {
    try {
      await dispatch(
        updateAdminProduct({
          id,
          payload: data,
          oldImageUrl: initial?.image,
        })
      ).unwrap();

      router.push("/admin/products");
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("Failed to update product. Please try again.");
    }
  };

  if (loading) {
    return (
      <ProtectedAdmin>
        <div className="p-6 max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </ProtectedAdmin>
    );
  }

  if (error) {
    return (
      <ProtectedAdmin>
        <div className="p-6 max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => router.push("/admin/products")}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Back to Products
            </button>
          </div>
        </div>
      </ProtectedAdmin>
    );
  }

  if (!initial) {
    return (
      <ProtectedAdmin>
        <div className="p-6 max-w-3xl mx-auto">
          <p className="text-gray-500">Product not found</p>
        </div>
      </ProtectedAdmin>
    );
  }

  return (
    <ProtectedAdmin>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin/products")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={18} />
            Back to Products
          </button>

          <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-gray-600 mt-2">
            Update product information and images
          </p>
        </div>
        <ProductForm initialValues={initial} onSaved={handleSave} />
      </div>
    </ProtectedAdmin>
  );
}
