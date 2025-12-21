import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const startTime = Date.now();

  try {
    const client = await clientPromise;
    const db = client.db();

    const products = await db
      .collection("products")
      .find(
        { $or: [{ featured: true }, { rating: { $gte: 4.5 } }] },
        {
          projection: {
            title: 1,
            name: 1,
            price: 1,
            salePrice: 1,
            image: 1,
            thumbnail: 1,
            rating: 1,
            numReviews: 1,
            stock: 1,
            createdAt: 1,
          },
        }
      )
      .sort({ rating: -1 })
      .limit(4)
      .toArray();

    const fixedProducts = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      id: p._id.toString(),
      title: p.title ?? p.name,
      image: (p.image || p.thumbnail || "/images/default-product.png").replace(
        /\/\//g,
        "/"
      ),
    }));

    const ms = Date.now() - startTime;
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ Featured products: ${fixedProducts.length} in ${ms}ms`);
    }

    return NextResponse.json(fixedProducts, {
      status: 200,
      headers: {
        // Vercel-friendly caching
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("FEATURED PRODUCTS API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load featured products" },
      { status: 500 }
    );
  }
}
