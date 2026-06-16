"use client";

import { useEffect, useState } from "react";
import OrderTable from "../../../Component/dashboard/OrderTable";
import AdminPageShell from "../../../Component/admin/AdminPageShell";
import { AppPanel } from "../../../Component/ui/primitives";
import { Loader2 } from "lucide-react";

export default function DashboardOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/admin-orders");
        const data = await res.json();
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <AdminPageShell
      eyebrow="Sales"
      title="Orders"
      description="View and manage customer orders."
    >
      {loading ? (
        <AppPanel className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--text-muted)]" />
        </AppPanel>
      ) : (
        <AppPanel className="overflow-hidden p-0">
          <OrderTable orders={orders} />
        </AppPanel>
      )}
    </AdminPageShell>
  );
}
