"use client";
import useRequireAuth from "@/hooks/useRequireAuth";

export default function Dashboard() {
  useRequireAuth();

  return <div className="p-10 text-2xl">Welcome to the Dashboard</div>;
}
