import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const products = await db
      .collection("products")
      .find({
        $or: [{ featured: true }, { rating: { $gte: 4.5 } }],
      })
      .sort({ rating: -1 })
      .limit(4)
      .toArray();

    console.log("Found featured products:", products.length);

    return NextResponse.json(products);
  } catch (err) {
    console.error("FEATURED PRODUCTS API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load featured products", message: err.message },
      { status: 500 }
    );
  }
}
