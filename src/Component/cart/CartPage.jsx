"use client";

import { useCart } from "../../hooks/useCart";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import {
  Container,
  PageHeader,
  Card,
  Button,
  EmptyState,
} from "../ui/primitives";

const CartPage = () => {
  const router = useRouter();
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const parsePrice = (price) => {
    if (price == null || price === "") return 0;
    if (typeof price === "number" && !isNaN(price)) return price;
    const cleaned = String(price).replace(/[^0-9.-]+/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const validatedCartItems = cartItems
    .map((item) => {
      const itemPrice = item.offerPrice || item.price;
      return {
        ...item,
        id: item.id || item._id,
        name: item.name || item.title || "Unknown Product",
        price: parsePrice(itemPrice),
        qty: Math.max(1, Math.min(Number(item.qty) || 1, 99)),
        imgSrc: item.image || item.imgSrc,
      };
    })
    .filter((item) => item.price > 0);

  const total = validatedCartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--bg)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  if (validatedCartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[var(--bg)] py-16">
        <Container>
          <EmptyState
            title="Your cart is empty"
            description="Add items from the shop to get started."
            action={
              <Button onClick={() => router.push("/products")}>
                Browse products
                <ArrowRight size={16} />
              </Button>
            }
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] py-12 md:py-16">
      <Container>
        <PageHeader title="Shopping cart" description={`${validatedCartItems.length} item(s)`} />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {validatedCartItems.map((item) => (
              <Card key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg bg-[var(--bg-subtle)] sm:h-24 sm:w-24">
                  <Image
                    src={item.imgSrc || "/images/product-placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-[var(--text)]">{item.name}</h3>
                      {item.category && (
                        <p className="text-xs text-[var(--text-muted)]">{item.category}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-1 rounded-lg border border-[var(--border)]">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.qty <= 1}
                        className="p-2 disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="p-2"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="text-lg font-semibold">{formatPrice(item.price * item.qty)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="h-fit space-y-6 p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Shipping</span>
                <span>Free</span>
              </div>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-4 text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Button className="w-full" onClick={() => router.push("/checkout")}>
              Checkout
              <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => router.push("/products")}>
              Continue shopping
            </Button>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
