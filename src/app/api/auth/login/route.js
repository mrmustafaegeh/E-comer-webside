// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";

/**
 * Fake auth API - for portfolio/demo.
 * In real app: validate credentials, return HTTP-only cookie with JWT.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // simple validation
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // demo user: replace with DB lookup in real project
    const demoUser = {
      id: 1,
      email: "admin@shop.com",
      role: "admin",
      name: "Admin",
    };

    if (email === "admin@shop.com" && password === "123456") {
      const token = "fake-jwt-token-demo"; // in prod: sign a real JWT

      const res = NextResponse.json({ user: demoUser, message: "Logged in" });

      // set HTTP-only cookie (demo). Adjust options for production.
      res.cookies.set({
        name: "token_demo",
        value: token,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // secure: true in production (HTTPS)
      });

      return res;
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
