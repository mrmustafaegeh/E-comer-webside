"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../contexts/AuthContext";
import { post } from "../../services/api";
import { ArrowLeft, CreditCard, Truck, ArrowRight, Loader2 } from "lucide-react";
import {
  Container,
  PageHeader,
  Card,
  Button,
  Input,
  Select,
  Alert,
  FormField,
} from "../../Component/ui/primitives";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--text-muted)]" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, router]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => Number(cartTotal) || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      setError("Please sign in to complete checkout.");
      setLoading(false);
      return;
    }

    try {
      if (formData.paymentMethod === "stripe") {
        const response = await post("/checkout/session", {
          items: cartItems.map((item) => ({
            id: item.id || item._id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            imgSrc: item.imgSrc || item.image,
          })),
          email: user?.email,
        });

        if (response?.url) {
          window.location.href = response.url;
          return;
        }
        throw new Error("Could not start payment session.");
      }

      const orderPayload = {
        userId: user.id || user._id,
        products: cartItems.map((item) => ({
          productId: item.id || item._id,
          name: item.name,
          quantity: item.qty,
          price: item.price,
          image: item.imgSrc || item.image,
        })),
        totalPrice: calculateTotal(),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        status: "pending",
      };

      await post("/orders", orderPayload);
      clearCart();
      router.push("/orders/success");
    } catch (err) {
      setError(err.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-[var(--bg)] py-12 md:py-16">
      <Container>
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          <ArrowLeft size={16} />
          Back to cart
        </button>

        <PageHeader title="Checkout" description="Complete your order details below." />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Card className="rounded-xl p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-lg font-semibold">Shipping details</h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                <FormField label="Full name" htmlFor="fullName">
                  <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleInputChange} placeholder="Jane Doe" />
                </FormField>
                <FormField label="Address" htmlFor="address">
                  <Input id="address" name="address" required value={formData.address} onChange={handleInputChange} placeholder="123 Main Street" />
                </FormField>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="City" htmlFor="city">
                    <Input id="city" name="city" required value={formData.city} onChange={handleInputChange} />
                  </FormField>
                  <FormField label="ZIP code" htmlFor="zipCode">
                    <Input id="zipCode" name="zipCode" required value={formData.zipCode} onChange={handleInputChange} />
                  </FormField>
                </div>
                <FormField label="Country" htmlFor="country">
                  <Select id="country" name="country" required value={formData.country} onChange={handleInputChange}>
                    <option value="">Select country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </Select>
                </FormField>
              </form>
            </Card>

            <Card className="rounded-xl p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-lg font-semibold">Payment method</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                    formData.paymentMethod === "cod"
                      ? "border-[var(--accent)] bg-[var(--bg-subtle)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleInputChange} className="sr-only" />
                  <Truck size={24} />
                  <div>
                    <p className="font-medium">Cash on delivery</p>
                    <p className="text-xs text-[var(--text-muted)]">Pay when your order arrives</p>
                  </div>
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                    formData.paymentMethod === "stripe"
                      ? "border-[var(--accent)] bg-[var(--bg-subtle)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  <input type="radio" name="paymentMethod" value="stripe" checked={formData.paymentMethod === "stripe"} onChange={handleInputChange} className="sr-only" />
                  <CreditCard size={24} />
                  <div>
                    <p className="font-medium">Card (Stripe)</p>
                    <p className="text-xs text-[var(--text-muted)]">Secure online payment</p>
                  </div>
                </label>
              </div>
            </Card>
          </div>

          <Card className="h-fit space-y-6 rounded-xl p-6 shadow-sm lg:sticky lg:top-24 sm:p-8">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <div className="max-h-64 space-y-4 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--bg-subtle)]">
                    <Image
                      src={item.imgSrc || item.image || "/images/product-placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">Qty {item.qty}</p>
                  </div>
                  <p className="text-sm font-medium">${(Number(item.price) * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-[var(--border)] pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Subtotal</span>
                <span>${Number(cartTotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Shipping</span>
                <span>Free</span>
              </div>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-4 text-lg font-semibold">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            {error && <Alert variant="error">{error}</Alert>}
            {!user && (
              <Alert variant="info">Sign in to place your order.</Alert>
            )}
            <Button type="submit" form="checkout-form" className="w-full py-3" disabled={loading || !user}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Processing…
                </>
              ) : (
                <>
                  Place order
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </Card>
        </div>
      </Container>
    </div>
  );
}
