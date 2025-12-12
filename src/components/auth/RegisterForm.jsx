"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import SubmitButton from "../ui/LoginButton";
import { registerAction } from "../../lib/auth";

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .trim(),
    email: emailField,
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const router = useRouter();

  // Debug: Log state changes
  useEffect(() => {
    console.log("📊 Registration form state updated:", state);
    console.log("⏳ Registration loading state:", isPending);
  }, [state, isPending]);

  useEffect(() => {
    if (state?.success) {
      console.log("✅ Registration success in useEffect, showing toast...");
      toast.success(state.message || "Registration successful!");

      console.log("🔄 Setting up redirect to /dashboard in 500ms...");
      const timer = setTimeout(() => {
        console.log("🚀 Executing router.push('/dashboard')");
        router.push("/dashboard");
      }, 500);

      return () => clearTimeout(timer);
    } else if (state?.message && !state?.success) {
      console.log("❌ Registration error in useEffect:", state.message);
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us today
          </p>
        </div>

        <form
          action={formAction}
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            console.log("📝 Registration form submitted");
          }}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                  defaultValue="Test User" // Default for testing
                />
              </div>
              {state?.errors?.name && (
                <p className="mt-1 text-sm text-red-600">{state.errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="[email protected]"
                  required
                  defaultValue="test@example.com" // Default for testing
                />
              </div>
              {state?.errors?.email && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  defaultValue="Password123" // Default for testing
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {state?.errors?.password && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  defaultValue="Password123" // Default for testing
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {state?.errors?.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password requirements hint */}
            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
              <p className="font-medium mb-1">Password must:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Be at least 6 characters long</li>
                <li>Match in both fields</li>
              </ul>
            </div>
          </div>

          <SubmitButton loading={isPending}>
            {isPending ? "Creating Account..." : "Create Account"}
          </SubmitButton>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === "development" && state && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-500 font-mono">
                Debug State: {JSON.stringify(state, null, 2)}
              </p>
            </div>
          )}
        </form>

        {/* Test credentials reminder */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 text-center">
            💡 <strong>Testing Tip:</strong> Use the pre-filled values for quick
            testing
          </p>
          <p className="text-xs text-yellow-700 text-center mt-1">
            (Remove defaults in production)
          </p>
        </div>
      </div>
    </div>
  );
}
