"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/Component/ui/primitives";

interface Order {
  id: string;
  user?: {
    email: string;
    name?: string;
  };
  status: string;
  totalPrice: number;
  itemsCount: number;
  createdAt: string;
}

interface RecentOrdersTableProps {
  orders: Order[];
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const styles: Record<string, string> = {
    delivered: "bg-neutral-100 text-neutral-700",
    processing: "bg-blue-50 text-blue-700",
    pending: "bg-amber-50 text-amber-800",
    cancelled: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ${
        styles[normalized] || "bg-neutral-100 text-neutral-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function RecentOrdersTable({ orders = [] }: RecentOrdersTableProps) {
  if (!orders.length) {
    return (
      <Card className="p-8 text-center text-sm text-[var(--text-muted)]">
        No orders yet. Orders will appear here once customers check out.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
              {["Order", "Customer", "Items", "Total", "Status", "Date"].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {orders.map((order) => {
              const customerName = order.user?.name || "Guest";
              const date = new Date(order.createdAt);

              return (
                <tr key={order.id} className="hover:bg-[var(--bg-subtle)]/60">
                  <td className="whitespace-nowrap px-4 py-3">
                    <Link
                      href="/admin/order"
                      className="font-mono text-xs text-[var(--text)] hover:underline"
                    >
                      #{order.id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--text)]">{customerName}</p>
                    <p className="text-xs text-[var(--text-muted)]">{order.user?.email || "—"}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--text-muted)]">
                    {order.itemsCount}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium tabular-nums text-[var(--text)]">
                    ${order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-[var(--text-muted)]">
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
