"use client";

import Link from "next/link";
import {
  Plus,
  ShoppingCart,
  Users,
  BarChart3,
  Package,
  Settings,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/Component/ui/primitives";

const actions = [
  {
    title: "Add product",
    description: "Create a new listing",
    icon: Plus,
    href: "/admin/create-product",
  },
  {
    title: "Manage orders",
    description: "Review and update status",
    icon: ShoppingCart,
    href: "/admin/order",
  },
  {
    title: "View customers",
    description: "Browse registered users",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Analytics",
    description: "Sales and traffic reports",
    icon: BarChart3,
    href: "/admin/analytics",
  },
  {
    title: "Products",
    description: "Edit inventory and pricing",
    icon: Package,
    href: "/admin/admin-products",
  },
  {
    title: "Settings",
    description: "Store configuration",
    icon: Settings,
    href: "/admin/settings",
  },
];

export default function QuickActions() {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <h3 className="font-heading text-base font-semibold text-[var(--text)]">Quick actions</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Common admin tasks</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] p-4 transition-colors hover:border-neutral-300 hover:bg-[var(--bg)]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                <Icon size={16} className="text-[var(--text)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--text)]">{action.title}</p>
                <p className="text-xs text-[var(--text-muted)]">{action.description}</p>
              </div>
              <ArrowRight
                size={14}
                className="mt-1 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
