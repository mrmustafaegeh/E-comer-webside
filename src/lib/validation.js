import { z } from "zod";

/* --------------------------------------------------
   Reusable Fields
-------------------------------------------------- */

const emailField = z
  .string()
  .email("Invalid email address")
  .toLowerCase()
  .trim();

const passwordField = z
  .string()
  .min(6, "Password must be at least 6 characters");

/* --------------------------------------------------
   Login Schema
-------------------------------------------------- */

export const LoginSchema = z.object({
  email: emailField,
  password: passwordField,
});

/* --------------------------------------------------
   Register Schema
-------------------------------------------------- */

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .trim(),

    email: emailField,

    password: passwordField,

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

/* --------------------------------------------------
   Zod Error Formatter
-------------------------------------------------- */

export function formatZodErrors(error) {
  const formatted = {};
  for (const err of error.errors) {
    const field = err.path[0];
    formatted[field] = err.message;
  }
  return formatted;
}
