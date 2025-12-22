// app/api/hero-products/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

function formatMoney(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return `$${num.toFixed(2)}`;
}

function calcDiscount(price, oldPrice) {
  const p = Number(price);
  const o = Number(oldPrice);
  if (!Number.isFinite(p) || !Number.isFinite(o) || o <= 0 || p >= o)
    return null;
  const pct = Math.round(((o - p) / o) * 100);
  return `-${pct}%`;
}

export async function GET() {
  try {
    const client = await clientPromise;

    // if you already set your DB in MONGODB_URI you can do: client.db()
    const db = client.db("ecommerce");

    const docs = await db
      .collection("products")
      .find({ $or: [{ isFeatured: true }, { featured: true }] })
      .sort({ featuredOrder: 1, createdAt: -1 })
      .limit(5)
      .project({
        name: 1,
        title: 1,
        price: 1,
        salePrice: 1,
        oldPrice: 1,
        discount: 1,
        rating: 1,
        image: 1,
        thumbnail: 1,
        emoji: 1,
        gradient: 1,
      })
      .toArray();

    console.log("MONGODB_URI exists?", !!process.env.MONGODB_URI);

    const products = docs.map((p) => {
      const rawPrice = p.salePrice ?? p.price ?? 0;
      const rawOld = p.oldPrice ?? null;

      const price = formatMoney(rawPrice) ?? "$0.00";
      const oldPrice = formatMoney(rawOld); // can be null

      const discount =
        p.discount || (oldPrice ? calcDiscount(rawPrice, rawOld) : null) || "";

      return {
        id: p._id.toString(),
        title: p.title || p.name || "Untitled",
        price,
        oldPrice, // null allowed
        discount,
        rating: Number.isFinite(Number(p.rating)) ? Number(p.rating) : 4.5,

        // card uses both: `imageUrl` (real image) and `emoji` fallback
        imageUrl: p.thumbnail || p.image || null,
        emoji: p.emoji || null,

        gradient: p.gradient || "from-blue-500 to-purple-600",
      };
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Hero products API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hero products" },
      { status: 500 }
    );
  }
}
