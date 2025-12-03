"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  login as loginAction,
  logout as logoutAction,
} from "../store/authSlice";

export default function useAuthRestore() {
  const dispatch = useAppDispatch();
  const isChecked = useAppSelector((s) => s.authChecked); // optional flag if you add it

  useEffect(() => {
    async function restore() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const data = await res.json();
        if (data.user) {
          dispatch(loginAction({ user: data.user, token: null }));
        } else {
          dispatch(logoutAction());
        }
      } catch (err) {
        // network / ignore
      }
    }
    restore();
  }, [dispatch]);
}
