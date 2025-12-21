// app/api/orders/route.js
import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const col = db.collection("orders");

    const params = Object.fromEntries(req.nextUrl.searchParams);
    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.min(50, Math.max(1, Number(params.limit || 10)));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      col
        .find(
          {},
          {
            projection: {
              userId: 1,
              products: 1,
              totalPrice: 1,
              status: 1,
              createdAt: 1,
            },
          }
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      col.countDocuments({}),
    ]);

    return NextResponse.json(
      {
        orders: orders.map((o) => ({
          ...o,
          _id: o._id.toString(),
          id: o._id.toString(),
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      {
        status: 200,
        headers: { "Cache-Control": "private, max-age=30" },
      }
    );
  } catch (err) {
    console.error("ORDERS GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const col = db.collection("orders");

    const body = await req.json();

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

    const doc = {
      userId,
      products,
      totalPrice,
      status: body.status || "processing",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json(
      {
        ...doc,
        _id: result.insertedId.toString(),
        id: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("ORDERS POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
