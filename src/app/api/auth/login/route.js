import { NextResponse } from "next/server";
import { loginAction } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();

    // This matches your current loginAction signature expectation:
    // loginAction(_, formDataLike)
    const result = await loginAction(null, {
      get: (key) => body?.[key],
    });

    if (!result?.success) {
      return NextResponse.json(
        { error: result?.message || "Invalid email or password" },
        { status: 401 }
      );
    }

    // createSession should happen inside loginAction
    return NextResponse.json(
      { success: true, user: result.user },
      { status: 200 }
    );
  } catch (error) {
    // ✅ This is what you need to debug on Vercel
    console.error("❌ Login API crashed:", error);

    // Don't leak internal info to users in prod
    return NextResponse.json(
      {
        error: "An error occurred during login",
        details:
          process.env.NODE_ENV === "development"
            ? String(error?.message || error)
            : undefined,
      },
      { status: 500 }
    );
  }
}
