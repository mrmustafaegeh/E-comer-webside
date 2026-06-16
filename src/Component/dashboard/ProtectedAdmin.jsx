"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedAdmin({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth/login?redirect=/admin/dashboard");
      return;
    }
    const roles = user.roles?.map((r) => String(r).toUpperCase()) || [];
    const isAdmin = roles.includes("ADMIN") || user.isAdmin;
    if (!isAdmin) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
