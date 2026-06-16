"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useWishlist } from "../../hooks/useWishlist";
import { useAuth } from "../../contexts/AuthContext";
import ProductCard from "../../Component/products/ProductCard";
import {
  Container,
  PageHeader,
  Button,
  EmptyState,
} from "../../Component/ui/primitives";

export default function WishlistPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/wishlist");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--bg)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  if (!user) return null;

  const items = Array.isArray(wishlistItems) ? wishlistItems : [];

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[var(--bg)] py-16">
        <Container>
          <EmptyState
            title="Your wishlist is empty"
            description="Save products you like and come back to them later."
            action={
              <Link href="/products">
                <Button>Browse products</Button>
              </Link>
            }
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] py-16">
      <Container>
        <PageHeader
          title="Wishlist"
          description={`${items.length} saved item${items.length === 1 ? "" : "s"}`}
        />

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {items.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
}
