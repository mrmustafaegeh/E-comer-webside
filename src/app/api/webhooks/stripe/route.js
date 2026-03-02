import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("❌ Stripe or Webhook Secret is missing");
    return new NextResponse("Service Unavailable", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("Stripe-Signature");

  if (!signature) {
    return new NextResponse("No signature provided", {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(`❌ Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const session = event.data.object;

  if (event.type === "checkout.session.completed") {
    try {
      const pendingCheckout = await prisma.pendingCheckout.findUnique({
        where: { sessionId: session.id }
      });

      const userId =
        pendingCheckout?.userId ||
        session.client_reference_id ||
        "guest";

      let validUserId = null;
      if (userId && userId !== "guest") {
        const u = await prisma.user.findUnique({ where: { id: userId } });
        if (u) validUserId = u.id;
      }

      await prisma.order.create({
        data: {
          userId: validUserId, // Can be null for guest checkout
          paymentIntentId: session.id,
          totalAmount: session.amount_total / 100,
          subtotal: session.amount_total / 100,
          status: "PROCESSING",
          paymentStatus: "COMPLETED",
          items: [], // TODO: Populated via session metadata if possible
          deliveryAddress: session.customer_details || null
        }
      });

      if (pendingCheckout) {
        await prisma.pendingCheckout.delete({
            where: { id: pendingCheckout.id }
        });
      }


    } catch (dbError) {
      console.error("❌ Database error during order creation:", dbError);
      return new NextResponse("Database Error", {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      });
    }
  }

  return new NextResponse(
    JSON.stringify({ received: true }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}
