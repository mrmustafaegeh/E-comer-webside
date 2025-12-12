import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  const product = await prisma.product.findUnique({
    where: { id: Number(params.id) },
  });

  return NextResponse.json(product);
}

export async function PUT(req, { params }) {
  const data = await req.json();

  const updated = await prisma.product.update({
    where: { id: Number(params.id) },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  await prisma.product.delete({
    where: { id: Number(params.id) },
  });

  return NextResponse.json({ message: "Deleted" });
}
