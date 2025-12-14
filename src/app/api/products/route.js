// app/api/products/route.js
import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(); // uses the default DB in URI
    const collection = db.collection("products");

    const {
      search = "",
      category,
      page = 1,
      limit = 12,
      minPrice = 0,
      maxPrice = 10000,
    } = Object.fromEntries(req.nextUrl.searchParams);

    const filters = {
      price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
    };

    if (category) filters.category = category;
    if (search) filters.name = { $regex: search, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);

    const products = await collection
      .find(filters)
      .skip(skip)
      .limit(Number(limit))
      .toArray();
    const transformedProducts = products.map((product) => ({
      ...product,
      id: product._id.toString(), // Add id field
      name: product.title, // Add name field
      _id: product._id.toString(), // Keep _id as string
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
    console.error("PRODUCTS API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}
