"use client";

import StatCard from "./StatCard";
import React from "react";

interface StatData {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: any;
  color: string;
  change: number;
  trendData: number[];
  goalProgress: number;
}

interface StatGridProps {
  stats: StatData[];
}

export default function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} delayIndex={index} />
      ))}
    </div>
  );
}
