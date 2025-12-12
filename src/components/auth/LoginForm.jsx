"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    state: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: { email: "mr.mustafaegeh@gmail.com" },
    resolver: zodResolver(LoginSchema),
  });

  const router = useRouter();
  const { refreshUser } = useAuth(); // ✅ Make sure to get refreshUser

  async function onSubmit(data) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Display backend error on email field
        setError("email", { message: result.error || "Login failed" });
        return;
      }

      // Refresh user context and redirect
      await refreshUser();
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("root", { message: "Something went wrong" });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="w-full max-w-md p-6" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full px-4 py-2 border rounded"
          />
          {state?.errors.email && (
            <div className="text-red-500 text-sm mt-1">
              {state.errors.email.message}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input
            {...register("password")}
            type="password"
            className="w-full px-4 py-2 border rounded"
          />
          {state?.errors.password && (
            <div className="text-red-500 text-sm mt-1">
              {state.errors.password.message}
            </div>
          )}
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {state?.errors.root && (
          <div className="text-red-500 text-sm mt-4">
            {state.errors.root.message}
          </div>
        )}
      </form>
    </div>
  );
}
