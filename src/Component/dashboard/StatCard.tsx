"use client";

import { Card } from "@/Component/ui/primitives";

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export default function StatCard({
  title,
  value,
  prefix = "",
  suffix = "",
  subtitle,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--text)]">
            {prefix}
            {value.toLocaleString(undefined, {
              maximumFractionDigits: title.toLowerCase().includes("avg") ? 2 : 0,
            })}
            {suffix}
          </p>
          {subtitle && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)]">
          <Icon size={18} className="text-[var(--text)]" />
        </div>
      </div>
    </Card>
  );
}
