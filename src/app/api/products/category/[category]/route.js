import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "../../../../../../models/Product";

export async function GET(req, { params }) {
  await dbConnect();
  const items = await Product.find({ category: params.category });
  return NextResponse.json(items);
}
