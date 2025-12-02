"use client";
import React from "react";
import { useAppDispatch } from "@/store/hooks";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" }); // clears cookie
    dispatch(logoutAction());
    router.push("/"); // or /auth/login
  }

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-2 rounded bg-red-600 text-white"
    >
      Logout
    </button>
  );
}
