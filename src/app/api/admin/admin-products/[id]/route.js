import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

async function checkAdmin() {
  const user = await getCurrentUser();
  if (!user || (!user.isAdmin && !user.roles?.includes("ADMIN"))) {
    return false;
  }
  return true;
}

export async function GET(request, { params }) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.error("ADMIN PRODUCT GET ERROR:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const updateData = {};

    // Explicitly allow only Prisma fields to prevent unknown arg explosions
    if (body.name !== undefined) updateData.name = body.name;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured);
    
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.salePrice !== undefined) updateData.salePrice = Number(body.salePrice);
    if (body.stock !== undefined) updateData.stock = Number(body.stock);

    // Tags processing
    if (body.tags !== undefined) {
      if (typeof body.tags === "string") {
        updateData.tags = body.tags.split(",").map((t) => t.trim()).filter(Boolean);
      } else if (Array.isArray(body.tags)) {
        updateData.tags = body.tags;
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(product, { status: 200 });
    } catch (err) {
    console.error("ADMIN PRODUCT PUT ERROR:", err);
    if (err.code === 'P2025') {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Product deleted" }, { status: 200 });
  } catch (err) {
    console.error("ADMIN PRODUCT DELETE ERROR:", err);
    if (err.code === 'P2025') {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
