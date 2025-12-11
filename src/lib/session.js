import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-key-change-in-production"
);

export const createSession = async (userId, email, roles) => {
  console.log("🛡️ Creating session for:", email);

  try {
    const token = await new SignJWT({ userId, email, roles })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    console.log("✅ JWT token created");

    // Store token in cookie
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    console.log("✅ Session cookie set");
    return token;
  } catch (error) {
    console.error("❌ Error creating session:", error);
    throw error;
  }
};

export const verifySession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    console.log("❌ No session token found");
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    console.log("✅ Session verified for:", payload.email);
    return payload;
  } catch (e) {
    console.error("❌ Invalid token", e);
    return null;
  }
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  console.log("✅ Session deleted");
};
