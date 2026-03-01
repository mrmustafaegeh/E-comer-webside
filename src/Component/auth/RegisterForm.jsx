"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, Lock, Loader2, ArrowRight, AlertCircle, ShoppingBag, CheckCircle2, ShieldPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("referredBy");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setRegisterError("");
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, referredBy }),
      });

      const result = await response.json();

      if (!response.ok) {
        setRegisterError(result.error || "Registration failed");
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      setRegisterError("An unexpected error occurred. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full relative z-10"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="flex justify-center mb-8 relative z-10">
            <div className="w-20 h-20 bg-white/10 rounded-none flex items-center justify-center border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <CheckCircle2 className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            </div>
          </div>
          <h2 className="text-4xl font-heading font-black text-white tracking-tighter mb-4 relative z-10 uppercase italic">Authorized.</h2>
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-[0.4em] mb-10 relative z-10">Neural connection established</p>
          <div className="flex items-center justify-center gap-3 relative z-10">
             <Loader2 className="w-5 h-5 text-white animate-spin opacity-50" />
             <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500">Redirecting to mainframe...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden">
       {/* Decorative Border Layer */}
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
       <div className="fixed inset-0 border-[24px] border-white/5 pointer-events-none z-50 hidden lg:block" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[540px] relative z-10"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black border border-white/20 rounded-none text-white mb-8 transition-transform hover:rotate-90 duration-500">
                <ShieldPlus size={32} strokeWidth={1} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-black text-white tracking-tighter mb-4 uppercase italic">Register.</h1>
            <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.5em]">Global Identification Protocol</p>
        </div>

        <div className="bg-black p-6 md:p-12 rounded-none border border-white/10 md:shadow-2xl relative z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            
            <AnimatePresence mode="wait">
              {registerError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-8 p-4 bg-white/5 text-white rounded-none flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-widest border border-white/20"
                >
                  <AlertCircle size={16} />
                  <p>{registerError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name Field */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[0.3em] ml-1">Identity Name</label>
                    <input
                        {...register("name", { required: "Name is required" })}
                        type="text"
                        placeholder="ALPHA-01"
                        className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white focus:ring-0 font-mono text-xs uppercase"
                    />
                    {errors.name && <p className="text-white text-[9px] font-mono font-bold uppercase tracking-widest mt-2 ml-1 italic">// {errors.name.message}</p>}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[0.3em] ml-1">Archive Email</label>
                    <input
                        {...register("email", { 
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                        })}
                        type="email"
                        placeholder="archive@node.com"
                        className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white focus:ring-0 font-mono text-xs uppercase"
                    />
                    {errors.email && <p className="text-white text-[9px] font-mono font-bold uppercase tracking-widest mt-2 ml-1 italic">// {errors.email.message}</p>}
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Password Field */}
                <div className="space-y-3">
                    <label className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[0.3em] ml-1">Security Key</label>
                    <input
                        {...register("password", { 
                        required: "Password is required",
                        minLength: { value: 6, message: "At least 6 characters" }
                        })}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white focus:ring-0 font-mono text-xs"
                    />
                    {errors.password && <p className="text-white text-[9px] font-mono font-bold uppercase tracking-widest mt-2 ml-1 italic">// {errors.password.message}</p>}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-3">
                    <label className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[0.3em] ml-1">Verify Key</label>
                    <input
                        {...register("confirmPassword", { 
                        required: "Required",
                        validate: val => val === password || "Mismatch"
                        })}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white focus:ring-0 font-mono text-xs"
                    />
                    {errors.confirmPassword && <p className="text-white text-[9px] font-mono font-bold uppercase tracking-widest mt-2 ml-1 italic">// {errors.confirmPassword.message}</p>}
                </div>
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
                      <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] relative z-10">Initializing...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] relative z-10">Confirm Identity</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" />
                    </>
                  )}
                </button>
              </div>
            </form>
        </div>

        <div className="mt-12 text-center relative z-10">
            <p className="text-gray-600 text-[9px] font-mono font-black uppercase tracking-[0.4em] mb-4">
                Already registered?
            </p>
            <Link 
                href="/auth/login" 
                className="inline-flex items-center text-white font-mono font-black text-[10px] uppercase tracking-[0.3em] hover:text-gray-400 transition-colors group"
            >
                Return to Login <ArrowRight size={14} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
        </div>

        <p className="mt-20 text-center text-[9px] font-mono font-black uppercase tracking-[0.6em] text-gray-800 relative z-10">
            Secure Enrollment v3.0 // Monochrome Edition
        </p>
      </motion.div>
    </div>
  );
}
