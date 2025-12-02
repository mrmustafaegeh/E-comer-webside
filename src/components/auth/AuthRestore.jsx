"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { login, logout } from "@/store/slices/authSlice";

export default function AuthRestore() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function restoreUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.user) {
          dispatch(login({ user: data.user }));
        } else {
          dispatch(logout());
        }
      } catch (e) {
        dispatch(logout());
      }
    }

    restoreUser();
  }, [dispatch]);

  return null;
}
