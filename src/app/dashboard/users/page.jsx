"use client";

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();

  if (user?.role !== "admin") {
    return (
      <p className="text-red-600">
        You do not have permission to view this page.
      </p>
    );
  }

  return <div className="text-2xl">Manage Users Here</div>;
}
