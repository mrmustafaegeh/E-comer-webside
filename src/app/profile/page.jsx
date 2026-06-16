"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { get, put } from "../../services/api";
import { useSearchParams } from "next/navigation";
import { 
  User, Mail, MapPin, Phone, Camera, Save, Loader2, ArrowRight, 
  ShieldCheck, CheckCircle2, History
} from "lucide-react";
import Link from "next/link";
import {
  Container,
  Card,
  Button,
  Input,
  Alert,
  PageHeader,
  FormField,
  FormActions,
} from "../../Component/ui/primitives";

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
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
        if (updateUser) updateUser(payload);
    } catch (err) {
        setMessage({ type: 'error', text: 'Could not save profile. Please try again.' });
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)]">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-[var(--text-muted)]" />
        <p className="text-sm text-[var(--text-muted)]">Loading profile…</p>
      </div>
    );
  }

  const navItems = [
    { id: "overview", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: History, link: "/orders" },
    { id: "wishlist", label: "Wishlist", icon: CheckCircle2, link: "/wishlist" },
    ...(user?.role === "ADMIN" || user?.role === "admin" || user?.isAdmin || (user?.roles && Array.isArray(user.roles) && user.roles.some(r => r.toUpperCase() === "ADMIN"))
      ? [{ id: "admin", label: "Admin", icon: ShieldCheck, link: "/admin/dashboard" }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-subtle)] py-12 md:py-16">
      <Container>
        <PageHeader
          title="Your profile"
          description="Update your details and shipping information."
        />

        <div className="grid gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--bg-subtle)]">
                  {formData.image ? (
                    <img src={formData.image} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User size={32} className="text-[var(--text-muted)]" />
                    </div>
                  )}
                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 text-xs font-medium text-white opacity-0 transition-opacity hover:opacity-100">
                    <Camera size={16} className="mr-1" />
                    Change
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
                <h3 className="font-medium text-[var(--text)]">{formData.name || "Guest"}</h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{formData.email}</p>
              </div>

              <nav className="mt-6 space-y-1 border-t border-[var(--border)] pt-6">
                {navItems.map((nav) =>
                  nav.link ? (
                    <Link
                      key={nav.id}
                      href={nav.link}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--text)]"
                    >
                      <nav.icon size={16} />
                      {nav.label}
                      <ArrowRight size={14} className="ml-auto opacity-40" />
                    </Link>
                  ) : (
                    <button
                      key={nav.id}
                      onClick={() => setActiveTab(nav.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        activeTab === nav.id
                          ? "bg-[var(--accent)] text-white"
                          : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text)]"
                      }`}
                    >
                      <nav.icon size={16} />
                      {nav.label}
                    </button>
                  )
                )}
              </nav>
            </Card>
          </aside>

          <div className="lg:col-span-8">
            <Card className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-[var(--text)]">Personal details</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Keep your contact and delivery information up to date.
              </p>

              {message && (
                <Alert variant={message.type === "success" ? "success" : "error"} className="mt-6">
                  {message.text}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField label="Full name" htmlFor="name">
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
                  </FormField>
                  <FormField label="Email" htmlFor="email" hint="Email cannot be changed here">
                    <Input id="email" name="email" value={formData.email} readOnly disabled />
                  </FormField>
                  <FormField label="Phone" htmlFor="phone">
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 555 000 0000" />
                  </FormField>
                </div>

                <div className="border-t border-[var(--border)] pt-6">
                  <h3 className="mb-5 text-sm font-medium text-[var(--text)]">Shipping address</h3>
                  <div className="space-y-5">
                    <FormField label="Street address" htmlFor="address">
                      <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main Street" />
                    </FormField>
                    <div className="grid gap-5 sm:grid-cols-3">
                      <FormField label="City" htmlFor="city">
                        <Input id="city" name="city" value={formData.city} onChange={handleChange} />
                      </FormField>
                      <FormField label="ZIP / Postal" htmlFor="zipCode">
                        <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} />
                      </FormField>
                      <FormField label="Country" htmlFor="country">
                        <Input id="country" name="country" value={formData.country} onChange={handleChange} />
                      </FormField>
                    </div>
                  </div>
                </div>

                <FormActions>
                  <Button type="button" variant="secondary" onClick={() => router.push("/")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving || uploading} className="gap-2">
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save changes
                      </>
                    )}
                  </Button>
                </FormActions>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--text-muted)]" />
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}
