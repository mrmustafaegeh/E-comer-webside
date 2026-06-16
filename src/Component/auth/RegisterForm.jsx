"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  Button,
  Input,
  Alert,
  AuthShell,
  FormField,
} from "@/Component/ui/primitives";

export default function RegisterForm() {
  const [registerError, setRegisterError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("referredBy");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setRegisterError("");
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, referredBy }),
      });
      const result = await response.json();
      if (!response.ok) {
        setRegisterError(result.error || "Registration failed");
        return;
      }
      setIsSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch {
      setRegisterError("Something went wrong. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <AuthShell title="Account created" description="Redirecting you to sign in…">
        <div className="py-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          <Loader2 className="mx-auto mt-6 h-5 w-5 animate-spin text-[var(--text-muted)]" />
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create account"
      description="Sign up to shop, track orders, and save your wishlist."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-[var(--text)] underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {registerError && (
        <Alert variant="error" className="mb-6">
          {registerError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Jane Doe"
            {...register("name", { required: "Name is required" })}
          />
        </FormField>

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email", { required: "Email is required" })}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          hint="At least 8 characters"
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "At least 8 characters" },
            })}
          />
        </FormField>

        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full gap-2 py-3">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
