"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Image as ImageIcon,
  LogOut,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Products", href: "/admin/admin-products", icon: Package },
  { title: "Orders", href: "/admin/order", icon: ShoppingCart },
  { title: "Customers", href: "/admin/users", icon: Users },
  { title: "Messages", href: "/admin/messages", icon: Mail },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Media", href: "/admin/media", icon: ImageIcon },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({
  onClose,
  desktopCollapsed,
  setDesktopCollapsed,
}) {
  const pathname = usePathname();
  const { logout, user } = useAuth() || {};
  const router = useRouter();

  const handleLogout = async () => {
    if (logout) await logout();
    router.push("/auth/login");
  };

  return (
    <div className="relative flex h-full flex-col bg-[var(--bg)] text-[var(--text-muted)]">
      <div
        className={`relative flex items-center px-4 py-6 ${
          desktopCollapsed ? "justify-center" : "gap-3"
        }`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-semibold text-white">
          Q
        </div>
        {!desktopCollapsed && (
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold text-[var(--text)]">
              QuickQart
            </h1>
            <p className="text-xs">Admin</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setDesktopCollapsed(!desktopCollapsed)}
          className="absolute -right-3 top-8 hidden h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text)] lg:flex"
          aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {desktopCollapsed ? (
            <ChevronRight size={12} />
          ) : (
            <ChevronLeft size={12} />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" &&
              pathname?.startsWith(item.href));

          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={onClose}
              title={desktopCollapsed ? item.title : undefined}
              className={`flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-[var(--accent)] font-medium text-white"
                  : "hover:bg-[var(--bg-subtle)] hover:text-[var(--text)]"
              } ${desktopCollapsed ? "justify-center" : "gap-3"}`}
            >
              <Icon size={18} className="shrink-0" />
              {!desktopCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div
        className={`border-t border-[var(--border)] p-4 ${
          desktopCollapsed ? "text-center" : ""
        }`}
      >
        {!desktopCollapsed && (
          <p className="mb-3 truncate text-xs font-medium text-[var(--text)]">
            {user?.name || user?.email || "Admin"}
          </p>
        )}
        <button
          type="button"
          onClick={handleLogout}
          title={desktopCollapsed ? "Sign out" : undefined}
          className={`flex w-full items-center rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-red-50 hover:text-red-700 ${
            desktopCollapsed ? "justify-center" : "gap-2"
          }`}
        >
          <LogOut size={16} />
          {!desktopCollapsed && "Sign out"}
        </button>
      </div>
    </div>
  );
}
