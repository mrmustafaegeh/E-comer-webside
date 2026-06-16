"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminHeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/admin-products": "Products",
  "/admin/create-product": "Add product",
  "/admin/order": "Orders",
  "/admin/users": "Customers",
  "/admin/messages": "Messages",
  "/admin/analytics": "Analytics",
  "/admin/media": "Media",
  "/admin/settings": "Settings",
};

function getPageTitle(pathname: string | null) {
  if (!pathname) return "Admin";

  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  if (pathname.startsWith("/admin/admin-products/")) return "Edit product";

  const match = Object.entries(PAGE_TITLES).find(([path]) => pathname.startsWith(path));
  return match?.[1] || "Admin";
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="flex h-14 items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-[var(--border)] p-2 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Admin
          </p>
          <p className="text-sm font-semibold text-[var(--text)]">{pageTitle}</p>
        </div>
      </div>
      <Link
        href="/"
        className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
      >
        View store →
      </Link>
    </div>
  );
}
