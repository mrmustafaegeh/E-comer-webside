import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user || (!user.isAdmin && !user.roles?.includes("ADMIN"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { search = "", page = "1", limit = "10" } =
      Object.fromEntries(request.nextUrl.searchParams);

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        take: limitNum,
        skip,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isAdmin: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json(
      {
        users,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error("ADMIN USERS GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user || (!user.isAdmin && !user.roles?.includes("ADMIN"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role, isAdmin } = body;

    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Invalid input. Name, email and password (min 6 chars) are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: role || "user",
        isAdmin: isAdmin || role === "admin" || false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error("ADMIN USERS POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
