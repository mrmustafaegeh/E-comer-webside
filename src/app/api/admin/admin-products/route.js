// app/api/admin/admin-products/route.js
import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

// GET /api/admin/admin-products?search=&category=&page=1&limit=50
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    const {
      search = "",
      category,
      page = 1,
      limit = 50,
    } = Object.fromEntries(req.nextUrl.searchParams);

    const filters = {};

    if (category) filters.category = category;
    if (search) filters.name = { $regex: search, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);

    const products = await collection
      .find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    const transformedProducts = products.map((product) => ({
      ...product,
      id: product._id.toString(),
      _id: product._id.toString(),
      name: product.name ?? product.title,
    }));

    const total = await collection.countDocuments(filters);

    return NextResponse.json(
      {
        products: transformedProducts,
        total,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN PRODUCTS GET ERROR:", err);
    return NextResponse.json(
      {
        error: "Failed to load products",
        details: err.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/admin-products
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    const body = await req.json();

    // Accept name OR title
    const name = typeof body.name === "string" ? body.name : body.title;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        { error: "Valid price is required" },
        { status: 400 }
      );
    }

    const now = new Date();

    const doc = {
      name: name.trim(),
      description: body.description ?? null,
      price,
      salePrice: body.salePrice != null ? Number(body.salePrice) : null,
      thumbnail: body.thumbnail ?? null,
      image: body.image ?? null,
      category: body.category ?? null,
      stock: body.stock != null ? Number(body.stock) : 0,
      rating: body.rating != null ? Number(body.rating) : 0,
      numReviews: body.numReviews != null ? Number(body.numReviews) : 0,
      featured: Boolean(body.featured),
      isFeatured: body.isFeatured ?? null,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(doc);

    return NextResponse.json(
      {
        ...doc,
        _id: result.insertedId.toString(),
        id: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("ADMIN PRODUCTS POST ERROR:", err);
    return NextResponse.json(
      {
        error: "Failed to create product",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
