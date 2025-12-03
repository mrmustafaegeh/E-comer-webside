"use client";

import StatCard from "../../components/dashboard/StatCard";
import { ShoppingCart, Users, Package } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Products"
        value="120"
        icon={<Package size={32} />}
      />

      <StatCard
        title="Orders Today"
        value="34"
        icon={<ShoppingCart size={32} />}
      />

      <StatCard title="Users" value="2,349" icon={<Users size={32} />} />
    </div>
  );
}
