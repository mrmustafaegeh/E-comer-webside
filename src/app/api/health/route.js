import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const start = Date.now();
    // Ping database
    await prisma.$queryRaw`SELECT 1`;
    const queryTime = Date.now() - start;

    const [productCount, featuredCount] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isFeatured: true } }),
    ]);

    return NextResponse.json({
      status: "ok",
      database: "connected",
      products: {
        total: productCount,
        featured: featuredCount,
      },
      performance: {
        queryTime: `${queryTime}ms`,
        status: queryTime < 100 ? "excellent" : queryTime < 200 ? "good" : "slow",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Health check error:", err);
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
