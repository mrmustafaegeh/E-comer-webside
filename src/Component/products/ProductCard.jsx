"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useAuth } from "../../contexts/AuthContext";
import { Heart, ShoppingCart, Loader2 } from "lucide-react";
import { useState, memo } from "react";
import { Button } from "@/Component/ui/primitives";
import { getProductImageUrl } from "@/lib/productImage";

function ProductCard({ product, showActions = true }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  const id = product._id || product.id;
  const title = product.title || product.name || "Product";
  const href = `/products/${product.slug || id}`;
  const price = Number(product.offerPrice || product.salePrice || product.price || 0);
  const compareAt = product.offerPrice || product.salePrice ? Number(product.price) : null;
  const category = product.categorySlug || product.category || "";
  const imageSrc = imageError ? "/images/product-placeholder.svg" : getProductImageUrl(product);

  const isWishlisted = (wishlistItems ?? []).some((item) => (item._id || item.id) === id);

  const discount =
    compareAt && compareAt > price
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart({
      ...product,
      id,
      name: title,
      price: product.offerPrice || product.salePrice || product.price,
      qty: 1,
    });
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/auth/login?redirect=/wishlist");
      return;
    }
    toggleWishlist(product);
  };

  return (
    <article className="group flex h-full flex-col">
      <Link href={href} className="block overflow-hidden rounded-xl bg-[var(--bg-subtle)]">
        <div className="relative aspect-square">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            onError={() => setImageError(true)}
          />
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-md bg-[var(--text)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
              -{discount}%
            </span>
          )}
          {showActions && (
            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-colors ${
                isWishlisted ? "text-red-600" : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={15} className={isWishlisted ? "fill-current" : ""} />
            </button>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        {category && (
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
            {category}
          </p>
        )}
        <Link
          href={href}
          className="mb-1 line-clamp-2 text-sm font-medium leading-snug text-[var(--text)] transition-colors hover:text-neutral-600"
        >
          {title}
        </Link>

        <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-1">
          <span className="text-sm font-semibold text-[var(--text)]">${price.toFixed(2)}</span>
          {compareAt && compareAt > price && (
            <span className="text-xs text-[var(--text-muted)] line-through">
              ${compareAt.toFixed(2)}
            </span>
          )}
        </div>

        {showActions && (
          <Button
            variant="secondary"
            className="mt-3 w-full text-xs"
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
          >
            {isAdding ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Adding…
              </>
            ) : product.stock === 0 ? (
              "Out of stock"
            ) : (
              <>
                <ShoppingCart size={14} />
                Add to cart
              </>
            )}
          </Button>
        )}
      </div>
    </article>
  );
}

export default memo(ProductCard);
