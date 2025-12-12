import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/product";

// GET /api/admin/products
export async function GET() {
  await dbConnect();
  const products = await Product.find().sort({ createdAt: -1 });
  return NextResponse.json(products);
}

// POST /api/admin/products
export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const product = await Product.create(body);
  return NextResponse.json(product);
}
