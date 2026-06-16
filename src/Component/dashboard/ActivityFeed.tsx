"use client";

import React from "react";
import { ShoppingCart, UserPlus, AlertCircle } from "lucide-react";
import { Card } from "@/Component/ui/primitives";

export interface Activity {
  id: string;
  type: "order" | "warning" | "user" | "refund" | "success" | "system";
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

function ActivityIcon({ type }: { type: Activity["type"] }) {
  switch (type) {
    case "order":
      return <ShoppingCart size={14} className="text-[var(--text)]" />;
    case "user":
      return <UserPlus size={14} className="text-[var(--text)]" />;
    default:
      return <AlertCircle size={14} className="text-[var(--text-muted)]" />;
  }
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "—";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffHours < 48) return "Yesterday";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ActivityFeed({ activities = [] }: ActivityFeedProps) {
  if (!activities.length) {
    return (
      <Card className="p-8 text-center text-sm text-[var(--text-muted)]">
        No recent activity. New orders and sign-ups will show up here.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[var(--border)] px-6 py-4">
        <h3 className="font-heading text-base font-semibold text-[var(--text)]">
          Recent activity
        </h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Latest orders and account events</p>
      </div>

      <ul className="divide-y divide-[var(--border)]">
        {activities.map((activity) => (
          <li key={activity.id} className="flex gap-3 px-6 py-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)]">
              <ActivityIcon type={activity.type} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-relaxed text-[var(--text)]">{activity.description}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {formatTime(activity.timestamp)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
