import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { createOrder } from "@/services/orderService";

export async function GET(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const query = { userId: user.userId };

    const params = Object.fromEntries(request.nextUrl.searchParams);
    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.min(50, Math.max(1, Number(params.limit || 10)));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: query,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: query }),
    ]);

    const response = NextResponse.json({
      orders: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });

    response.headers.set(
      "Cache-Control",
      "private, max-age=30, stale-while-revalidate=60"
    );

    return response;
  } catch (err) {
    console.error("ORDERS GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const userId = body.userId;
    const products = body.products;
    const totalPrice = Number(body.totalPrice);

    if (!userId)
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "products must be a non-empty array" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(totalPrice)) {
      return NextResponse.json(
        { error: "Valid totalPrice is required" },
        { status: 400 }
      );
    }

    const order = await createOrder({
      userId,
      products,
      totalPrice,
      deliveryAddress: body.shippingAddress || body.deliveryAddress,
      paymentMethod: body.paymentMethod,
      status: body.status || "PROCESSING",
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("ORDERS POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
