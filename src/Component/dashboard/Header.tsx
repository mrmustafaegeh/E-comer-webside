"use client";

import {
  Menu,
  Bell,
  Search,
  ChevronRight,
  Settings,
  LogOut,
  Command,
  Sun,
  Moon,
  Clock as ClockIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";
import CommandPalette from "./CommandPalette";

interface AdminHeaderProps {

  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export default function AdminHeader({
  onMenuClick,
  sidebarOpen,
}: AdminHeaderProps) {
  const { user, logout } = useAuth() as any;
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const handleSignOut = async () => {
    if (logout) await logout();
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0f1117]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 transition-all w-full">
      <div className="flex items-center justify-between">
        {/* Left: Section Title / Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-white/5 rounded-lg lg:hidden text-gray-400"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:flex items-center gap-2 text-sm font-medium">
            <span className="text-gray-500 font-sora">Dashboard</span>
            <ChevronRight size={14} className="text-gray-600" />
            <span className="text-gray-200 font-sora">Overview</span>
          </div>
        </div>

        {/* Center: Command Palette Search */}
        <div className="flex-1 max-w-md mx-8 hidden lg:block relative group">
          <Search
            className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors pointer-events-none"
            size={16}
          />
          <button
            onClick={() => setCmdPaletteOpen(true)}
            className="w-full pl-10 pr-12 py-2 bg-[#161b27] border border-white/10 rounded-xl hover:bg-[#1a202c] hover:border-blue-500/50 hover:ring-4 hover:ring-blue-500/10 transition-all outline-none text-sm text-gray-500 text-left font-sora shadow-inner"
          >
            Search commands, users...
          </button>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 border border-white/10 bg-[#0f1117] rounded shadow text-[10px] font-mono tracking-widest text-gray-400 pointer-events-none">
             ⌘K
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Live Clock Drop */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#161b27] border border-white/5 rounded-lg mr-2">
            <ClockIcon size={14} className="text-blue-400" />
            <span className="text-xs font-mono text-gray-300 w-[60px] text-right tracking-wider">{time}</span>
          </div>

          {/* Removed Theme Toggle - System is locked to Cyber Dark Mode */}

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg relative transition-all"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)] border border-[#0f1117]"></span>
          </button>

          {/* User Profile */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-3 border border-white/5 bg-[#161b27] hover:border-white/10 rounded-full shadow-sm transition-all"
            >
              <div className="hidden lg:block text-right pr-1">
                <p className="text-[11px] font-semibold text-gray-200 leading-none mb-0.5 font-sora">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[9px] font-mono text-blue-400 tracking-wider uppercase leading-none">
                   {"Developer"}
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold font-mono shadow-[0_0_10px_rgba(99,102,241,0.3)] border border-white/10">
                {user?.name?.[0] || "A"}
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-[#161b27] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 py-2 z-50 overflow-hidden backdrop-blur-xl group/menu">
                <div className="absolute inset-0 bg-blue-600/5 blur-xl pointer-events-none rounded-2xl"></div>
                <div className="px-4 py-3 border-b border-white/5 mb-2 bg-[#0f1117]/80 relative z-10">
                  <p className="text-xs font-sora font-bold text-gray-200">{user?.name || "Admin User"}</p>
                  <p className="text-[10px] font-mono text-blue-400 truncate mt-1">Console Operator</p>
                </div>
                
                <Link href="/admin/settings" className="relative z-10 flex items-center gap-3 px-4 py-2.5 hover:bg-blue-600/10 hover:text-blue-400 text-gray-400 text-[11px] font-mono uppercase tracking-widest font-bold transition-all border-l-2 border-transparent hover:border-blue-500">
                  <Settings size={14} /> System Config
                </Link>
                <div className="border-t border-white/5 mt-2 pt-2 relative z-10 bg-[#0f1117]/30">
                  <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-500/10 text-red-500 hover:text-red-400 text-[11px] font-mono uppercase tracking-widest font-bold transition-all border-l-2 border-transparent hover:border-red-500">
                    <LogOut size={14} /> Terminate Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <CommandPalette isOpen={cmdPaletteOpen} onClose={() => setCmdPaletteOpen(false)} />
    </header>
  );
}
