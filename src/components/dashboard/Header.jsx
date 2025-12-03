"use client";

import LogoutButton from "../ui/LogoutButton";
import { useAppSelector } from "../../store/hooks";

export default function Header() {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <header className="bg-white shadow flex justify-between items-center px-6 py-4">
      <h2 className="text-xl font-semibold">Welcome, {user?.name || "User"}</h2>

      <LogoutButton />
    </header>
  );
}
