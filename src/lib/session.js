import "server-only";
import { decodeJwt, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Sign } from "crypto";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-key-change-in-production"
);

const encodedKey = Buffer.from(secret).toString("base64");
console.log("🔑 JWT Secret Key (Base64):", encodedKey);

export const createSession = async (userId, email, roles) => {
  console.log("🛡️ Creating session for:", email);
  const expiresIn = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
  const session = await encrypt({ userId, expiresIn });

  cookies().set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  console.log("✅ Session created and cookie set for:", email);
};

class SessionPlayload {
  constructor(userId, email, roles, expiresIn) {
    this.userId = userId;
    this.email = email;
    this.roles = roles;
    this.expiresIn = expiresIn;
  }
}

export const encrypt = async (payload) => {
  return SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
};

export const verifySession = async () => {
  // await cookies() in Next.js 15+
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
  // await cookies() in Next.js 15+
  const cookieStore = await cookies();
  cookieStore.delete("session");
  console.log("✅ Session deleted");
};
