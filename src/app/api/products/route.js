import { NextResponse } from "next/server";

// In-memory database (for demo - use a real database in production)
let products = [
  {
    id: "1",
    name: "iPhone 15",
    description: "Latest Apple smartphone with A16 chip",
    price: 1200,
    category: "Electronics",
    stock: 10,
    image: "https://picsum.photos/300/300?random=1",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Samsung S24",
    description: "Premium Android phone with AMOLED display",
    price: 999,
    category: "Electronics",
    stock: 5,
    image: "https://picsum.photos/300/300?random=2",
    status: "active",
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "3",
    name: "MacBook Pro",
    description: "Professional laptop for developers",
    price: 2399,
    category: "Electronics",
    stock: 8,
    image: "https://picsum.photos/300/300?random=3",
    status: "active",
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
  },
];

// Helper function to simulate database operations
const findProductById = (id) => products.find((p) => p.id === id);
const findProductIndex = (id) => products.findIndex((p) => p.id === id);

// GET /api/products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const category = searchParams.get("category");

    let results = products;

    // Apply filters if provided
    if (query) {
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (category && category !== "all") {
      results = results.filter((p) => p.category === category);
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/products
export async function POST(request) {
  try {
    const product = await request.json();

    // Validate required fields
    if (!product.name || product.price === undefined) {
      return NextResponse.json(
        { error: "Product name and price are required" },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = {
      id: Date.now().toString(),
      status: "active",
      stock: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...product,
    };

    products.push(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
