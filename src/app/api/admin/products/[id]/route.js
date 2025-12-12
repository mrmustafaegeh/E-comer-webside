import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import Product from "../../../../../../models/product";

// GET /api/admin/products/:id
export async function GET(req, { params }) {
  await dbConnect();
  const product = await Product.findById(params.id);
  return NextResponse.json(product);
}

// PUT /api/admin/products/:id
export async function PUT(req, { params }) {
  await dbConnect();
  const body = await req.json();
  const updated = await Product.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return NextResponse.json(updated);
}

// DELETE /api/admin/products/:id
export async function DELETE(req, { params }) {
  await dbConnect();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
