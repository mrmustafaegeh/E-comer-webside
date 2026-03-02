"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../lib/validation";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowRight, AlertCircle, ShoppingBag, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "mr.mustafaegeh@gmail.com" },
    resolver: zodResolver(LoginSchema),
  });

  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loginError, setLoginError] = useState("");

  async function onSubmit(data) {
    try {
      setLoginError("");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setLoginError(result.error || "Invalid credentials");
        return;
      }

      if (result.success) {
        await refreshUser();
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
      <div className="fixed inset-0 border-[24px] border-white/5 pointer-events-none z-50 hidden lg:block" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[480px] relative z-10"
      >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-12 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black border border-white/20 rounded-none text-white mb-8 transition-transform hover:rotate-90 duration-500">
                <ShieldCheck size={32} strokeWidth={1} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-black text-white tracking-tighter mb-4 uppercase italic">Access Profile.</h1>
            <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.5em]">Global Authentication Protocol</p>
        </div>

        <div className="bg-black p-6 md:p-12 rounded-none border border-white/10 md:shadow-2xl relative z-10 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

            <AnimatePresence mode="wait">
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-8 p-4 bg-white/5 text-white rounded-none flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-widest border border-white/20"
                >
                  <AlertCircle size={16} />
                  <p>{loginError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[0.3em] ml-1">Authentication ID</label>
                <div className="relative group">
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="NAME@MAINFRAME.COM"
                    className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white focus:ring-0 font-mono text-xs uppercase"
                  />
                </div>
                {errors.email && (
                  <p className="text-white text-[9px] font-mono font-bold uppercase tracking-widest mt-2 ml-1 italic">// {errors.email.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1 mb-1">
                  <label className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[0.3em]">Security Access Key</label>
                </div>
                <div className="relative group focus-within:z-10">
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white focus:ring-0 font-mono text-xs"
                  />
                </div>
                {errors.password && (
                  <p className="text-white text-[9px] font-mono font-bold uppercase tracking-widest mt-2 ml-1 italic">// {errors.password.message}</p>
                )}
              </div>

              <div className="pt-6">
                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-white hover:bg-black text-black hover:text-white border border-white py-6 rounded-none flex items-center justify-center gap-4 transition-all duration-500 disabled:opacity-50 group relative overflow-hidden active:scale-95"
                >
                    <div className="absolute inset-0 bg-black -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
                    {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                        <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] relative z-10">Verifying...</span>
                    </>
                    ) : (
                    <>
                        <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] relative z-10">Initialize Login</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" />
                    </>
                    )}
                </button>
              </div>
            </form>
        </div>

        <div className="mt-12 text-center relative z-10">
            <p className="text-gray-500 text-[9px] font-mono font-black uppercase tracking-[0.4em] mb-4">
                No credentials found?
            </p>
            <Link 
                href="/auth/register" 
                className="inline-flex items-center text-white font-mono font-black text-[10px] uppercase tracking-[0.3em] hover:text-gray-400 transition-colors group"
            >
                Create Hub Identity <ArrowRight size={14} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
        </div>

        <p className="mt-20 text-center text-[9px] font-mono font-black uppercase tracking-[0.6em] text-gray-800 relative z-10">
            Secure Entry Protocol v3.0 // BW Edition
        </p>
      </motion.div>
    </div>
  );
}
