"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ShoppingCart, Users, DollarSign, Package } from "lucide-react";
import api from "../../../services/api";
import AdminPageShell from "../../../Component/admin/AdminPageShell";
import { Button } from "@/Component/ui/primitives";

const StatGrid = dynamic(() => import("../../../Component/dashboard/StatGrid"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]"
        />
      ))}
    </div>
  ),
});
const ChartSection = dynamic(() => import("../../../Component/dashboard/ChartSection"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] animate-pulse rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]" />
  ),
});
const SalesByCategory = dynamic(() => import("../../../Component/dashboard/SalesByCategory"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] animate-pulse rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]" />
  ),
});
const RecentOrdersTable = dynamic(
  () => import("../../../Component/dashboard/RecentOrdersTable"),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]" />
    ),
  }
);
const QuickActions = dynamic(() => import("../../../Component/dashboard/QuickActions"), {
  ssr: false,
  loading: () => (
    <div className="h-80 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]" />
  ),
});
const TopProducts = dynamic(() => import("../../../Component/dashboard/TopProducts"), {
  ssr: false,
  loading: () => (
    <div className="h-72 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]" />
  ),
});
const ActivityFeed = dynamic(() => import("../../../Component/dashboard/ActivityFeed"), {
  ssr: false,
  loading: () => (
    <div className="h-72 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]" />
  ),
});

function DashboardSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold text-[var(--text)]">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/admin/stats");
        setData(response.data);
      } catch (e) {
        console.error("Dashboard load error:", e);
        setError("Could not load dashboard data. Please refresh or try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const statCards = useMemo(() => {
    if (!data?.stats) return [];

    const pendingOrders =
      data.recentOrders?.filter((o: { status: string }) => o.status === "pending").length ?? 0;

    return [
      {
        title: "Total revenue",
        value: data.stats.revenue || 0,
        prefix: "$",
        subtitle: "All completed orders",
        icon: DollarSign,
      },
      {
        title: "Total orders",
        value: data.stats.orders || 0,
        subtitle: pendingOrders > 0 ? `${pendingOrders} pending review` : "All time",
        icon: ShoppingCart,
      },
      {
        title: "Customers",
        value: data.stats.customers || 0,
        subtitle: "Registered accounts",
        icon: Users,
      },
      {
        title: "Avg. order value",
        value: data.stats.aov || 0,
        prefix: "$",
        subtitle: "Revenue ÷ orders",
        icon: Package,
      },
    ];
  }, [data]);

  if (loading) {
    return (
      <AdminPageShell
        eyebrow="Overview"
        title="Dashboard"
        description="Loading your store metrics…"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]"
            />
          ))}
        </div>
      </AdminPageShell>
    );
  }

  if (error || !data) {
    return (
      <AdminPageShell eyebrow="Overview" title="Dashboard">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">{error || "No data available."}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      eyebrow="Overview"
      title="Dashboard"
      description="Key metrics, recent orders, and quick links to manage your store."
      actions={
        <Link href="/admin/create-product">
          <Button variant="secondary">Add product</Button>
        </Link>
      }
    >
      <div className="flex flex-col gap-10 pb-6">
        <StatGrid stats={statCards} />

        <DashboardSection
          title="Performance"
          description="Revenue trend and product distribution for the last 6 months."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ChartSection data={data.revenueData} />
            </div>
            <div className="lg:col-span-4">
              <SalesByCategory data={data.categoryData} />
            </div>
          </div>
        </DashboardSection>

        <DashboardSection
          title="Orders & actions"
          description="Latest customer orders and shortcuts to common tasks."
          action={
            <Link href="/admin/order">
              <Button variant="ghost" className="text-sm">
                View all orders
              </Button>
            </Link>
          }
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <RecentOrdersTable orders={data.recentOrders} />
            </div>
            <div className="xl:col-span-5">
              <QuickActions />
            </div>
          </div>
        </DashboardSection>

        <DashboardSection
          title="Products & activity"
          description="Best-selling products and recent store events."
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <TopProducts products={data.topProducts} />
            <ActivityFeed activities={data.activities} />
          </div>
        </DashboardSection>
      </div>
    </AdminPageShell>
  );
}
