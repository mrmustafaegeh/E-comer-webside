"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Briefcase,
  Package,
  ShoppingCart,
  TrendingUp,
  Shield,
  Lock,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useKindeBrowserClient();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/api/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Note: Kinde user object structure is different
  // Access user info: user.given_name, user.family_name, user.email, etc.

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {user?.given_name || user?.name || "User"}!
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Here's your personalized dashboard
          </p>
        </div>

        {/* Stats Cards - same as before */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* ... rest of your stats cards */}
        </div>

        {/* User Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
              <User className="w-6 h-6 inline mr-2" />
              Personal Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Mail className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>
              </div>

              {/* Note: Kinde doesn't store phone/age by default */}
              {/* You'll need to manage these in your own database */}
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Phone className="text-purple-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium text-gray-900">
                    {/* Store phone in your own database */}
                    Not set
                  </p>
                </div>
                <a
                  href="/form"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Add
                </a>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Calendar className="text-green-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-medium text-gray-900">
                    {/* Store DOB in your own database */}
                    Not set
                  </p>
                </div>
                <a
                  href="/form"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Add
                </a>
              </div>
            </div>
          </div>
          {/* Account Details */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
              <Lock className="w-6 h-6 inline mr-2" />
              Account Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <User className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Username</p>
                  <p className="font-medium text-gray-900">
                    {user?.given_name || user?.name || "User"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
