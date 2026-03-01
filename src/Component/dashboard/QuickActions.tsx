"use client";

import Link from "next/link";
import {
  Plus,
  ArrowUpRight,
  ShoppingCart,
  Users,
  BarChart3,
  PackageSearch,
  Download,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  href: string;
  shortcut: string;
  colorClass: string;
}

export default function QuickActions() {
  const actions: QuickAction[] = [
    {
      title: "New Product",
      description: "Asset creation",
      icon: Plus,
      href: "/admin/create-product",
      shortcut: "⌘N",
      colorClass: "text-blue-400 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
    },
    {
      title: "View Orders",
      description: "Revenue matrix",
      icon: ShoppingCart,
      href: "/admin/orders",
      shortcut: "⌘O",
      colorClass: "text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    },
    {
      title: "Customer List",
      description: "User database",
      icon: Users,
      href: "/admin/users",
      shortcut: "⌘U",
      colorClass: "text-purple-400 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
    },
    {
      title: "Run Report",
      description: "Analytics core",
      icon: BarChart3,
      href: "/admin/analytics",
      shortcut: "⌘R",
      colorClass: "text-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
    },
    {
      title: "Inventory",
      description: "Asset control",
      icon: PackageSearch,
      href: "/admin/media",
      shortcut: "⌘I",
      colorClass: "text-indigo-400 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]",
    },
    {
      title: "Export Data",
      description: "CSV Output",
      icon: Download,
      href: "/admin/settings",
      shortcut: "⌘E",
      colorClass: "text-pink-400 bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.2)]",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.4 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[#161b27] rounded-[2rem] border border-white/5 p-6 lg:p-8 h-full flex flex-col hover:border-white/10 transition-colors group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-gray-500/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="mb-6 relative z-10">
        <h2 className="text-lg font-sora font-semibold text-white tracking-tight leading-none mb-1">Quick Actions</h2>
        <p className="text-[10px] uppercase font-mono tracking-widest text-gray-500">System Commands</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 relative z-10 flex-1 content-start"
      >
        {actions.map((action, index) => (
          <motion.div variants={item} key={index}>
            <Link
              href={action.href}
              className="group/action flex flex-col p-4 bg-[#0f1117] hover:bg-[#1e2333] border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl border border-white/5 group-hover/action:scale-110 transition-transform duration-300 ${action.colorClass}`}>
                  <action.icon size={16} strokeWidth={2.5} />
                </div>
                <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono tracking-widest text-gray-500 group-hover/action:bg-white/10 group-hover/action:text-gray-300 transition-colors">
                  {action.shortcut}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-sora font-semibold text-gray-200 mb-0.5 group-hover/action:text-white transition-colors">{action.title}</h3>
                <p className="text-[9px] font-mono tracking-widest uppercase text-gray-500 group-hover/action:text-gray-400">{action.description}</p>
              </div>
              <ArrowUpRight size={16} className="absolute right-4 bottom-4 text-gray-600 opacity-0 transform translate-y-2 -translate-x-2 group-hover/action:opacity-100 group-hover/action:translate-y-0 group-hover/action:translate-x-0 transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
