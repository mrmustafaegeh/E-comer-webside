"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../lib/validation";
import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import {
  Button,
  Input,
  Alert,
  AuthShell,
  FormField,
} from "@/Component/ui/primitives";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loginError, setLoginError] = useState("");

  async function onSubmit(data) {
    try {
      setLoginError("");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        setLoginError(result.error || "Invalid credentials");
        return;
      }
      if (result.success) {
        await refreshUser();
        const roles = result.user?.roles || [];
        const isAdmin = roles.some((r) => String(r).toUpperCase() === "ADMIN");
        router.push(isAdmin ? "/admin/dashboard" : "/profile");
        router.refresh();
      }
    } catch {
      setLoginError("Something went wrong. Please try again.");
    }
  }

  return (
    <AuthShell
      title="Sign in"
      description="Welcome back. Enter your details to continue."
      footer={
        <>
          No account?{" "}
          <Link href="/auth/register" className="font-medium text-[var(--text)] underline-offset-4 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      {loginError && (
        <Alert variant="error" className="mb-6">
          {loginError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
          />
        </FormField>

        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full gap-2 py-3">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
