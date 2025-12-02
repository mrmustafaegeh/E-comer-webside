import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === "admin@shop.com" && password === "123456") {
    return NextResponse.json({
      token: "fake-jwt-token",
      role: "admin",
    });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
