"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  LoginLink,
  RegisterLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/cart", label: "Cart" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/form", label: "Profile" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="flex items-center gap-4">
                <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* User Profile */}
                <Link href="/dashboard" className="flex items-center gap-2">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.given_name}
                      className="w-8 h-8 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <span className="text-gray-700 font-medium">
                    {user?.given_name || "Profile"}
                  </span>
                </Link>

                {/* Logout Button */}
                <LogoutLink className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  Log out
                </LogoutLink>
              </div>
            ) : (
              <>
                <LoginLink className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Sign In
                </LoginLink>
                <RegisterLink className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                  Get Started
                </RegisterLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Mobile Navigation Links */}
            <div className="space-y-2 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 px-4 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="space-y-3">
                {/* Mobile User Profile */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.given_name}
                      className="w-10 h-10 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {user?.given_name || "User"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Mobile Logout */}
                <LogoutLink className="flex items-center justify-center w-full py-3 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors">
                  Log out
                </LogoutLink>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <LoginLink className="flex items-center justify-center py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Sign In
                </LoginLink>
                <RegisterLink className="flex items-center justify-center py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                  Create Account
                </RegisterLink>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
