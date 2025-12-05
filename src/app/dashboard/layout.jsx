"use client";

import Sidebar from "../../components/admin/ui/Sidebar";
import AdminHeader from "../../components/admin/ui/AdminHeader";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { isLoading, isAuthenticated } = useKindeBrowserClient();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/api/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
