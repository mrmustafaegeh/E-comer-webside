"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "../../../../Component/dashboard/ProductForm";
import ProtectedAdmin from "../../../../Component/dashboard/ProtectedAdmin";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { ProductFormValues } from "@/Component/dashboard/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductFormValues | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/admin/admin-products/${id}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Failed to locate asset data");
        
        // Map strictly to expected initialValues for ProductForm.tsx
        setProduct({
          id: data._id || data.id,
          title: data.name || data.title || "",
          offerPrice: data.salePrice || 0,
          featured: data.isFeatured || false,
          image: data.image || "",
          description: data.description || "",
          category: data.category || "",
          price: data.price || 0,
          stock: data.stock || 0,
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""),
          sku: data.sku || "",
        });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async (values: any) => {
    try {
      setError("");

      const apiValues = {
        ...values,
        name: values.title,
        salePrice: values.offerPrice || 0,
        isFeatured: values.featured || false,
      };

      delete apiValues.title;
      delete apiValues.offerPrice;
      delete apiValues.featured;

      const res = await fetch(`/api/admin/admin-products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiValues),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update asset architecture");

      // Success - redirect to products list
      router.push("/admin/admin-products");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      throw e; // rethrow to let ProductForm handle loading state natively
    }
  };

  if (loading) {
     return (
        <ProtectedAdmin>
           <div className="flex flex-col items-center justify-center min-h-[60vh]">
               <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
               <p className="text-blue-400 font-mono text-[10px] uppercase tracking-widest animate-pulse">Querying Asset Data Block...</p>
           </div>
        </ProtectedAdmin>
     )
  }

  if (!product && !loading) {
     return (
        <ProtectedAdmin>
           <div className="flex flex-col items-center justify-center min-h-[60vh]">
               <AlertCircle className="text-red-500 mb-4" size={48} />
               <h2 className="text-2xl font-sora font-semibold text-white mb-2">Asset Not Found</h2>
               <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-6">The requested ID resolved to null.</p>
               <Link href="/admin/admin-products" className="px-6 py-2 border border-white/10 hover:bg-white/5 text-white rounded-lg text-xs font-mono uppercase tracking-widest transition-all shadow-inner">Return to Matrix</Link>
           </div>
        </ProtectedAdmin>
     )
  }

  return (
    <ProtectedAdmin>
      <div className="w-full max-w-[2000px] mx-auto pb-10">
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
                  Protocol: Update Aborted
                </h3>
                <p className="text-red-400 text-sm mt-1 font-mono tracking-wide">{error}</p>
                <button
                  onClick={() => setError("")}
                  className="text-red-400 hover:text-white text-[10px] font-mono uppercase tracking-widest font-medium mt-4 transition-colors"
                >
                  Dismiss Error
                </button>
              </div>
            </div>
          </motion.div>
        )}

                {product && <ProductForm initialValues={product} onSaved={handleSave} />}
      </div>
    </ProtectedAdmin>
  );
}
