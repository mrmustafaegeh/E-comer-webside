"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Search, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  FilePlus,
  ArrowRight,
  Command
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface CommandItem {
  id: string;
  name: string;
  icon: any;
  href?: string;
  action?: () => void;
  section: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: CommandItem[] = [
    // Navigation
    { id: "nav-dash", name: "System Dashboard", icon: BarChart3, href: "/admin/dashboard", section: "Terminal Links" },
    { id: "nav-prod", name: "Asset Management", icon: Package, href: "/admin/admin-products", section: "Terminal Links" },
    { id: "nav-orders", name: "Logistics Queue", icon: ShoppingCart, href: "/admin/orders", section: "Terminal Links" },
    { id: "nav-users", name: "Customer Directory", icon: Users, href: "/admin/users", section: "Terminal Links" },
    { id: "nav-settings", name: "System Config", icon: Settings, href: "/admin/settings", section: "Terminal Links" },
    
    // Quick Actions
    { id: "act-new-prod", name: "Deploy New Asset", icon: FilePlus, href: "/admin/create-product", section: "Execution" },
    { id: "act-frontend", name: "Return to Frontend Root", icon: Search, href: "/", section: "Execution" },
    { id: "act-logout", name: "Terminate Link (Sign Out)", icon: LogOut, action: () => { console.log('Signout'); router.push('/auth/login'); }, section: "Execution" },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(query.toLowerCase())
  );

  const sections = Array.from(new Set(filteredCommands.map((c) => c.section)));

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === "Enter" && filteredCommands.length > 0) {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected.action) {
          selected.action();
        } else if (selected.href) {
          router.push(selected.href);
        }
        onClose();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, router, onClose]);

  // Handle global cmd+k
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // this is just a dummy hook here, the real one is usually in layout or header. We'll handle it parent side.
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.2 }}
           className="absolute inset-0 bg-[#0f1117]/80 backdrop-blur-sm"
           onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-xl bg-[#161b27] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="relative flex items-center px-4 py-4 border-b border-white/5 bg-[#1e2333]/50">
            <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you need?"
              className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 outline-none font-sora text-lg"
            />
            <div className="flex items-center gap-1.5 ml-3">
              <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded shadow-sm text-[10px] font-mono text-gray-400">ESC</kbd>
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto no-scrollbar py-2">
            {filteredCommands.length === 0 ? (
              <div className="py-14 text-center">
                <Command className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-sora text-gray-400">No results found for <span className="text-gray-200">"{query}"</span></p>
              </div>
            ) : (
              sections.map((section) => (
                <div key={section} className="mb-2">
                  <div className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-gray-500">
                    {section}
                  </div>
                  <ul className="px-2">
                    {filteredCommands
                      .filter((cmd) => cmd.section === section)
                      .map((cmd) => {
                        const actualIndex = filteredCommands.findIndex((c) => c.id === cmd.id);
                        const isSelected = actualIndex === selectedIndex;
                        
                        return (
                          <li key={cmd.id}>
                            <button
                              onMouseEnter={() => setSelectedIndex(actualIndex)}
                              onClick={() => {
                                if (cmd.action) cmd.action();
                                else if (cmd.href) router.push(cmd.href);
                                onClose();
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                                isSelected 
                                  ? "bg-blue-600/10 text-white" 
                                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg border ${isSelected ? "bg-blue-600 border-transparent text-white shadow-[0_0_10px_rgba(59,130,246,0.6)]" : "bg-white/5 border-white/10 text-gray-400"}`}>
                                  <cmd.icon size={16} />
                                </div>
                                <span className="font-sora text-sm">{cmd.name}</span>
                              </div>
                              {isSelected && <ArrowRight size={14} className="text-blue-500" />}
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              ))
            )}
          </div>
          
          {/* Footer Bar */}
          <div className="px-4 py-3 bg-[#0f1117] border-t border-white/5 flex items-center gap-4 text-[10px] font-mono text-gray-500">
             <div className="flex items-center gap-1.5">
               <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">↵</span> to select
             </div>
             <div className="flex items-center gap-1.5">
               <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">↑</span>
               <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">↓</span> to navigate
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
