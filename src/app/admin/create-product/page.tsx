"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import ProductForm from "../../../Component/dashboard/ProductForm";
import ProtectedAdmin from "../../../Component/dashboard/ProtectedAdmin";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { createAdminProduct } from "../../../store/adminProductSlice";
import { motion } from "framer-motion";

export default function AdminCreateProduct() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const result = await dispatch(createAdminProduct(data) as any).unwrap();

      if (result?.id || result?._id) {
        // Success - redirect to products list
        setTimeout(() => {
          router.push("/admin/admin-products");
          router.refresh();
        }, 1000);
      } else {
        throw new Error("Failed to create asset - no ID assigned by Network handler");
      }
    } catch (err: any) {
      console.error("Failed to create product:", err);
      setError(
        err?.error ||
          err?.message ||
          "Exception Handled: Asset instantiation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedAdmin>
      <div className="w-full max-w-[2000px] mx-auto pb-10">
        {/* Header with back button */}
        <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="mb-8"
        >
          <Link
            href="/admin/admin-products"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-4 group font-mono text-xs uppercase tracking-widest transition-colors mb-4 inline-block"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Abort & Return to Matrix
          </Link>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div 
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 w-1 h-full bg-red-500"></div>
            <div className="flex items-start gap-4">
              <AlertCircle className="text-red-500 mt-0.5" size={20} />
              <div className="flex-1">
                <h3 className="font-sora font-semibold text-red-500">
                  Protocol: Creation Aborted
                </h3>
                <p className="text-red-400 text-sm mt-1 font-mono tracking-wide">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-white text-[10px] font-mono uppercase tracking-widest font-medium mt-4 transition-colors"
                >
                  Dismiss Error
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Product Form */}
        <ProductForm initialValues={{}} onSaved={handleSave} />

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-[#0f1117]/80 backdrop-blur-xl flex items-center justify-center z-[100]">
            <div className="bg-[#161b27] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(59,130,246,0.1)] p-12 max-w-sm mx-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
              <div className="flex flex-col items-center relative z-10">
                 <div className="w-16 h-16 relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                    <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                 </div>
                 <h3 className="text-xl font-sora font-semibold text-white mb-2">
                   Executing Deployment
                 </h3>
                 <p className="text-gray-400 text-center font-mono text-[10px] uppercase tracking-widest">
                    Synchronizing metadata block with global CDN...
                 </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedAdmin>
  );
}
