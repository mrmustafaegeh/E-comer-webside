"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { Card } from "@/Component/ui/primitives";

interface Product {
  id: string;
  name: string;
  category?: string;
  sales: number;
  revenue: number;
  stock: number;
  image?: string;
}

interface TopProductsProps {
  products: Product[];
}

function stockLabel(stock: number) {
  if (stock <= 0) return { text: "Out of stock", className: "text-red-700" };
  if (stock < 5) return { text: `${stock} left — low`, className: "text-amber-700" };
  return { text: `${stock} in stock`, className: "text-[var(--text-muted)]" };
}

export default function TopProducts({ products = [] }: TopProductsProps) {
  if (!products.length) {
    return (
      <Card className="p-8 text-center text-sm text-[var(--text-muted)]">
        No sales data yet. Top products will appear after orders are placed.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[var(--border)] px-6 py-4">
        <h3 className="font-heading text-base font-semibold text-[var(--text)]">Top products</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">By units sold (recent orders)</p>
      </div>

      <ul className="divide-y divide-[var(--border)]">
        {products.map((product, index) => {
          const stock = stockLabel(product.stock);

          return (
            <li key={product.id} className="flex items-center gap-4 px-6 py-4">
              <span className="w-5 shrink-0 text-xs font-medium text-[var(--text-muted)]">
                {index + 1}
              </span>

              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)]">
                {product.image ? (
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--text-muted)]">
                    <Package size={16} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/admin-products/${product.id}`}
                  className="truncate text-sm font-medium text-[var(--text)] hover:underline"
                >
                  {product.name}
                </Link>
                <p className="truncate text-xs text-[var(--text-muted)]">
                  {product.category || "Uncategorized"} · {product.sales} sold
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums text-[var(--text)]">
                  ${product.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className={`text-xs ${stock.className}`}>{stock.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
