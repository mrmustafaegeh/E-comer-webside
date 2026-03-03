import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateProfileSchema = z.object({
  name: z.union([z.string().min(2, "Name must be at least 2 characters"), z.literal("")]).optional(),
  image: z.union([z.string().url(), z.literal("")]).optional().nullable(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
});
