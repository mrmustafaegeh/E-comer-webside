import { prisma } from "@/lib/prisma";
import { Gift, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container, Card, Button, Badge } from "@/Component/ui/primitives";

async function getReferrer(code) {
  return await prisma.user.findUnique({
    where: { referralCode: code },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });
}

export default async function ReferralLandingPage({ params }) {
  const { code } = await params;
  const referrer = await getReferrer(code);

  if (!referrer) {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-6">
      <Container className="max-w-lg">
        <Card className="space-y-8 p-8 text-center md:p-12">
          <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--bg-subtle)]">
            {referrer.image ? (
              <Image src={referrer.image} alt={referrer.name} width={96} height={96} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-semibold text-[var(--text-muted)]">
                {referrer.name?.charAt(0)}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Badge>Referral invite</Badge>
            <h1 className="text-2xl font-semibold text-[var(--text)] md:text-3xl">
              {referrer.name} invited you to QuickQart
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Sign up and receive 100 bonus loyalty points.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="rounded-lg border border-[var(--border)] p-4">
              <ShieldCheck size={20} className="mb-2 text-[var(--text-muted)]" />
              <p className="text-xs font-medium text-[var(--text)]">Verified account</p>
            </div>
            <div className="rounded-lg border border-[var(--border)] p-4">
              <Zap size={20} className="mb-2 text-[var(--text-muted)]" />
              <p className="text-xs font-medium text-[var(--text)]">Bonus rewards</p>
            </div>
          </div>

          <Link href={`/auth/register?referredBy=${code}`} className="block">
            <Button className="w-full">
              <Gift size={16} />
              Create account
              <ArrowRight size={16} />
            </Button>
          </Link>

          <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
            Back to store
          </Link>
        </Card>
      </Container>
    </div>
  );
}
