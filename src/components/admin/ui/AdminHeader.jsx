"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function AdminHeader() {
  const { user, isLoading } = useKindeBrowserClient();

  // Check if user has admin role
  const isAdmin =
    user?.roles?.includes("admin") ||
    user?.permissions?.some((p) => p.includes("admin"));

  if (isLoading) {
    return (
      <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>

      <div className="flex items-center gap-4">
        {/* Show admin badge if user is admin */}
        {isAdmin && (
          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
            Admin
          </span>
        )}

        {/* User info */}
        <div className="flex items-center gap-3">
          {user?.picture && (
            <img
              src={user.picture}
              alt={user.given_name}
              className="w-8 h-8 rounded-full"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="text-sm">
            <span className="font-medium text-gray-700 block">
              {user?.given_name || user?.name || "User"}
            </span>
            <span className="text-gray-500 text-xs">{user?.email}</span>
          </div>
        </div>

        {/* Logout button */}
        <LogoutLink className="px-4 py-2 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
          Log out
        </LogoutLink>
      </div>
    </header>
  );
}
