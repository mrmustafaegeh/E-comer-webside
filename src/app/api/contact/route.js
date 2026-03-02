import { validateRequest, forbiddenResponse, rateLimit, rateLimitResponse, getClientIp } from "@/lib/security";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

export async function POST(request) {
  try {
    const isValidRequest = await validateRequest(request);
    if (!isValidRequest) return forbiddenResponse();

    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 3, "1 h"); 
    if (!success) return rateLimitResponse();

    const body = await request.json();
    const validation = contactSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, email, message } = validation.data;

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        message,
        read: false,
      }
    });

    return NextResponse.json(
      { message: "Message sent successfully", id: contact.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("CONTACT POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user || (!user.isAdmin && !user.roles?.includes("ADMIN"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const messages = await prisma.contact.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (err) {
    console.error("CONTACT GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
