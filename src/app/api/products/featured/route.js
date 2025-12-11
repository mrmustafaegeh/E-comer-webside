// app/api/featured/route.js
import dbConnect from "../../../../lib/dbConnect"; // Fixed import
import Product from "../../../../../models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Check if 'featured' field exists, otherwise use isFeatured
    const products = await Product.find({
      $or: [{ featured: true }, { isFeatured: true }],
    })
      .limit(4)
      .lean();

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error("FEATURED PRODUCTS API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load featured products" },
      { status: 500 }
    );
  }
}
