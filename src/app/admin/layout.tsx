"use client";

import { useState, useEffect, memo } from "react";
import AdminSidebar from "../../Component/dashboard/Sidebar";
import AdminHeader from "../../Component/dashboard/Header";
import { usePathname } from "next/navigation";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-subtle)] text-[var(--text)]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex transform flex-col border-r border-[var(--border)] bg-[var(--bg)] transition-all duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full"
        } ${desktopCollapsed ? "lg:w-[72px]" : "lg:w-64"}`}
        aria-label="Admin navigation"
      >
        <AdminSidebar
          onClose={() => setSidebarOpen(false)}
          desktopCollapsed={desktopCollapsed}
          setDesktopCollapsed={setDesktopCollapsed}
        />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 shrink-0 border-b border-[var(--border)] bg-[var(--bg)]">
          <AdminHeader
            onMenuClick={() => setSidebarOpen(true)}
            sidebarOpen={sidebarOpen}
          />
        </header>

        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
          id="admin-main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default memo(AdminLayout);
