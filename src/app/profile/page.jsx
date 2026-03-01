"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { get, put } from "../../services/api";
import { useSearchParams } from "next/navigation";
import { 
  User, Mail, MapPin, Phone, Camera, Save, Loader2, ArrowRight, 
  ShieldCheck, LogOut, CheckCircle2, Gift, Trophy, History, TrendingUp,
  Share2, Copy, Twitter, MessageSquare, Send
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ACTIVE_BOOSTERS, getUserTier } from "../../services/loyaltyService";

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview, security, orders, wishlist, loyalty
  
  const [profileData, setProfileData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: ""
  });

  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!user) {
        return;
    }
    fetchProfile();
  }, [user]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const fetchProfile = async () => {
    try {
        setLoading(true);
        const [data, lboard] = await Promise.all([
            get("/user/profile"),
            get("/loyalty/leaderboard").catch(() => [])
        ]);

        setProfileData(data);
        setLeaderboard(lboard);
        const addr = data.address || {};
        
        setFormData({
            name: data.name || "",
            email: data.email || "",
            image: data.image || "",
            phone: data.phone || "",
            address: addr.street || (typeof data.address === 'string' ? data.address : "") || "",
            city: addr.city || "",
            country: addr.country || "",
            zipCode: addr.zipCode || ""
        });
    } catch (err) {
        console.error("Failed to load profile", err);
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    try {
        setUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", uploadPreset);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: "POST",
                body: data,
            }
        );

        const fileData = await res.json();
        if (fileData.secure_url) {
            setFormData(prev => ({ ...prev, image: fileData.secure_url }));
        }
    } catch (err) {
        console.error("Upload failed", err);
    } finally {
        setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
        const payload = {
            name: formData.name,
            image: formData.image,
            phone: formData.phone,
            address: {
                street: formData.address,
                city: formData.city,
                country: formData.country,
                zipCode: formData.zipCode
            }
        };

        await put("/user/profile", payload);
        setMessage({ type: 'success', text: 'Protocol: Profile data synchronized successfully.' });
        if (updateUser) updateUser(payload);
    } catch (err) {
        setMessage({ type: 'error', text: 'Protocol: Synchronization failed.' });
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black">
            <Loader2 className="animate-spin w-10 h-10 text-white mb-4" />
            <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.2em] animate-pulse">Accessing Data...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Monochrome Noise Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 md:py-32 relative z-10">
        <header className="mb-20">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.4em] mb-4 block">Identity Terminal</span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase italic">Settings<span className="text-white opacity-20">.</span></h1>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => logout && logout()}
                        className="flex items-center gap-2 px-8 py-4 bg-transparent text-white border border-white/20 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                    {user?.isAdmin && (
                        <Link 
                            href="/admin/admin-products" 
                            className="flex items-center gap-2 px-8 py-4 bg-white border border-white text-black rounded-none text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            <ShieldCheck size={16} /> Admin Panel
                        </Link>
                    )}
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Nav Column */}
            <div className="lg:col-span-3 space-y-2">
                <button 
                    onClick={() => setActiveTab("overview")}
                    className={`w-full text-left px-6 py-4 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
                        activeTab === "overview" ? "bg-white text-black shadow-xl" : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                >
                    Account Overview
                </button>
                <button 
                    onClick={() => setActiveTab("loyalty")}
                    className={`w-full text-left px-6 py-4 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest transition-all group flex items-center justify-between ${
                        activeTab === "loyalty" ? "bg-white text-black shadow-xl" : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                >
                    <span>Loyalty Rewards</span>
                    <Gift size={14} className={activeTab === "loyalty" ? "text-black" : "text-white group-hover:text-black"} />
                </button>
                <button 
                    onClick={() => setActiveTab("security")}
                    className={`w-full text-left px-6 py-4 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
                        activeTab === "security" ? "bg-white text-black shadow-xl" : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                >
                    Security & Access
                </button>
                <button 
                    onClick={() => setActiveTab("orders")}
                    className={`w-full text-left px-6 py-4 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
                        activeTab === "orders" ? "bg-white text-black shadow-xl" : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                >
                    Order History
                </button>
                <button 
                    onClick={() => setActiveTab("wishlist")}
                    className={`w-full text-left px-6 py-4 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
                        activeTab === "wishlist" ? "bg-white text-black shadow-xl" : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                >
                    Wishlist Assets
                </button>
            </div>

            {/* Form Column */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        {activeTab === "overview" ? (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <form onSubmit={handleSubmit} className="bg-black p-8 md:p-16 rounded-none border border-white/10 shadow-2xl space-y-16 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>

                                    {/* Identity Segment */}
                                    <div className="space-y-10 relative z-10">
                                        <h3 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-[0.4em] pb-4 border-b border-white/5 italic">01 Identity Visualization</h3>
                                        
                                        <div className="flex flex-col sm:flex-row items-center gap-10">
                                            <div className="relative group">
                                                <div className="w-32 h-32 rounded-none bg-black border border-white/10 overflow-hidden shadow-2xl group-hover:border-white transition-all">
                                                    {formData.image ? (
                                                        <img src={formData.image} alt="Profile" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-700" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-800">
                                                            <User size={40} />
                                                        </div>
                                                    )}
                                                </div>
                                                <label className="absolute -bottom-2 -right-2 bg-white p-3 rounded-none text-black shadow-xl cursor-pointer hover:bg-gray-200 transition-colors border-4 border-black">
                                                    <Camera size={20} strokeWidth={2} />
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                                </label>
                                            </div>
                                            <div className="text-center sm:text-left">
                                                <h4 className="text-2xl font-black text-white tracking-tight mb-2 uppercase italic">Avatar Protocol.</h4>
                                                <p className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest max-w-[250px] leading-relaxed">Monochrome asset encoding preferred for visual consistency.</p>
                                                {uploading && <p className="text-[10px] font-mono font-bold text-white uppercase tracking-widest mt-4 animate-pulse">Encoding...</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest ml-1">Legal Name</label>
                                                <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white font-mono text-[10px] uppercase" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest ml-1">Access ID</label>
                                                <input value={formData.email} disabled className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-gray-800 font-mono text-[10px] uppercase cursor-not-allowed opacity-30" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Logistics Segment */}
                                    <div className="space-y-10 relative z-10">
                                        <h3 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-[0.4em] pb-4 border-b border-white/5 italic">02 Logistics Routing</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest ml-1">Terminal Contact</label>
                                                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+00 000 000" className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white font-mono text-[10px] uppercase" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest ml-1">Location Coordinates</label>
                                                <input name="address" value={formData.address} onChange={handleChange} placeholder="ADDRESS LINE" className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white font-mono text-[10px] uppercase" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest ml-1">Node City</label>
                                                <input name="city" value={formData.city} onChange={handleChange} placeholder="CITY" className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white font-mono text-[10px] uppercase" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest ml-1">Sovereign State</label>
                                                <input name="country" value={formData.country} onChange={handleChange} placeholder="COUNTRY" className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white font-mono text-[10px] uppercase" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest ml-1">Zip Mapping</label>
                                                <input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="0000" className="w-full bg-black border border-white/10 rounded-none py-5 px-6 text-white placeholder:text-gray-800 outline-none transition-all focus:border-white font-mono text-[10px] uppercase" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-end relative z-10">
                                         <Link href="/" className="px-10 py-5 bg-transparent border border-white/10 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-all">Discard</Link>
                                         <button
                                            type="submit"
                                            disabled={saving || uploading}
                                            className="flex items-center justify-center gap-3 px-12 py-5 bg-white border border-white text-black rounded-none text-[10px] font-mono font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all disabled:opacity-50 group"
                                         >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={16} />
                                                    Syncing...
                                                </>
                                            ) : (
                                                <>
                                                    Commit Changes <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                                </>
                                            )}
                                         </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : activeTab === "loyalty" ? (
                            <motion.div
                                key="loyalty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-10"
                            >
                                {/* Points Card */}
                                <div className="bg-black p-8 md:p-16 rounded-none border border-white/10 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                        <div className="space-y-4 text-center md:text-left">
                                            <h3 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-[0.4em] italic">Loyalty Status Protocol</h3>
                                            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">Yield Balance.</h2>
                                            <p className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest max-w-sm leading-relaxed mt-4">
                                                Redeem loyalty assets at terminal checkout. High-tier multipliers active.
                                            </p>
                                        </div>
                                        <div className="bg-black p-12 rounded-none border border-white/10 shadow-inner flex flex-col items-center justify-center min-w-[280px]">
                                            <Trophy className="text-white opacity-20 w-12 h-12 mb-6" />
                                            <span className="text-8xl font-black text-white tracking-tight leading-none">{profileData?.loyaltyPoints || 0}</span>
                                            <span className="text-[10px] font-mono font-black text-white uppercase tracking-[0.4em] mt-6 border-t border-white/10 pt-4 w-full text-center">Reward Credits</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Active Boosters */}
                                    <div className="bg-black p-10 rounded-none border border-white/10 shadow-xl relative overflow-hidden">
                                        <div className="relative z-10 space-y-8">
                                            <div className="flex items-center gap-3">
                                                <TrendingUp className="text-white w-5 h-5" />
                                                <h4 className="text-[10px] font-mono font-black text-white uppercase tracking-widest">Active Boosters</h4>
                                            </div>
                                            <div className="space-y-6">
                                                {ACTIVE_BOOSTERS.map((booster, idx) => (
                                                    <div key={idx} className="bg-black p-6 rounded-none border border-white/5 hover:border-white transition-all">
                                                        <span className="text-xs font-black text-white italic block mb-2">{booster.multiplier}x Multiplier</span>
                                                        <h5 className="text-white font-bold tracking-tight text-xs uppercase">{booster.message}</h5>
                                                        <span className="text-[8px] font-mono text-gray-600 font-bold uppercase tracking-widest mt-2 block italic">Category: {booster.category}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Referral Section (New) */}
                                    <div className="bg-black p-10 rounded-none border border-white/10 shadow-xl relative overflow-hidden">
                                        <div className="relative z-10 space-y-8">
                                            <div className="flex items-center gap-3">
                                                <Share2 className="text-white w-5 h-5" />
                                                <h4 className="text-[10px] font-mono font-black text-white uppercase tracking-widest">Growth Protocol</h4>
                                            </div>
                                            <div className="bg-black p-8 rounded-none border border-white/5 text-center flex flex-col items-center flex-1">
                                                <h5 className="text-xl font-black text-white tracking-tight mb-4 uppercase italic">Invite Assets.</h5>
                                                <p className="text-[9px] font-mono text-gray-600 font-bold uppercase tracking-widest mb-8 leading-relaxed">Referral yields 500 bonus points per node recruitment.</p>
                                                
                                                <div className="w-full flex items-center bg-white/5 rounded-none p-5 border border-white/10 group hover:border-white transition-all">
                                                   <span className="flex-1 font-mono text-xs text-white font-bold tracking-[0.3em] uppercase">{profileData?.referralCode || "PENDING..."}</span>
                                                   <button 
                                                      type="button"
                                                      onClick={() => {
                                                        navigator.clipboard.writeText(profileData?.referralCode);
                                                        setMessage({ type: 'success', text: 'Copied.' });
                                                        setTimeout(() => setMessage(null), 2000);
                                                      }}
                                                      className="p-2 hover:bg-white text-gray-500 hover:text-black transition-all"
                                                   >
                                                      <Copy size={16} />
                                                   </button>
                                                </div>

                                                <div className="flex gap-4 mt-8 w-full">
                                                    <button 
                                                        onClick={() => {}}
                                                        className="flex-1 bg-white text-black p-4 rounded-none transition-all flex items-center justify-center gap-2 hover:bg-black hover:text-white border border-white"
                                                    >
                                                        <Send size={14} />
                                                        <span className="text-[9px] font-mono font-black uppercase tracking-widest">Broadcast</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rewards Tier */}
                                    <div className="bg-black p-10 rounded-none border border-white/10 shadow-xl relative overflow-hidden">
                                        <div className="relative z-10 space-y-8 flex flex-col h-full">
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck className="text-white w-5 h-5" />
                                                <h4 className="text-[10px] font-mono font-black text-white uppercase tracking-widest">Security Tier</h4>
                                            </div>
                                            <div className="bg-black p-8 rounded-none border border-white/5 text-center flex-1 flex flex-col justify-center">
                                                {(() => {
                                                    const currentTier = getUserTier(profileData?.loyaltyPoints || 0);
                                                    const points = profileData?.loyaltyPoints || 0;
                                                    const progress = currentTier.threshold === Infinity ? 100 : ((points - currentTier.minPoints) / (currentTier.threshold - currentTier.minPoints)) * 100;
                                                    const pointsToNext = currentTier.threshold === Infinity ? 0 : currentTier.threshold - points;
                                                    
                                                    return (
                                                        <>
                                                           <h5 className="text-2xl font-black tracking-tight mb-2 text-white uppercase italic">{currentTier.name} Elite</h5>
                                                           <span className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-[0.3em]">{currentTier.multiplier}x Multiplier Active</span>
                                                           
                                                           {currentTier.threshold !== Infinity && (
                                                               <>
                                                                   <div className="w-full bg-white/5 h-1 rounded-none overflow-hidden mt-8">
                                                                       <div className="bg-white h-full transition-all duration-1000" style={{ width: `${Math.min(100, progress)}%` }}></div>
                                                                   </div>
                                                                   <p className="text-[9px] font-mono text-gray-600 font-bold uppercase tracking-[0.4em] mt-6 italic">{pointsToNext} PTS TO ASCENSION</p>
                                                               </>
                                                           )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hall of Fame / Leaderboard Section (New) */}
                                <div className="bg-[#161b27] p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                                            <div className="space-y-1">
                                                <h3 className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-[0.4em]">Viral Network</h3>
                                                <h2 className="text-3xl font-black text-white tracking-tighter">Hall of Fame<span className="text-purple-600">.</span></h2>
                                            </div>
                                            <Trophy size={32} className="text-yellow-500/50" />
                                        </div>

                                        <div className="space-y-4">
                                            {leaderboard.length > 0 ? (
                                                leaderboard.map((player, idx) => (
                                                    <div key={player.id} className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${
                                                        player.id === profileData?.id 
                                                        ? "bg-purple-500/10 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)]" 
                                                        : "bg-[#0f1117] border-white/5 hover:bg-white/5"
                                                    }`}>
                                                        <div className="flex items-center gap-6">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                                                                idx === 0 ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]" : 
                                                                idx === 1 ? "bg-gray-400 text-black" :
                                                                idx === 2 ? "bg-orange-600 text-white" : "bg-white/5 text-gray-500"
                                                            }`}>
                                                                #{idx + 1}
                                                            </div>
                                                            <div className="space-y-1">
                                                                <h4 className="text-white font-bold tracking-tight flex items-center gap-2">
                                                                    {player.name}
                                                                    {player.id === profileData?.id && (
                                                                        <span className="text-[8px] font-mono bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full uppercase tracking-widest">You</span>
                                                                    )}
                                                                </h4>
                                                                <p className="text-[9px] font-mono text-gray-500 font-bold uppercase tracking-widest leading-none">
                                                                    Platinum Ambassador
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-8">
                                                            <div className="text-right hidden sm:block">
                                                                <span className="text-white font-black text-lg tracking-tighter block leading-none">{player.successfulReferrals}</span>
                                                                <span className="text-[8px] font-mono text-gray-500 font-bold uppercase tracking-widest">Referrals</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-blue-500 font-black text-lg tracking-tighter block leading-none">{player.loyaltyPoints}</span>
                                                                <span className="text-[8px] font-mono text-gray-500 font-bold uppercase tracking-widest">Points</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-20 bg-[#0f1117] rounded-[2.5rem] border border-white/5 border-dashed">
                                                    <span className="text-[10px] font-mono text-gray-700 font-bold uppercase tracking-widest italic">Calculating global rankings...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* History Section */}
                                <div className="bg-black p-8 md:p-16 rounded-none border border-white/10 shadow-2xl relative overflow-hidden">
                                    <h3 className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[0.5em] pb-8 border-b border-white/10 mb-12 flex items-center gap-4 italic">
                                        <History size={18} /> Transaction Ledger
                                    </h3>
                                    <div className="space-y-6">
                                        {profileData?.loyaltyHistory && profileData.loyaltyHistory.length > 0 ? (
                                            profileData.loyaltyHistory.map((entry, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-8 bg-black border border-white/5 hover:border-white/20 transition-all rounded-none">
                                                    <div className="space-y-2">
                                                        <span className="text-[9px] font-mono font-bold text-gray-600 uppercase tracking-[0.3em]">{entry.formattedDate}</span>
                                                        <h5 className="text-white font-bold tracking-tight text-xs uppercase italic">{entry.description}</h5>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xl font-black tracking-tight text-white uppercase italic">
                                                            {entry.type === 'EARNED' ? '+' : '-'}{entry.points}
                                                        </span>
                                                        <span className="text-[8px] font-mono text-gray-700 font-black uppercase tracking-[0.4em] block mt-1">Units</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-24 bg-black border border-white/5 border-dashed">
                                                <History className="mx-auto w-12 h-12 text-gray-800 mb-6 opacity-30" />
                                                <p className="text-[10px] font-mono text-gray-700 font-bold uppercase tracking-widest">Ledger is empty.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-[#161b27] p-20 rounded-[3.5rem] border border-white/5 text-center">
                                <p className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest">Module under development...</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
        </div>
      </div>
    </div>
  );
}