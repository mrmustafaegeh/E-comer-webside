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
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono text-xs uppercase tracking-widest">
      <p>Error rendering profile</p>
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
