"use client";

import StatCard from "./StatCard";
import React from "react";

interface StatData {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface StatGridProps {
  stats: StatData[];
}

export default function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          prefix={stat.prefix}
          suffix={stat.suffix}
          subtitle={stat.subtitle}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
