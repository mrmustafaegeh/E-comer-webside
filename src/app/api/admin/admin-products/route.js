import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { z } from "zod";

export const dynamic = "force-dynamic";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.number().min(0),
  salePrice: z.number().min(0).optional().nullable(),
  category: z.string().min(1, "Category is required"),
  stock: z.number().int().min(0).default(0),
  image: z.string().url().optional().nullable(),
  featured: z.boolean().default(false),
});

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user || (!user.isAdmin && !user.roles?.includes("ADMIN"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { search = "", category, page = "1", limit = "50" } =
      Object.fromEntries(request.nextUrl.searchParams);

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limitNum,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json(
      {
        products,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err) {
    console.error("ADMIN PRODUCTS GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user || (!user.isAdmin && !user.roles?.includes("ADMIN"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;
    const product = await prisma.product.create({
      data: {
        ...data,
        name: data.title, // Keep name for compatibility
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("ADMIN PRODUCTS POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
