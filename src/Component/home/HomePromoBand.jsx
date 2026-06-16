import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Button } from "@/Component/ui/primitives";

export default function HomePromoBand() {
  return (
    <section className="section-dark border-t border-[var(--border-on-dark)]">
      <Container className="flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center md:py-14">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--text-muted-on-dark)]">
            Free shipping over $75
          </p>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--text-on-dark)] md:text-3xl">
            Find your next favorite product
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted-on-dark)] md:text-base">
            Clear pricing, secure checkout, and support when you need it.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/products">
            <Button className="gap-2 bg-white text-neutral-900 hover:bg-neutral-100">
              Shop all products
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="secondary"
              className="border-[var(--border-on-dark)] bg-transparent text-[var(--text-on-dark)] hover:bg-[var(--bg-dark-elevated)]"
            >
              Contact us
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
