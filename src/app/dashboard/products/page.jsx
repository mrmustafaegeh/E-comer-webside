// src/app/(admin)/products/page.jsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  deleteAdminProduct,
} from "@/store/adminProductSlice";
import { useRouter } from "next/navigation";
import ProtectedAdmin from "@/components/admin/ProtectedAdmin";

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, loading } = useSelector((state) => state.adminProducts);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  return (
    <ProtectedAdmin>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Products</h1>

          <Link
            href="/admin/products/create"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Create product
          </Link>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((p) => (
              <div key={p._id} className="border p-4 rounded">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-40 object-contain mb-2"
                />

                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-600">${p.price}</p>

                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/admin/products/edit/${p._id}`}
                    className="px-3 py-1 border rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => {
                      if (confirm("Delete product?")) {
                        dispatch(deleteAdminProduct(p._id));
                      }
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedAdmin>
  );
}
