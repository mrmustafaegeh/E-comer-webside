"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../contexts/AuthContext";
import { post } from "../../services/api";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CreditCard, MapPin, Truck, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-black">
            <Loader2 className="animate-spin w-10 h-10 text-white mb-6" />
            <p className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[0.5em] animate-pulse">Initializing Terminal...</p>
        </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, router]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const subtotal = Number(cartTotal) || 0;
    return subtotal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      setError("Protocol Error: Identity authentication required.");
      setLoading(false);
      return;
    }

    try {
      if (formData.paymentMethod === "stripe") {
        const response = await post("/checkout/session", {
          items: cartItems.map(item => ({
            id: item.id || item._id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            imgSrc: item.imgSrc || item.image,
          })),
          email: user?.email,
        });

        if (response && response.url) {
          window.location.href = response.url;
          return;
        } else {
          throw new Error("No secure gateway URL returned.");
        }
      }

      const orderPayload = {
        userId: user.id || user._id,
        products: cartItems.map((item) => ({
          productId: item.id || item._id,
          name: item.name,
          quantity: item.qty,
          price: item.price,
          image: item.imgSrc || item.image,
        })),
        totalPrice: calculateTotal(),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        status: "pending",
      };

      await post("/orders", orderPayload);
      clearCart();
      router.push("/orders/success");
    } catch (err) {
      setError(err.message || "Transmission Failure. Retry protocol.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none z-0"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 md:py-40 relative z-10">
        <header className="mb-20">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-3 text-[10px] font-mono font-black text-gray-500 uppercase tracking-[0.4em] hover:text-white transition-all mb-12 italic group"
            >
                <ArrowLeft size={14} strokeWidth={3} className="group-hover:-translate-x-2 transition-transform" /> [ Return to Queue ]
            </button>
            <h1 className="text-6xl md:text-8xl font-heading font-black text-white tracking-tighter uppercase italic leading-none">Checkout.</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
                    <div className="lg:col-span-7 space-y-24">
            
                        <section className="space-y-12">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <h2 className="text-[10px] font-mono font-black text-white uppercase tracking-[0.5em] italic">PHASE_01 / IDENTITY & LOGISTICS</h2>
                    <ShieldCheck size={20} strokeWidth={1} className="text-gray-800" />
                </div>
                
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[0.3em] ml-1">// CONSIGNEE NAME</label>
                        <input name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white font-mono text-[11px] uppercase" placeholder="NAME / IDENTIFIER" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[0.3em] ml-1">// LOGISTICS ADDRESS</label>
                        <input name="address" required value={formData.address} onChange={handleInputChange} className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white font-mono text-[11px] uppercase" placeholder="STREET / HUB" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[0.3em] ml-1">// METROPOLIS HUB</label>
                            <input name="city" required value={formData.city} onChange={handleInputChange} className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white font-mono text-[11px] uppercase" placeholder="CITY" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[0.3em] ml-1">// ZIP MAPPING</label>
                            <input name="zipCode" required value={formData.zipCode} onChange={handleInputChange} className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white font-mono text-[11px] uppercase" placeholder="0000" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[0.3em] ml-1">// SOVEREIGN TERRITORY</label>
                        <select name="country" required value={formData.country} onChange={handleInputChange} className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white outline-none transition-all focus:border-white font-mono text-[11px] uppercase appearance-none shadow-xl">
                            <option value="">SELECT TARGET TERRITORY</option>
                            <option value="US">UNITED STATES</option>
                            <option value="CA">CANADA</option>
                            <option value="UK">UNITED KINGDOM</option>
                            <option value="AU">AUSTRALIA</option>
                        </select>
                    </div>
                </form>
            </section>

                        <section className="space-y-12 pb-12">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <h2 className="text-[10px] font-mono font-black text-white uppercase tracking-[0.5em] italic">PHASE_02 / AUTHORIZATION</h2>
                    <CreditCard size={20} strokeWidth={1} className="text-gray-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className={`group relative overflow-hidden flex items-center p-8 rounded-none cursor-pointer transition-all border shadow-2xl ${
                        formData.paymentMethod === "cod" ? "bg-white border-white" : "bg-black border-white/10 hover:border-white"
                    }`}>
                        <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleInputChange} className="hidden" />
                        <div className="flex-1 relative z-10">
                            <p className={`text-[11px] font-mono font-black uppercase tracking-[0.3em] mb-2 ${formData.paymentMethod === "cod" ? "text-black" : "text-white"}`}>Terminal Arrival</p>
                            <p className={`text-[9px] font-mono uppercase italic ${formData.paymentMethod === "cod" ? "text-black opacity-60" : "text-gray-700"}`}>Pay on delivery protocol</p>
                        </div>
                        <Truck className={`relative z-10 transition-transform duration-500 ${formData.paymentMethod === "cod" ? "text-black" : "text-gray-800 group-hover:scale-110"}`} size={28} strokeWidth={1.5} />
                    </label>

                    <label className={`group relative overflow-hidden flex items-center p-8 rounded-none cursor-pointer transition-all border shadow-2xl ${
                        formData.paymentMethod === "stripe" ? "bg-white border-white" : "bg-black border-white/10 hover:border-white"
                    }`}>
                        <input type="radio" name="paymentMethod" value="stripe" checked={formData.paymentMethod === "stripe"} onChange={handleInputChange} className="hidden" />
                        <div className="flex-1 relative z-10">
                            <p className={`text-[11px] font-mono font-black uppercase tracking-[0.3em] mb-2 ${formData.paymentMethod === "stripe" ? "text-black" : "text-white"}`}>Secure Gateway</p>
                            <p className={`text-[9px] font-mono uppercase italic ${formData.paymentMethod === "stripe" ? "text-black opacity-60" : "text-gray-700"}`}>Instant clearance via stripe</p>
                        </div>
                        <CreditCard className={`relative z-10 transition-transform duration-500 ${formData.paymentMethod === "stripe" ? "text-black" : "text-gray-800 group-hover:scale-110"}`} size={28} strokeWidth={1.5} />
                    </label>
                </div>
            </section>
          </div>

                    <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-10 bg-black p-10 md:p-14 rounded-none border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div className="flex items-center justify-between border-b border-white/10 pb-6 relative z-10">
                    <h2 className="text-[10px] font-mono font-black text-white uppercase tracking-[0.4em] italic">PHASE_03 / SUMMARY</h2>
                    <span className="text-[10px] font-mono font-black text-white bg-white/5 px-4 py-1 rounded-none border border-white/10">{cartItems.length} IDs Loaded</span>
                </div>

                <div className="space-y-8 max-h-[45vh] overflow-y-auto pr-4 custom-scrollbar relative z-10">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-8 items-center group/item">
                            <div className="relative w-20 h-24 bg-black rounded-none overflow-hidden border border-white/10 flex-shrink-0 transition-all duration-700 group-hover/item:border-white">
                                <Image src={item.imgSrc || item.image || "/images/placeholder.png"} alt={item.name} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                                <div className="absolute inset-x-0 bottom-0 bg-black/90 backdrop-blur-sm text-white border-t border-white/10 text-[9px] font-mono font-black uppercase tracking-widest text-center py-1.5 transition-all group-hover/item:bg-white group-hover/item:text-black">Q: {item.qty}</div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-heading font-black text-white tracking-tight uppercase italic truncate transition-transform duration-500 group-hover/item:translate-x-2">{item.name}</h4>
                                <p className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.3em] font-black mt-2">${Number(item.price).toFixed(2)} / Unit</p>
                            </div>
                            <div className="text-sm font-mono font-black text-white tracking-tighter uppercase italic">${(Number(item.price) * item.qty).toFixed(2)}</div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6 pt-8 border-t border-white/10 relative z-10">
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono font-black text-gray-700 uppercase tracking-[0.3em]">Gross Value</span>
                        <span className="font-mono font-black text-gray-400 text-xs">${Number(cartTotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono font-black text-gray-700 uppercase tracking-[0.3em]">Logistic Surcharge</span>
                        <span className="font-mono font-black text-white uppercase tracking-[0.3em] text-[10px] border border-white/10 px-4 py-1 italic">WAIVED</span>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/10 relative z-10">
                    <div className="flex justify-between items-end mb-12">
                        <div className="space-y-3">
                            <p className="text-[10px] font-mono font-black text-white uppercase tracking-[0.5em] italic">Total Obligation</p>
                            <p className="text-5xl font-mono font-black text-white tracking-tighter uppercase leading-none italic">${calculateTotal().toFixed(2)}</p>
                        </div>
                        <ShieldCheck size={36} strokeWidth={1} className="text-white opacity-10" />
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-6 bg-white/5 text-white text-[10px] font-mono font-black uppercase tracking-[0.3em] rounded-none border border-white/20 italic leading-relaxed">// {error}</motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        form="checkout-form"
                        disabled={loading || !user}
                        className="w-full bg-white text-black py-8 rounded-none font-mono text-[11px] font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-black hover:text-white border border-white flex items-center justify-center gap-4 relative overflow-hidden group/btn disabled:opacity-30 transition-all duration-700 active:scale-95"
                    >
                        <div className="absolute inset-0 bg-black -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700 ease-in-out"></div>
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin relative z-10" size={20} strokeWidth={3} />
                                <span className="relative z-10">TRANSMITTING...</span>
                            </>
                        ) : (
                            <>
                                <span className="relative z-10">{formData.paymentMethod === "stripe" ? "PROCEED TO GATEWAY" : "EXECUTE CLEARANCE"}</span>
                                <ArrowRight size={20} className="group-hover/btn:translate-x-3 transition-transform relative z-10" />
                            </>
                        )}
                    </button>
                    {!user && (
                        <p className="text-[10px] font-mono font-black text-center text-white opacity-30 mt-8 uppercase tracking-[0.4em] italic animate-pulse">* IDENTITY SYNC REQUIRED FOR CLEARANCE</p>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}