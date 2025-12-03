"use client";

import SideBar from "../../components/dashboard/SideBar";
import Header from "../../components/dashboard/Header";
import useRequireAuth from "../../hooks/useRequireAuth";

export default function DashboardLayout({ children }) {
  // redirect if not logged in
  useRequireAuth();

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SideBar />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
