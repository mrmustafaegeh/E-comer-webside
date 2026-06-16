"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container, Card, Button, PageHeader } from "../../../Component/ui/primitives";

export default function OrderSuccessPage() {
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsProcessing(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-6">
      <Container className="max-w-lg">
        {isProcessing ? (
          <div className="flex flex-col items-center py-16">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)]">Confirming your order…</p>
          </div>
        ) : (
          <Card className="space-y-6 p-8 text-center md:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <Check size={32} />
            </div>
            <PageHeader
              title="Order placed"
              description="Thank you for your purchase. We will send you a confirmation email shortly."
              className="mb-0 text-center [&_h1]:text-2xl [&_p]:mx-auto"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/products">
                <Button>
                  Continue shopping
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="secondary">Back to home</Button>
              </Link>
            </div>
          </Card>
        )}
      </Container>
    </div>
  );
}
