// src/app/api/auth/me/route.js
import { NextResponse } from "next/server";

/**
 * Returns the user if token cookie present (demo).
 * In a real setup you'd verify the JWT and return user data.
 */
export async function GET(req) {
  const token = req.cookies.get("token_demo")?.value;

  if (!token) return NextResponse.json({ user: null }, { status: 200 });

  // fake verification
  if (token === "fake-jwt-token-demo") {
    const demoUser = {
      id: 1,
      email: "admin@shop.com",
      role: "admin",
      name: "Admin",
    };
    return NextResponse.json({ user: demoUser }, { status: 200 });
  }

  return NextResponse.json({ user: null }, { status: 200 });
}
