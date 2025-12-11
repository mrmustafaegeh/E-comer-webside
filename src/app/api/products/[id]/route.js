import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "../../../../../models/Product";

export async function GET(req, { params }) {
  await dbConnect();
  const product = await Product.findById(params.id);

  if (!product)
    return NextResponse.json({ message: "Product not found" }, { status: 404 });

  return NextResponse.json(product);
}
