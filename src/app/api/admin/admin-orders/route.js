import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user || (!user.isAdmin && !user.roles?.includes("ADMIN"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { status, page = "1", limit = "10", sort = "createdAt", order = "desc" } =
      Object.fromEntries(request.nextUrl.searchParams);

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        take: limitNum,
        skip,
        orderBy: { [sort]: order },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    // Format for legacy frontend expectation if necessary
    const formattedOrders = orders.map(o => ({
      ...o,
      itemsCount: Array.isArray(o.items) ? o.items.length : 0,
    }));

    return NextResponse.json(
      {
        orders: formattedOrders,
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
    console.error("ADMIN ORDERS GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load orders" },
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
    const { userId, items, totalPrice, status } = body;

    if (!userId || !items || !totalPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId,
        items: items, // Note: JSON field in schema
        totalPrice: Number(totalPrice),
        status: status || "processing",
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (err) {
    console.error("ADMIN ORDERS POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
