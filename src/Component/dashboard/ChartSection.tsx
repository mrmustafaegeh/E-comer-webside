"use client";

import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
} from "recharts";
import { Card } from "@/Component/ui/primitives";

interface ChartData {
  month: string;
  revenue: number;
  target: number;
  orders: number;
}

interface ChartSectionProps {
  data: ChartData[];
}

export default function ChartSection({ data = [] }: ChartSectionProps) {
  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalOrders = data.reduce((acc, curr) => acc + curr.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const formatYAxis = (value: number) => {
    if (value === 0) return "$0";
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 shadow-sm">
        <p className="mb-2 text-xs font-medium text-[var(--text-muted)]">{label}</p>
        <p className="text-sm font-semibold text-[var(--text)]">
          Revenue: ${Number(payload[0]?.value || 0).toLocaleString()}
        </p>
        {payload[1] && (
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Target: ${Number(payload[1]?.value || 0).toLocaleString()}
          </p>
        )}
      </div>
    );
  };

  if (!data.length) {
    return (
      <Card className="flex h-[360px] items-center justify-center p-6 text-sm text-[var(--text-muted)]">
        No revenue data for the selected period.
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col p-6">
      <div className="mb-6">
        <h3 className="font-heading text-base font-semibold text-[var(--text)]">
          Revenue overview
        </h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Last 6 months</p>
      </div>

      <div className="min-h-[260px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#171717" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#171717" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebebeb" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#737373", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#737373", fontSize: 12 }}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#171717"
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#a3a3a3"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[var(--border)] pt-5 sm:grid-cols-3">
        <div>
          <p className="text-xs text-[var(--text-muted)]">Total revenue</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--text)]">
            ${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)]">Orders</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--text)]">
            {totalOrders.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)]">Avg. order value</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--text)]">
            ${avgOrderValue.toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
}
