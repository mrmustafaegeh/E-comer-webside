import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/security";

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 3, "1 h");
    if (!success) return rateLimitResponse();

    const body = await request.json();
    const { email, password, name, referredBy } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const { registerUser } = await import("@/services/authService");
    const result = await registerUser({ name, email, password, referredBy });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        userId: result.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Register error:", error);
    return NextResponse.json(
      {
        error: "Registration failed. Please try again.",
        details:
          process.env.NODE_ENV === "development"
            ? String(error?.message || error)
            : undefined,
      },
      { status: 500 }
    );
  }
}
