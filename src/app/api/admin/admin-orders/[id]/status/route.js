import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || (!user.isAdmin && !user.roles?.includes("ADMIN"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("ADMIN ORDER STATUS PUT ERROR:", err);
    if (err.code === 'P2025') {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
