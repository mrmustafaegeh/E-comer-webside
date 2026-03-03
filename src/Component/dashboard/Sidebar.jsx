"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Image as ImageIcon,
  LogOut,
  Mail,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";

const navItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Products", href: "/admin/admin-products", icon: Package },
  { title: "Orders", href: "/admin/order", icon: ShoppingCart },
  { title: "Customers", href: "/admin/users", icon: Users },
  { title: "Messages", href: "/admin/messages", icon: Mail },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Media Library", href: "/admin/media", icon: ImageIcon },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ onClose, desktopCollapsed, setDesktopCollapsed }) {
  const pathname = usePathname();
  const { logout, user } = useAuth() || {};
  const router = useRouter();

  const handleLogout = async () => {
    if (logout) await logout();
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col h-full bg-[#0f1117] lg:bg-transparent relative text-gray-400 font-sora">
            <div className={`px-4 py-8 flex items-center ${desktopCollapsed ? "justify-center" : "gap-3"} relative`}>
        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] shrink-0">
          <Zap size={16} strokeWidth={3} />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
        {!desktopCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
            <h1 className="text-sm font-bold tracking-tight text-white leading-none truncate">QuickQart</h1>
            <p className="text-[10px] font-mono tracking-widest text-[#3b82f6] uppercase mt-1">1/1</p>
          </motion.div>
        )}

                <button
          onClick={() => setDesktopCollapsed(!desktopCollapsed)}
          className="hidden lg:flex absolute -right-3 top-10 w-6 h-6 items-center justify-center bg-[#1e2333] border border-white/10 rounded-full text-gray-400 hover:text-white hover:border-white/20 transition-all z-50 shadow-lg"
        >
          {desktopCollapsed ? <ChevronRight size={12} strokeWidth={3} /> : <ChevronLeft size={12} strokeWidth={3} />}
        </button>
      </div>

            <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto no-scrollbar pb-6 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={onClose}
              title={desktopCollapsed ? item.title : undefined}
              className={`
                group flex items-center px-3 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden
                ${isActive ? "text-white bg-blue-600/10" : "text-gray-400 hover:text-white hover:bg-white/5"}
                ${desktopCollapsed ? "justify-center" : "justify-start"}
              `}
            >
              {isActive && (
                <motion.div layoutId="sidebar-active" className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
              )}
              
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={`${isActive ? "text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" : "text-gray-500 group-hover:text-gray-300"} shrink-0`} />
              
              {!desktopCollapsed && (
                <span className={`ml-3 text-sm tracking-tight ${isActive ? "font-semibold" : "font-medium"} truncate`}>
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

            <div className={`p-4 border-t border-white/5 bg-[#0f1117]/50 ${desktopCollapsed ? "items-center" : ""}`}>
        <div className={`flex items-center gap-3 mb-4 ${desktopCollapsed ? "justify-center" : "px-2"}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold font-mono ring-2 ring-white/10 shrink-0">
             {user?.name?.[0] || "A"}
          </div>
          {!desktopCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || "Admin User"}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 uppercase border border-blue-500/20">Pro Plan</span>
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={handleLogout}
          title={desktopCollapsed ? "Sign Out" : undefined}
          className={`flex items-center gap-3 w-full p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 ${desktopCollapsed ? "justify-center" : ""}`}
        >
          <LogOut size={16} strokeWidth={2.5} />
          {!desktopCollapsed && <span className="text-xs font-semibold tracking-tight">Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
