"use client";

import Sidebar from "@/components/admin/Sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";

export default function AdminLayout({ children }) {
  // Redirect user if not authenticated or not admin
  const { checking } = useRequireAuth("admin");

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
