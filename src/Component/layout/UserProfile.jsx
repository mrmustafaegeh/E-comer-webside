"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Image from "next/image";

export default function UserProfile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-4 px-4 py-2 rounded-none bg-black border border-white/10 hover:border-white transition-all duration-500 focus:outline-none group shadow-2xl"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative w-10 h-10 bg-white rounded-none flex items-center justify-center text-black font-heading font-black overflow-hidden shadow-2xl transition-all duration-500 group-hover:bg-black group-hover:text-white group-hover:ring-1 group-hover:ring-white">
          {user.image && !imageError ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              fill
              sizes="40px"
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              priority={false}
              loading="lazy"
              onError={() => setImageError(true)}
              quality={75}
            />
          ) : (
            <span className="italic">{user.name?.charAt(0).toUpperCase() || "U"}</span>
          )}
        </div>
        <span className="text-[10px] font-mono font-black tracking-[0.4em] text-white hidden sm:inline uppercase italic group-hover:translate-x-2 transition-transform duration-500">{user.name}</span>
        
        <svg
          className={`w-4 h-4 text-gray-700 transition-all duration-500 ${isOpen ? 'rotate-180 text-white' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          <div 
            className="absolute right-0 mt-6 w-72 bg-black border border-white/20 py-0 z-50 shadow-[0_20px_60px_rgba(0,0,0,1)] rounded-none overflow-hidden"
            role="menu"
            aria-orientation="vertical"
          >
                         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>

                        <div className="px-8 py-10 border-b border-white/10 relative z-10 bg-white/5">
              <p className="text-xl font-heading font-black text-white italic tracking-tighter uppercase leading-none mb-4">{user.name}</p>
              <p className="text-[9px] font-mono font-black text-gray-700 uppercase tracking-[0.3em] overflow-hidden text-ellipsis mb-6 group-hover:text-gray-500 transition-colors">// {user.email}</p>
              <div className="inline-block px-4 py-1.5 bg-white text-black text-[8px] font-mono font-black uppercase tracking-[0.5em] italic">
                 PRIORITY_NODE
              </div>
            </div>

                        <div className="relative z-10 divide-y divide-white/5">
              {[
                { label: "PROFILE", path: "/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                { label: "OPERATIONS", path: "/orders", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
                { label: "WISHLIST", path: "/wishlist", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
                { label: "CONFIG", path: "/profile/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(item.path);
                  }}
                  className="w-full text-left px-8 py-6 text-[10px] font-mono font-black tracking-[0.5em] uppercase text-gray-700 hover:bg-white hover:text-black transition-all duration-500 flex items-center space-x-5 italic group"
                  role="menuitem"
                >
                  <svg className="w-5 h-5 text-gray-900 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </button>
              ))}

                            {((user.role === 'admin' || user.role === 'ADMIN') || 
                (Array.isArray(user.role) && (user.role.includes('admin') || user.role.includes('ADMIN'))) ||
                (Array.isArray(user.roles) && (user.roles.includes('admin') || user.roles.includes('ADMIN')))) && (
                <div className="bg-white/5">
                   <div className="px-8 pt-8 pb-4 text-[9px] font-mono tracking-[0.6em] font-black text-white uppercase italic underline underline-offset-8">
                     ROOT PROTOCOL
                   </div>
                  {[
                    { label: "ADMIN TERMINAL", path: "/admin/dashboard", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                    { label: "ASSET DB", path: "/admin/admin-products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setIsOpen(false);
                        router.push(item.path);
                      }}
                      className="w-full text-left px-8 py-6 text-[10px] font-mono font-black tracking-[0.5em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500 flex items-center space-x-5 italic group"
                      role="menuitem"
                    >
                      <svg className="w-5 h-5 text-white group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={item.icon} />
                      </svg>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-8 py-8 text-[11px] font-mono font-black tracking-[0.6em] uppercase text-white bg-black hover:bg-red-600 transition-all duration-700 flex items-center space-x-5 italic group"
                role="menuitem"
              >
                <svg className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>TERMINATE SESSION</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}