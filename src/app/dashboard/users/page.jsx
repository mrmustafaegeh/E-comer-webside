"use client";

import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect } from "react";

export default function UsersPage() {
  const { isLoading, isAuthenticated, user } = useKindeBrowserClient();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/api/auth/login");
      } else if (!user?.roles?.includes("admin")) {
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!isAuthenticated || !user?.roles?.includes("admin")) {
    return null; // Will redirect
  }

  return <div className="text-2xl">Manage Users Here</div>;
}
