import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

function parseSort(sortStr) {
  if (!sortStr) return { createdAt: -1 };
  const dir = sortStr.startsWith("-") ? -1 : 1;
  const field = sortStr.startsWith("-") ? sortStr.slice(1) : sortStr;
  return { [field]: dir };
}

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const col = db.collection("orders");

    const params = Object.fromEntries(req.nextUrl.searchParams);
    const page = Number(params.page || 1);
    const limit = Number(params.limit || 10);
    const sort = params.sort || "-createdAt";
    const status = params.status;

    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const orders = await col
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(parseSort(sort))
      .toArray();

    const total = await col.countDocuments(filter);

    return NextResponse.json(
      {
        orders: orders.map((o) => ({
          ...o,
          _id: o._id.toString(),
          id: o._id.toString(),
        })),
        total,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN ORDERS GET ERROR:", err);
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
    if (!products)
      return NextResponse.json(
        { error: "products is required" },
        { status: 400 }
      );
    if (!Number.isFinite(totalPrice))
      return NextResponse.json(
        { error: "Valid totalPrice is required" },
        { status: 400 }
      );

    const doc = {
      userId,
      products,
      totalPrice,
      status: body.status || "processing",
      createdAt: new Date(),
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
    console.error("ADMIN ORDERS POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
