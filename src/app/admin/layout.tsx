// src/app/admin/layout.jsx
"use client";

import { useState, useEffect, memo } from "react";
import AdminSidebar from "../../Component/dashboard/Sidebar";
import AdminHeader from "../../Component/dashboard/Header";
import AdminAIPilot from "../../Component/dashboard/AdminAIPilot";
import { usePathname } from "next/navigation";
import { Sora, JetBrains_Mono } from "next/font/google";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const jbMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jb-mono" });

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className={`${sora.variable} ${jbMono.variable} font-sora flex h-screen bg-[#0f1117] text-gray-100 overflow-hidden selection:bg-blue-500/30`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0f1117]/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 
          bg-[#161b27] border-r border-white/5
          transform transition-all duration-300 ease-in-out 
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full"}
          ${desktopCollapsed ? "lg:w-[72px]" : "lg:w-64"}
        `}
        aria-label="Sidebar navigation"
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} desktopCollapsed={desktopCollapsed} setDesktopCollapsed={setDesktopCollapsed} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle noise/grid overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0"></div>

        {/* Header */}
        <header className="flex-shrink-0 sticky top-0 z-30 layout-header">
          <AdminHeader
            onMenuClick={() => setSidebarOpen(true)}
            sidebarOpen={sidebarOpen}
          />
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10" id="admin-main-content">
          {children}
        </main>

        <AdminAIPilot />
      </div>
    </div>
  );
}

export default memo(AdminLayout);