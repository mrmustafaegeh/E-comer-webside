import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

import {
  validateRequest,
  rateLimit,
  forbiddenResponse,
  rateLimitResponse,
  getClientIp,
} from "@/lib/security";

export async function POST(request) {
  try {
    const ok = await validateRequest(request);
    if (!ok) {
      return forbiddenResponse({
        code: "ORIGIN_FORBIDDEN",
        origin: request.headers.get("origin"),
      });
    }

    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 5, "15 m"); 
    if (!success) return rateLimitResponse();

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const email = String(body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const userPasswordHash = user.password;
    if (!userPasswordHash || typeof userPasswordHash !== "string") {
      console.error(
        "❌ User has no password hash stored:",
        user?.id
      );
      return NextResponse.json(
        { error: "Account misconfigured" },
        { status: 500 }
      );
    }

    const passOk = await bcrypt.compare(password, userPasswordHash);
    if (!passOk) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const roles = user.isAdmin ? ["ADMIN", "USER"] : [(user.role || "USER").toUpperCase()];

    await createSession(
      user.id,
      user.email,
      roles
    );

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name || null,
          roles: roles,
          createdAt: user.createdAt || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      {
        error: "Login failed. Please try again.",
        details:
          process.env.NODE_ENV === "development"
            ? String(error?.message || error)
            : undefined,
      },
      { status: 500 }
    );
  }
}
