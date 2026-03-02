import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get session with error handling
    let session;
    try {
      session = await getCurrentUser();
    } catch (sessionError) {
      console.error("❌ getCurrentUser error:", sessionError);
      return NextResponse.json({ user: null }, { status: 200 });
    }

    if (!session || !session.userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const userId = session.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        isAdmin: true
      }
    });

    if (!user) {

      return NextResponse.json({ user: null }, { status: 200 });
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.isAdmin ? ["ADMIN", "USER"] : [(user.role || "USER").toUpperCase()],
      createdAt: user.createdAt,
    };

    return NextResponse.json({ user: userResponse }, { status: 200 });
  } catch (error) {
    console.error("❌ Session route error:", error);
    // Return null user instead of error to prevent auth loops
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
