import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.product.findMany({
    distinct: ["category"],
    select: { category: true },
  });

  return NextResponse.json(categories.map((c) => c.category));
}
