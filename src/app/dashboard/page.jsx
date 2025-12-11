"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import api from "../../services/api";

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get("/products?limit=1"),
        api.get("/orders?limit=5"),
      ]);

      setStats({
        totalProducts: productsRes.data.pagination.total,
        totalOrders: ordersRes.data.length || 0,
        totalUsers: 0, // You can add users API
        totalRevenue: ordersRes.data.reduce(
          (sum, order) => sum + order.totalPrice,
          0
        ),
        recentOrders: ordersRes.data,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
      change: "+12%",
      isPositive: true,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-green-500",
      change: "+23%",
      isPositive: true,
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-purple-500",
      change: "+18%",
      isPositive: true,
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-orange-500",
      change: "+8%",
      isPositive: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name}! Here's what's happening with your store
            today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </h3>
                  <div className="flex items-center mt-2">
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm ml-1 ${
                        stat.isPositive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.user?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "shipped"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link
            href="/admin/products/create"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <Package className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Add Product</h3>
            <p className="text-sm text-gray-600 mt-2">
              Create a new product listing
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <ShoppingCart className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              Manage Orders
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              View and process orders
            </p>
          </Link>

          <Link
            href="/admin/products"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              View Analytics
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Check your store performance
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
