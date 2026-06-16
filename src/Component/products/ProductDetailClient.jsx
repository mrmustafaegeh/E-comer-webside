"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useAuth } from "../../contexts/AuthContext";
import { calculatePoints } from "../../services/loyaltyService";
import Link from "next/link";
import {
  Container,
  Badge,
  Button,
  Card,
} from "../ui/primitives";

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuth();

  const price = product.offerPrice || product.price;
  const estimatedPoints = calculatePoints(
    [{ ...product, price }],
    price * quantity,
    user?.loyaltyPoints || 0
  );

  const images = product.images?.length > 0 ? product.images : [product.image || "/images/product-placeholder.svg"];
  const isWishlisted = wishlistItems?.some((item) => item._id === product._id);

  const handleAddToCart = async () => {
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      await addToCart({
        ...product,
        id: product._id,
        name: product.title,
        price,
        qty: 1,
      });
    }
    setTimeout(() => setIsAdding(false), 800);
  };

  const discount = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[var(--bg)] py-12 md:py-16">
      <Container>
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--text)]">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[var(--text)]">Products</Link>
          <span>/</span>
          <span className="text-[var(--text)]">{product.category}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <Card className="relative aspect-square overflow-hidden p-0">
              <Image
                src={images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {discount > 0 && (
                <Badge className="absolute left-4 top-4" tone="accent">
                  -{discount}% off
                </Badge>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge className="absolute bottom-4 left-4">
                  Only {product.stock} left
                </Badge>
              )}
            </Card>

            {images.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 ${
                      selectedImage === idx ? "border-[var(--accent)]" : "border-[var(--border)]"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              {product.category && <Badge>{product.category}</Badge>}
              <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                {product.title}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold">${price.toFixed(2)}</span>
                {product.offerPrice && (
                  <span className="text-lg text-[var(--text-muted)] line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                Earn approximately {estimatedPoints} loyalty points with this purchase.
              </p>
            </div>

            <p className="leading-relaxed text-[var(--text-muted)]">
              {product.description || "Quality product from QuickQart."}
            </p>

            <div className="flex items-center justify-between border-y border-[var(--border)] py-4">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center gap-1 rounded-lg border border-[var(--border)]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 disabled:opacity-40"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="p-2 disabled:opacity-40"
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
              >
                {isAdding ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Adding…
                  </>
                ) : product.stock === 0 ? (
                  "Out of stock"
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    Add to cart
                  </>
                )}
              </Button>
              <Button
                variant={isWishlisted ? "primary" : "secondary"}
                onClick={() => toggleWishlist(product)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                <Truck size={18} />
                Fast shipping
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                <ShieldCheck size={18} />
                Authentic products
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                <RefreshCcw size={18} />
                30-day returns
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
