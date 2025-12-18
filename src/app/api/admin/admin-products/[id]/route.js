// app/api/admin/admin-products/[id]/route.js
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// DELETE /api/admin/admin-products/[id]
export async function DELETE(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    const { id } = params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN PRODUCT DELETE ERROR:", err);
    return NextResponse.json(
      {
        error: "Failed to delete product",
        details: err.message,
      },
      { status: 500 }
    );
  }
}

// GET /api/admin/admin-products/[id]
export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    const { id } = params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await collection.findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        ...product,
        id: product._id.toString(),
        _id: product._id.toString(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN PRODUCT GET ERROR:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch product",
        details: err.message,
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/admin-products/[id]
export async function PUT(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    const { id } = params;
    const body = await req.json();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name : body.title;

    if (!name || !name.trim()) {
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

    const updateDoc = {
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
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        ...result,
        id: result._id.toString(),
        _id: result._id.toString(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN PRODUCT UPDATE ERROR:", err);
    return NextResponse.json(
      {
        error: "Failed to update product",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
