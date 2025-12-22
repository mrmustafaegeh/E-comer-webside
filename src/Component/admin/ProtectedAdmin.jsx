// src/components/admin/ProtectedAdmin.jsx
"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

/**
 * Simple client-side admin guard:
 * - Expects auth slice with user object and user.role === 'admin'
 * - If user is not admin, redirects to / or /auth/login
 * IMPORTANT: enforce role on server routes too!
 */

export default function ProtectedAdmin({ children }) {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    if (user && user.role !== "admin") {
      router.push("/");
      return;
    }
  }, [isLoggedIn, user, router]);

  // optionally show loading skeleton until auth resolved
  if (!isLoggedIn || !user) {
    return <div className="p-6">Checking permissions...</div>;
  }

  return <>{children}</>;
}
