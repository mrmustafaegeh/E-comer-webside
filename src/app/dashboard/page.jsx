"use client";

import { useEffect, useState } from "react";
import StatGrid from "@/components/dashboard/StatGrid";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";
import QuickActions from "@/components/dashboard/QuickActions";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import api from "@/services/api";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    recentOrders: [],
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [products, orders] = await Promise.all([
        api.get("/products?limit=1"),
        api.get("/orders?limit=5"),
      ]);

      setStats({
        products: products.data.pagination.total,
        orders: orders.data.length,
        users: 0, // your user system
        revenue: orders.data.reduce((a, o) => a + o.totalPrice, 0),
        recentOrders: orders.data,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const statCards = [
    {
      title: "Products",
      value: stats.products,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Orders",
      value: stats.orders,
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "Revenue",
      value: `$${stats.revenue}`,
      icon: DollarSign,
      color: "bg-purple-500",
    },
    { title: "Users", value: stats.users, icon: Users, color: "bg-orange-500" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <StatGrid stats={statCards} />

      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <RecentOrdersTable orders={stats.recentOrders} />
      </div>

      <QuickActions />
    </div>
  );
}
