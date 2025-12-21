// app/api/products/route.js
import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

// Optional: cache GET for a short time (helps a lot in production)
// If you prefer no caching, remove these headers in the return.
export async function GET(req) {
  const start = Date.now();

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    const params = Object.fromEntries(req.nextUrl.searchParams);

    const search = (params.search || "").trim();
    const category = (params.category || "").trim();

    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.min(48, Math.max(1, Number(params.limit || 12))); // ✅ cap at 48

    // Only apply price filter if provided (or keep defaults)
    const minPriceRaw = params.minPrice;
    const maxPriceRaw = params.maxPrice;

    const minPrice =
      minPriceRaw !== undefined && minPriceRaw !== ""
        ? Number(minPriceRaw)
        : null;
    const maxPrice =
      maxPriceRaw !== undefined && maxPriceRaw !== ""
        ? Number(maxPriceRaw)
        : null;

    const filters = {};

    if (category) filters.category = category;

    if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
      filters.price = {};
      if (Number.isFinite(minPrice)) filters.price.$gte = minPrice;
      if (Number.isFinite(maxPrice)) filters.price.$lte = maxPrice;
    }

    // ✅ search both name and title
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    // ✅ only return fields needed for product cards
    const projection = {
      name: 1,
      title: 1,
      price: 1,
      salePrice: 1,
      image: 1,
      thumbnail: 1,
      category: 1,
      rating: 1,
      numReviews: 1,
      featured: 1,
      stock: 1,
      createdAt: 1,
    };

    // ✅ run queries in parallel
    const [products, total] = await Promise.all([
      collection
        .find(filters, { projection })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filters),
    ]);

    const transformedProducts = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      id: p._id.toString(),
      title: p.title ?? p.name,
      name: p.name ?? p.title,
    }));

    const ms = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ /api/products ${transformedProducts.length} items in ${ms}ms`
      );
    }

    return NextResponse.json(
      {
        products: transformedProducts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      {
        status: 200,
        headers: {
          // short caching
          "Cache-Control":
            process.env.NODE_ENV === "production"
              ? "public, s-maxage=60, stale-while-revalidate=300"
              : "private, max-age=10",
        },
      }
    );
  } catch (err) {
    console.error("PRODUCTS API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    const body = await req.json();

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
      title: (body.title || name).trim(), // keep both
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
    console.error("PRODUCTS POST API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
