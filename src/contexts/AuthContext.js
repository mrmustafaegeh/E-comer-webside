"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  user: null,
  loading: true,
  refreshUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (user) => {
    try {
      const res = await fetch("/api/auth/session");
      if (!res.ok) {
        setUser(null);
      } else {
        const data = await res.json();
        setUser(data.user || null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refreshUser = async (user) => {
    setLoading(true);
    await fetchUser(user);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
