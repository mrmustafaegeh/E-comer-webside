import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  const startTime = Date.now();

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    const params = Object.fromEntries(req.nextUrl.searchParams);

    const search = (params.search || "").trim();
    const category = (params.category || "").trim();
    const pageNum = Math.max(1, Number(params.page || 1));
    const limitNum = Math.min(100, Math.max(1, Number(params.limit || 50)));
    const skip = (pageNum - 1) * limitNum;

    const filters = {};
    if (category) filters.category = category;

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    const projection = {
      name: 1,
      title: 1,
      price: 1,
      salePrice: 1,
      image: 1,
      thumbnail: 1,
      category: 1,
      stock: 1,
      featured: 1,
      rating: 1,
      createdAt: 1,
    };

    const [products, total] = await Promise.all([
      collection
        .find(filters, { projection })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .toArray(),
      collection.countDocuments(filters),
    ]);

    const transformedProducts = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      id: p._id.toString(),
      name: p.name ?? p.title,
      title: p.title ?? p.name,
    }));

    const ms = Date.now() - startTime;
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ Admin products: ${products.length} in ${ms}ms`);
    }

    return NextResponse.json(
      {
        products: transformedProducts,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            process.env.NODE_ENV === "production"
              ? "private, max-age=60"
              : "private, max-age=10",
        },
      }
    );
  } catch (err) {
    console.error("ADMIN PRODUCTS GET ERROR:", err);
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
      title: (body.title || name).trim(),
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
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
