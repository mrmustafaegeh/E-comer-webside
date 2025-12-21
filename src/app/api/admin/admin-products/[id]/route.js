// app/api/admin/admin-products/[id]/route.js
import clientPromise from "../../../../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

/** helper */
function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function notFound(message = "Product not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

// GET /api/admin/admin-products/[id]
export async function GET(req, { params }) {
  try {
    const { id } = await params; // ✅ important in your Next version

    if (!id || !ObjectId.isValid(id)) return badRequest("Invalid product ID");

    const client = await clientPromise;
    const db = client.db("ecommerce");
    const collection = db.collection("products");

    const product = await collection.findOne({ _id: new ObjectId(id) });
    if (!product) return notFound();

    return NextResponse.json(
      {
        ...product,
        id: product._id.toString(),
        _id: product._id.toString(),
        name: product.name ?? product.title ?? "",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN PRODUCT GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch product", details: err.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/admin-products/[id]
export async function PUT(req, { params }) {
  try {
    const { id } = await params; // ✅ important
    if (!id || !ObjectId.isValid(id)) return badRequest("Invalid product ID");

    const body = await req.json();

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    // Accept name OR title, but store as `name`
    const name = typeof body.name === "string" ? body.name : body.title;
    if (name != null && !String(name).trim()) {
      return badRequest("Product name is required");
    }

    // Build update doc (only update fields that are provided)
    const updateDoc = {
      updatedAt: new Date(),
    };

    if (body.name != null || body.title != null)
      updateDoc.name = String(name).trim();
    if (body.description !== undefined)
      updateDoc.description = body.description ?? null;

    if (body.price !== undefined) {
      const price = Number(body.price);
      if (!Number.isFinite(price) || price < 0)
        return badRequest("Valid price is required");
      updateDoc.price = price;
    }

    if (body.salePrice !== undefined) {
      updateDoc.salePrice =
        body.salePrice != null ? Number(body.salePrice) : null;
      if (
        updateDoc.salePrice != null &&
        !Number.isFinite(updateDoc.salePrice)
      ) {
        return badRequest("Valid salePrice is required");
      }
    }

    if (body.thumbnail !== undefined)
      updateDoc.thumbnail = body.thumbnail ?? null;
    if (body.image !== undefined) updateDoc.image = body.image ?? null;
    if (body.category !== undefined) updateDoc.category = body.category ?? null;

    if (body.stock !== undefined) {
      const stock = Number(body.stock);
      if (!Number.isFinite(stock) || stock < 0)
        return badRequest("Valid stock is required");
      updateDoc.stock = stock;
    }

    if (body.rating !== undefined) {
      const rating = Number(body.rating);
      if (!Number.isFinite(rating) || rating < 0)
        return badRequest("Valid rating is required");
      updateDoc.rating = rating;
    }

    if (body.numReviews !== undefined) {
      const numReviews = Number(body.numReviews);
      if (!Number.isFinite(numReviews) || numReviews < 0) {
        return badRequest("Valid numReviews is required");
      }
      updateDoc.numReviews = numReviews;
    }

    if (body.featured !== undefined)
      updateDoc.featured = Boolean(body.featured);
    if (body.isFeatured !== undefined)
      updateDoc.isFeatured = body.isFeatured ?? null;

    // If the only field is updatedAt, nothing meaningful was provided
    if (Object.keys(updateDoc).length === 1) {
      return badRequest("No valid fields provided to update");
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: "after" }
    );

    const updated = result?.value;
    if (!updated) return notFound();

    return NextResponse.json(
      {
        ...updated,
        id: updated._id.toString(),
        _id: updated._id.toString(),
        name: updated.name ?? updated.title ?? "",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN PRODUCT PUT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update product", details: err.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/admin-products/[id]
export async function DELETE(req, { params }) {
  try {
    const { id } = await params; // ✅ important
    if (!id || !ObjectId.isValid(id)) return badRequest("Invalid product ID");

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) return notFound();

    return NextResponse.json(
      { success: true, message: "Product deleted successfully", id },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN PRODUCT DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to delete product", details: err.message },
      { status: 500 }
    );
  }
}
