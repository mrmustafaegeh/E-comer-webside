import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL is required").optional().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required").optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET is required").optional(),
  ANTHROPIC_API_KEY: z.string().min(1, "ANTHROPIC_API_KEY is required").optional(),
});

const validateEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    result.error.issues.forEach((issue) => {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    });
    throw new Error("Invalid environment variables");
  }

  return result.data;
};

export const env = validateEnv();
