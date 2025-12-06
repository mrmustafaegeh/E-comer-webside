import { NextResponse } from "next/server";

// Use the same products array (in a real app, use a shared module or database)
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
// GET /api/products/[id]
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const product = products.find((p) => p.id === id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/products/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updatedData = await request.json();

    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update product
    products[index] = {
      ...products[index],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(products[index]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const initialLength = products.length;

    products = products.filter((p) => p.id !== id);

    if (products.length === initialLength) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
