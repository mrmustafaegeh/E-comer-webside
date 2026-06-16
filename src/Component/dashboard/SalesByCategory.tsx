"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/Component/ui/primitives";

interface CategoryData {
  name: string;
  value: number;
}

interface SalesByCategoryProps {
  data: CategoryData[];
}

const COLORS = ["#171717", "#525252", "#737373", "#a3a3a3", "#d4d4d4", "#e5e5e5"];

export default function SalesByCategory({ data = [] }: SalesByCategoryProps) {
  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 shadow-sm">
        <p className="text-sm font-medium text-[var(--text)]">{item.name}</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {item.value} products ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
        </p>
      </div>
    );
  };

  if (!data.length) {
    return (
      <Card className="flex h-[360px] items-center justify-center p-6 text-sm text-[var(--text-muted)]">
        No category data yet.
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col p-6">
      <div className="mb-4">
        <h3 className="font-heading text-base font-semibold text-[var(--text)]">
          Products by category
        </h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Share of catalog</p>
      </div>

      <div className="relative min-h-[220px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="82%"
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-[var(--text-muted)]">Total products</span>
          <span className="text-xl font-semibold tabular-nums text-[var(--text)]">{total}</span>
        </div>
      </div>

      <div className="mt-4 grid max-h-32 grid-cols-2 gap-3 overflow-y-auto">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="min-w-0">
              <p className="truncate text-xs text-[var(--text)]">{item.name}</p>
              <p className="text-[11px] text-[var(--text-muted)]">
                {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
