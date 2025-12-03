"use client";

import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Users, Package } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <nav className="flex flex-col space-y-4">
        <Link href="/dashboard" className="flex items-center gap-3 text-lg">
          <LayoutDashboard size={20} /> Overview
        </Link>

        <Link
          href="/dashboard/products"
          className="flex items-center gap-3 text-lg"
        >
          <Package size={20} /> Products
        </Link>

        <Link
          href="/dashboard/orders"
          className="flex items-center gap-3 text-lg"
        >
          <ShoppingCart size={20} /> Orders
        </Link>

        <Link
          href="/dashboard/users"
          className="flex items-center gap-3 text-lg"
        >
          <Users size={20} /> Users
        </Link>
      </nav>
    </aside>
  );
}
