// src/app/admin/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import StatGrid from "../../../Component/dashboard/StatGrid";
import RecentOrdersTable from "../../../Component/dashboard/RecentOrdersTable";
import QuickActions from "../../../Component/dashboard/QuickActions";
import ChartSection from "../../../Component/dashboard/ChartSection";
import ActivityFeed from "../../../Component/dashboard/ActivityFeed";
import TopProducts from "../../../Component/dashboard/TopProducts";
import LoadingSpinner from "../../../Component/ui/LoadingSpinner";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  RefreshCw,
  BarChart3,
  Clock,
} from "lucide-react";
import api from "../../../services/api";

interface DashboardStats {
  products: number;
  orders: number;
  users: number;
  revenue: number;
  orderGrowth: number;
  revenueGrowth: number;
  recentOrders: any[];
  topProducts: any[];
  monthlyData: any[];
  activities: any[];
  orderStats: {
    pending: number;
    processing: number;
    delivered: number;
    cancelled: number;
  };
}

interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    orderGrowth: 0,
    revenueGrowth: 0,
    recentOrders: [],
    topProducts: [],
    monthlyData: [],
    activities: [],
    orderStats: {
      pending: 0,
      processing: 0,
      delivered: 0,
      cancelled: 0,
    },
  });

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [productsRes, ordersRes, usersRes] = await Promise.allSettled([
        api.get("/admin/admin-products?limit=100"),
        api.get("/admin/admin-orders?limit=10&sort=-createdAt"),
        api.get("/admin/admin-users?limit=1"),
      ]);

      const productsPayload =
        productsRes.status === "fulfilled" ? productsRes.value.data : null;
      const ordersPayload =
        ordersRes.status === "fulfilled" ? ordersRes.value.data : null;
      const usersPayload =
        usersRes.status === "fulfilled" ? usersRes.value.data : null;

      const products: any[] = productsPayload?.products ?? [];
      const orders: any[] = ordersPayload?.orders ?? [];
      const users: any[] = usersPayload?.users ?? [];

      const productsTotal =
        typeof productsPayload?.total === "number"
          ? productsPayload.total
          : products.length;

      const ordersTotal =
        typeof ordersPayload?.total === "number"
          ? ordersPayload.total
          : orders.length;

      const usersTotal =
        typeof usersPayload?.total === "number"
          ? usersPayload.total
          : users.length;

      const recentOrders = Array.isArray(orders) ? orders.slice(0, 5) : [];

      const totalRevenue = Array.isArray(orders)
        ? orders.reduce(
            (sum: number, order: any) => sum + (Number(order.totalPrice) || 0),
            0
          )
        : 0;

      const mockTopProducts = (
        Array.isArray(products) ? products.slice(0, 5) : []
      ).map((p: any) => ({
        id: p.id || p._id || `prod-${Math.random()}`,
        name: p.name || p.title || "Unnamed Product",
        sales: Math.floor(Math.random() * 100) + 50,
        revenue: (Number(p.price) || 0) * 100,
        stock: p.stock || 0,
        image: p.image || p.thumbnail || "",
      }));

      const mockActivities = recentOrders.map((order: any) => ({
        id: order.id || order._id || `act-${Math.random()}`,
        type: "order",
        user: order.user?.email || order.customerEmail || "Customer",
        action: "placed an order",
        amount: `$${Number(order.totalPrice || 0)}`,
        time: order.createdAt || new Date().toISOString(),
      }));

      // FIXED: Ensure months array always has valid values
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const currentMonth = new Date().getMonth();
      const mockMonthlyData: MonthlyData[] = Array.from(
        { length: 6 },
        (_, i) => {
          const monthIndex = (currentMonth - 5 + i + 12) % 12;
          // FIX: Use type assertion or ensure month is always a string
          return {
            month: months[monthIndex] as string, // Type assertion ensures string type
            revenue: Math.floor(Math.random() * 10000) + 5000,
            orders: Math.floor(Math.random() * 100) + 50,
          };
        }
      );

      const orderStats = {
        pending: Array.isArray(orders)
          ? orders.filter((o: any) => o.status === "pending").length
          : 0,
        processing: Array.isArray(orders)
          ? orders.filter((o: any) => o.status === "processing").length
          : 0,
        delivered: Array.isArray(orders)
          ? orders.filter((o: any) => o.status === "delivered").length
          : 0,
        cancelled: Array.isArray(orders)
          ? orders.filter((o: any) => o.status === "cancelled").length
          : 0,
      };

      setStats({
        products: productsTotal,
        orders: ordersTotal,
        users: usersTotal,
        revenue: totalRevenue,
        orderGrowth: 12.5,
        revenueGrowth: 18.3,
        recentOrders,
        topProducts: mockTopProducts,
        monthlyData: mockMonthlyData,
        activities: mockActivities,
        orderStats,
      });

      if (productsRes.status === "rejected") {
        console.error("Products request failed:", productsRes.reason);
      }
      if (ordersRes.status === "rejected") {
        console.error("Orders request failed:", ordersRes.reason);
      }
      if (usersRes.status === "rejected") {
        console.error("Users request failed:", usersRes.reason);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.products.toLocaleString(),
      icon: Package,
      color: "bg-blue-500",
      change: "+12%",
      positive: true,
      trend: "from last month",
    },
    {
      title: "Total Orders",
      value: stats.orders.toLocaleString(),
      icon: ShoppingCart,
      color: "bg-green-500",
      change: `${stats.orderGrowth}%`,
      positive: stats.orderGrowth > 0,
      trend: "from last month",
    },
    {
      title: "Total Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-purple-500",
      change: `${stats.revenueGrowth}%`,
      positive: stats.revenueGrowth > 0,
      trend: "from last month",
    },
    {
      title: "Total Users",
      value: stats.users.toLocaleString(),
      icon: Users,
      color: "bg-orange-500",
      change: "+8%",
      positive: true,
      trend: "from last month",
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here&apos;s what&apos;s happening with your store
            today.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
            <Clock size={18} />
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <StatGrid stats={statCards} />

      {/* Charts & Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <ChartSection data={stats.monthlyData} />

          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Latest customer orders
                </p>
              </div>
              <a
                href="/admin/orders"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View all orders →
              </a>
            </div>
            <RecentOrdersTable orders={stats.recentOrders} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions />

          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Top Products
                </h2>
                <p className="text-gray-600 text-sm mt-1">Best selling items</p>
              </div>
              <BarChart3 size={20} className="text-gray-400" />
            </div>
            <TopProducts products={stats.topProducts} />
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Activity
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Latest store activities
                </p>
              </div>
              <Clock size={20} className="text-gray-400" />
            </div>
            <ActivityFeed activities={stats.activities} />
          </div>
        </div>
      </div>
    </div>
  );
}
