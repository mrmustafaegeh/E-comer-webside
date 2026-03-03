"use client";

import { useState, useEffect, Suspense } from "react";
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

function ProfilePageContent() {
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
    <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-16">
          <span className="text-[10px] font-mono tracking-[0.5em] text-gray-500 uppercase mb-4 block italic">
            // USER TERMINAL_
          </span>
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter uppercase italic border-l-4 border-white pl-8">
            Profile Settings.
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-black border border-white/10 shadow-2xl p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-32 h-32 rounded-none bg-black border border-white/20 mb-6 flex items-center justify-center overflow-hidden transform-gpu group-hover:border-white transition-colors duration-500 shadow-2xl">
                  {formData.image ? (
                    <img src={formData.image} alt="Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  ) : (
                    <User size={48} className="text-white/20" />
                  )}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer font-mono text-[9px] uppercase tracking-widest text-white border border-white/30 px-3 py-1 hover:bg-white hover:text-black transition-colors">
                      <Camera size={14} className="mb-1 mx-auto" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>
                
                <h3 className="font-heading font-black text-2xl uppercase italic">{formData.name || 'Anonymous User'}</h3>
                <p className="font-mono text-[10px] text-gray-500 tracking-[0.3em] uppercase mt-2">// {formData.email}</p>
                
                <div className="mt-6 flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5">
                   <ShieldCheck size={14} className="text-white" />
                   <span className="font-mono text-[9px] uppercase tracking-widest text-white italic">
                      {user?.role === 'ADMIN' ? 'ROOT ACCESSS' : 'PRIORITY NODE'}
                   </span>
                </div>
              </div>

              <nav className="space-y-4 pt-8 border-t border-white/10">
                {[
                  { id: "overview", label: "General Config", icon: User },
                  { id: "orders", label: "Transaction History", icon: History, link: "/orders" },
                  { id: "wishlist", label: "Saved Assets", icon: CheckCircle2, link: "/wishlist" },
                  ...(user?.role === "ADMIN" || user?.role === "admin" || user?.isAdmin || (user?.roles && Array.isArray(user.roles) && user.roles.some(r => r.toUpperCase() === "ADMIN"))
                    ? [{ id: "admin", label: "Admin Terminal", icon: ShieldCheck, link: "/admin/dashboard" }] 
                    : [])
                ].map(nav => (
                  nav.link ? (
                    <Link key={nav.id} href={nav.link} className={`flex items-center justify-between p-4 border transition-colors group ${nav.id === 'admin' ? 'border-red-500/30 hover:border-red-500 bg-red-900/10' : 'border-white/5 hover:border-white'}`}>
                       <div className={`flex items-center gap-4 transition-colors ${nav.id === 'admin' ? 'text-red-400 group-hover:text-red-300' : 'text-gray-400 group-hover:text-white'}`}>
                          <nav.icon size={16} />
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{nav.label}</span>
                       </div>
                       <ArrowRight size={14} className={`${nav.id === 'admin' ? 'text-red-500 group-hover:text-red-400' : 'text-gray-600 group-hover:text-white'} group-hover:translate-x-1 transition-all`} />
                    </Link>
                  ) : (
                    <button 
                      key={nav.id} 
                      onClick={() => setActiveTab(nav.id)}
                      className={`w-full flex items-center justify-between p-4 border transition-colors group ${activeTab === nav.id ? 'bg-white text-black border-white' : 'border-white/5 hover:border-white text-gray-400 hover:text-white'}`}
                    >
                       <div className="flex items-center gap-4">
                          <nav.icon size={16} />
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{nav.label}</span>
                       </div>
                       {activeTab === nav.id && <ArrowRight size={14} />}
                    </button>
                  )
                ))}
              </nav>
            </div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-8">
            <div className="bg-black border border-white/10 shadow-2xl p-8 lg:p-12 h-full">
              
              <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                   <h2 className="font-heading font-black text-3xl uppercase italic mb-2">General Configurations</h2>
                   <p className="font-mono text-[10px] text-gray-500 tracking-[0.2em] uppercase">// Manage your root terminal identity</p>
                </div>
              </div>

              {message && (
                <div className={`mb-8 p-4 border font-mono text-[10px] uppercase tracking-widest flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                  {message.type === 'success' ? <CheckCircle2 size={16} /> : <Loader2 size={16} />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-600 italic">User Identification</label>
                    <div className="relative group">
                       <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-colors" />
                       <input 
                         name="name" 
                         value={formData.name} 
                         onChange={handleChange} 
                         className="w-full bg-transparent border border-white/10 focus:border-white outline-none py-4 pl-12 pr-4 font-mono text-xs uppercase tracking-widest text-white transition-colors placeholder:text-gray-800" 
                         placeholder="INPUT NAME..." 
                       />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-600 italic">Comms Protocol</label>
                    <div className="relative group">
                       <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                       <input 
                         name="email" 
                         value={formData.email} 
                         readOnly
                         className="w-full bg-white/5 border border-white/10 opacity-70 outline-none py-4 pl-12 pr-4 font-mono text-xs uppercase tracking-widest text-gray-400 cursor-not-allowed" 
                       />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-600 italic">Contact Vector</label>
                    <div className="relative group">
                       <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-colors" />
                       <input 
                         name="phone" 
                         value={formData.phone} 
                         onChange={handleChange} 
                         className="w-full bg-transparent border border-white/10 focus:border-white outline-none py-4 pl-12 pr-4 font-mono text-xs tracking-widest text-white transition-colors placeholder:text-gray-800"
                         placeholder="INPUT PHONE..." 
                       />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 space-y-8">
                  <div className="space-y-3">
                    <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-500 italic flex items-center gap-2">
                      <MapPin size={12} /> Delivery Coordinates
                    </label>
                    
                    <div className="relative group">
                       <input 
                         name="address" 
                         value={formData.address} 
                         onChange={handleChange} 
                         className="w-full bg-transparent border border-white/10 focus:border-white outline-none p-4 font-mono text-xs uppercase tracking-widest text-white transition-colors placeholder:text-gray-800"
                         placeholder="STREET SECTOR..." 
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <input 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange} 
                      className="bg-transparent border border-white/10 focus:border-white outline-none p-4 font-mono text-xs uppercase tracking-widest text-white w-full placeholder:text-gray-800"
                      placeholder="CITY" 
                    />
                    <input 
                      name="zipCode" 
                      value={formData.zipCode} 
                      onChange={handleChange} 
                      className="bg-transparent border border-white/10 focus:border-white outline-none p-4 font-mono text-xs uppercase tracking-widest text-white w-full placeholder:text-gray-800"
                      placeholder="ZIP/POSTAL" 
                    />
                    <input 
                      name="country" 
                      value={formData.country} 
                      onChange={handleChange} 
                      className="bg-transparent border border-white/10 focus:border-white outline-none p-4 font-mono text-xs uppercase tracking-widest text-white w-full md:col-span-1 col-span-2 placeholder:text-gray-800"
                      placeholder="NATION CODE" 
                    />
                  </div>
                </div>

                <div className="pt-10 flex border-t border-white/10 gap-6 justify-end">
                  <button type="button" onClick={() => router.push('/')} className="px-8 py-5 border border-white/10 text-gray-500 font-mono text-[10px] uppercase tracking-widest hover:text-white hover:border-white/30 transition-colors">
                    Cancel Process
                  </button>
                  <button type="submit" disabled={saving || uploading} className="px-8 py-5 bg-white text-black font-mono text-[10px] font-black uppercase tracking-[0.3em] italic hover:bg-black hover:text-white border border-white transition-all disabled:opacity-50 flex items-center gap-3 active:scale-95">
                    {saving ? (
                      <><Loader2 size={16} className="animate-spin" /> SYNCHRONIZING...</>
                    ) : (
                      <><Save size={16} /> COMMIT CHANGES</>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono text-xs uppercase tracking-widest">Loading...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}
