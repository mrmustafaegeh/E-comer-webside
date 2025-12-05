"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoading } = useKindeBrowserClient();

  const nav = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Products",
      href: "/dashboard/products",
      icon: <Package size={18} />,
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: <Users size={18} />,
      adminOnly: true,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings size={18} />,
    },
  ];

  const isAdmin = user?.roles?.includes("admin");

  return (
    <aside className="w-64 bg-white shadow-lg border-r flex flex-col">
      <div className="p-5 font-bold text-xl border-b">Admin Panel</div>

      {/* User info section */}
      {!isLoading && user && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            {user.picture && (
              <img
                src={user.picture}
                alt={user.given_name}
                className="w-10 h-10 rounded-full"
                referrerPolicy="no-referrer"
              />
            )}
            <div>
              <p className="font-medium">{user.given_name || user.name}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
              {isAdmin && (
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1">
        {nav.map((item) => {
          // Hide admin-only routes if not admin
          if (item.adminOnly && !isAdmin) return null;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${
                  active ? "bg-blue-600 text-white shadow" : "hover:bg-gray-100"
                }
              `}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout section */}
      <div className="p-4 border-t">
        <LogoutLink className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition w-full">
          <LogOut size={18} />
          Log out
        </LogoutLink>
      </div>
    </aside>
  );
}
