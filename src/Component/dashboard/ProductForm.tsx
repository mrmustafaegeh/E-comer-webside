"use client";

import React, { useEffect, useCallback, useState } from "react";
import NextImage from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Trash2, ArrowRight, Loader2, Plus, Info, ShieldCheck, Smartphone, Eye, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Types & Schema                                                      */
/* ------------------------------------------------------------------ */

export interface ProductFormValues {
  id?: string;
  title: string;
  price: number;
  offerPrice?: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
  tags?: string;
  sku?: string;
}

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.number().min(0, "Price must be positive"),
  offerPrice: z.number().min(0).optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Valid image URL required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  featured: z.boolean(),
  tags: z.string().optional(),
  sku: z.string().optional(),
});

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>;
  onSaved?: (data: ProductFormValues) => Promise<void>;
}

/* ------------------------------------------------------------------ */
/* Main Component                                                      */
/* ------------------------------------------------------------------ */

export default function ProductForm({
  initialValues = {},
  onSaved,
}: ProductFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: "",
      price: 0,
      offerPrice: 0,
      description: "",
      category: "",
      image: "",
      stock: 0,
      featured: false,
      tags: "",
      sku: `SKU-${Date.now()}`,
    },
  });

  const price = watch("price");
  const offerPrice = watch("offerPrice");
  const featured = watch("featured");
  const description = watch("description");
  const title = watch("title");
  const category = watch("category");
  const stock = watch("stock");

  useEffect(() => {
    if (!initialValues?.id) return;
    reset(initialValues as ProductFormValues);
    if (typeof initialValues.image === "string" && initialValues.image) {
      setPreviewUrl(initialValues.image);
      setValue("image", initialValues.image);
    }
  }, [initialValues?.id, reset, setValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Invalid visual format");
      return;
    }

    setUploading(true);
    setUploadError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Transmission failed");

      setValue("image", data.url, { shouldValidate: true });
      setPreviewUrl(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Transmission failed");
      setPreviewUrl("");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = useCallback(() => {
    setPreviewUrl("");
    setValue("image", "", { shouldValidate: true });
  }, [setValue]);

  const onSubmit = async (data: ProductFormValues) => {
    if (!onSaved) return;
    await onSaved(data);
  };

  const discount = offerPrice && price > 0 ? Math.round(((price - offerPrice) / price) * 100) : 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full text-white mx-auto pb-24 max-w-[2000px]">
      
      {/* Top Protocol Bar */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
      >
        <div>
            <span className="text-blue-500 text-xs font-mono uppercase tracking-widest mb-2 block flex items-center gap-2">
               <Sparkles size={14} /> Asset Generation Protocol
            </span>
            <h1 className="text-4xl md:text-5xl font-sora font-bold tracking-tight text-white flex items-center gap-4">
                {initialValues.id ? "Reconfigure Node" : "Mint Core Asset"}
            </h1>
        </div>
        <div className="flex items-center gap-4">
            <button
                type="button"
                onClick={() => reset()}
                className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors border border-transparent hover:border-white/10 rounded-xl"
            >
                Flush Data
            </button>
            <button
                disabled={!isValid || uploading || isSubmitting}
                type="submit"
                className="px-8 py-4 bg-blue-600 border border-blue-500 text-white rounded-xl font-mono text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin text-white" size={16} />
                        Committing...
                    </>
                ) : (
                    <>
                        {initialValues.id ? "Update Architecture" : "Deploy to Network"}
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </div>
      </motion.header>

      {/* Split Pane Editor */}
      <div className="flex xl:flex-row flex-col gap-8 h-full items-start">
        
        {/* Left Side: Input Modules */}
        <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.1 }}
           className="w-full xl:w-[60%] space-y-8 flex-shrink-0"
        >
            {/* Essential Data */}
            <div className="bg-[#161b27] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group/panel">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none group-hover/panel:bg-blue-500/10 transition-colors"></div>
                
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest pb-6 mb-6 border-b border-white/5 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Primary Specifications
                </h3>
                
                <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Asset Designation (Title)</label>
                        <input
                            {...register("title")}
                            className="w-full bg-[#0f1117] border border-white/10 rounded-xl py-4 px-5 text-white placeholder:text-gray-600 outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 font-sora shadow-inner"
                            placeholder="e.g. Next-Gen Wireless Audio..."
                        />
                        {errors.title && <p className="text-[10px] font-mono text-red-500 uppercase tracking-widest ml-1 mt-2">{errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Base Valuation (Price)</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">$</span>
                                <input
                                    type="number"
                                    step="any"
                                    {...register("price", { valueAsNumber: true })}
                                    className="w-full bg-[#0f1117] border border-white/10 rounded-xl py-4 pl-10 pr-5 text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 font-mono shadow-inner"
                                />
                            </div>
                            {errors.price && <p className="text-[10px] font-mono text-red-500 uppercase tracking-widest ml-1 mt-2">{errors.price.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Promotional Offset (Sale Price)</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">$</span>
                                <input
                                    type="number"
                                    step="any"
                                    {...register("offerPrice", { valueAsNumber: true })}
                                    className="w-full bg-[#0f1117] border border-white/10 rounded-xl py-4 pl-10 pr-5 text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 font-mono shadow-inner"
                                />
                                {discount > 0 && (
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">-{discount}% Delta</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Data Log (Description)</label>
                        <textarea
                            {...register("description")}
                            rows={5}
                            className="w-full bg-[#0f1117] border border-white/10 rounded-xl py-4 px-5 text-white placeholder:text-gray-600 outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 font-sora shadow-inner resize-none"
                            placeholder="Comprehensive asset description and structural specifications..."
                        />
                        <div className="flex justify-between items-center px-1">
                            {errors.description ? (
                                <p className="text-[10px] font-mono text-red-500 uppercase tracking-widest mt-1">{errors.description.message}</p>
                            ) : <div />}
                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">{description?.length ?? 0} BYTES</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logistics & Taxonomy */}
            <div className="bg-[#161b27] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group/panel">
                 <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest pb-6 mb-6 border-b border-white/5 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    Logistic Parameters
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Classification (Category)</label>
                        <input
                            {...register("category")}
                            className="w-full bg-[#0f1117] border border-white/10 rounded-xl py-4 px-5 text-white placeholder:text-gray-600 outline-none transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 font-sora shadow-inner"
                            placeholder="e.g. Hardware"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Initial Stock Count</label>
                        <input
                            type="number"
                            step="any"
                            {...register("stock", { valueAsNumber: true })}
                            className="w-full bg-[#0f1117] border border-white/10 rounded-xl py-4 px-5 text-white outline-none transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 font-mono shadow-inner"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-8 pt-6 border-t border-white/5 relative z-10">
                    <label className="group flex items-center gap-4 cursor-pointer">
                        <div className="relative w-6 h-6">
                            <input type="checkbox" {...register("featured")} className="peer absolute inset-0 opacity-0 cursor-pointer" />
                            <div className="w-full h-full bg-[#0f1117] rounded border border-white/20 peer-checked:bg-blue-600 peer-checked:border-blue-500 transition-all shadow-inner" />
                            <Plus className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all" size={12} strokeWidth={4} />
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">Flag as Hero Feature</span>
                    </label>
                </div>
            </div>

            {/* Visual Attachment Logic */}
            <div className="bg-[#161b27] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group/panel">
                 <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest pb-6 mb-6 border-b border-white/5 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Visual Data Block
                </h3>
                
                {previewUrl ? (
                    <div className="group relative w-full h-48 bg-[#0f1117] rounded-xl overflow-hidden border border-white/10 shadow-inner flex items-center justify-center cursor-pointer" onClick={handleRemoveImage}>
                        <NextImage src={previewUrl} alt="Product Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center backdrop-blur-sm gap-2">
                             <Trash2 size={24} className="text-red-500" />
                             <span className="text-[10px] font-mono uppercase tracking-widest text-red-400">Flush Visual Data</span>
                        </div>
                    </div>
                ) : (
                    <label className="w-full h-48 bg-[#0f1117]/50 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-blue-500/50 transition-all group relative z-10">
                        <div className="w-12 h-12 bg-[#161b27] border border-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all shadow-xl">
                            <ImageIcon size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest text-center group-hover:text-blue-400 transition-all">
                            Initiate Upload Protocol<br />
                            <span className="opacity-50 mt-1 block">Supports WEBP, PNG, JPG</span>
                        </span>
                        <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-[#161b27]/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
                        <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest animate-pulse">Encoding Pixels...</span>
                    </div>
                )}
                
                <AnimatePresence>
                    {uploadError && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 p-4 bg-red-500/10 text-red-400 text-[10px] font-mono uppercase tracking-widest rounded-xl border border-red-500/20">
                           {uploadError}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>


        {/* Right Side: LIVE UI PREVIEW */}
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
           className="w-full xl:w-[40%] flex-shrink-0 sticky top-8 hidden lg:block"
        >
            <div className="bg-[#161b27] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                    <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Smartphone size={16} /> Device Render
                    </h3>
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50 hover:bg-emerald-500 cursor-pointer transition-colors shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                    </div>
                </div>

                {/* Simulated Front-End App UI Frame */}
                <div className="w-[340px] h-[650px] bg-white rounded-[3rem] border-8 border-[#0f1117] relative shadow-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] scale-95 origin-top transform transition-all hover:scale-100 flex flex-col">
                    {/* Dynamic Island / Notch Mock */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0f1117] rounded-b-xl z-50"></div>
                    
                    {/* Simulated App Header */}
                    <div className="h-20 bg-gray-50 border-b border-gray-100 flex items-end justify-between px-6 pb-4 shrink-0">
                        <ArrowRight size={20} className="text-gray-900 rotate-180" />
                        <span className="font-sora font-semibold text-sm text-gray-900 truncate max-w-[150px]">{category || "Category"}</span>
                        <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                    </div>

                    {/* App Content Body */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 pb-10">
                         {/* Image View */}
                         <div className="w-full aspect-square bg-white relative">
                            {previewUrl ? (
                                <NextImage src={previewUrl} fill className="object-cover" alt="Preview Frame" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-3">
                                    <ImageIcon size={48} />
                                    <span className="text-xs font-mono tracking-widest opacity-50 uppercase">No Visual Signal</span>
                                </div>
                            )}
                            
                            {featured && (
                                <div className="absolute top-4 left-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-black/20">
                                   HOT <Sparkles size={10} />
                                </div>
                            )}
                         </div>

                         {/* Details Area */}
                         <div className="p-6 bg-white -mt-6 relative rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                             <div className="flex items-start justify-between gap-4 mb-4">
                                <h1 className="text-xl font-sora font-black text-gray-900 leading-tight">
                                    {title || "Asset Placeholder Title"}
                                </h1>
                             </div>

                             <div className="flex items-end gap-3 mb-6">
                                <span className="text-2xl font-mono text-gray-900 font-bold tracking-tighter">
                                    ${(offerPrice && offerPrice > 0 ? offerPrice : (price || 0)).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </span>
                                {offerPrice && offerPrice > 0 && price > 0 && (
                                    <span className="text-sm font-mono text-gray-400 line-through mb-1">
                                        ${price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </span>
                                )}
                             </div>

                             <p className="text-xs text-gray-500 font-sora leading-relaxed mb-6 whitespace-pre-line">
                                {description || "A detailed structural and technical summary of the mapped asset will be rendered here globally."}
                             </p>

                             <div className="space-y-4">
                                 <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-4">
                                     <span className="text-gray-400 font-bold uppercase tracking-widest">Inventory Status</span>
                                     <span className={`font-mono font-bold ${stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                         {stock > 0 ? `${stock} AVAILABLE` : 'DEPLETED'}
                                     </span>
                                 </div>
                                 <button disabled className="w-full py-4 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest opacity-90 cursor-not-allowed">
                                    Add To Cart
                                 </button>
                             </div>
                         </div>
                    </div>
                </div>

                <div className="mt-8 flex items-start gap-4 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 w-fit">
                    <ShieldCheck className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
                    <p className="text-[10px] font-mono text-blue-300 uppercase tracking-widest leading-relaxed max-w-[250px]">
                        The render engine calculates a 1:1 mobile DOM preview using current parametric values above.
                    </p>
                </div>
            </div>
        </motion.div>

      </div>
    </form>
  );
}
