import clientPromise from "../../../../lib/MongoDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { id } = await params; // ✅ REQUIRED in App Router

    const client = await clientPromise;
    const db = client.db();

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("PRODUCT DETAIL API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load product" },
      { status: 500 }
    );
  }
}
