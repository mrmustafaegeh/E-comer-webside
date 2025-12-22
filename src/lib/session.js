import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretString = process.env.JWT_SECRET;
if (!secretString) {
  // This will show in Vercel logs if you forgot env var
  console.error("❌ Missing JWT_SECRET env var");
}
const secret = new TextEncoder().encode(
  secretString || "dev-secret-key-change-in-production"
);

export const encrypt = async (payload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
};

export const createSession = async (userId, email, roles = []) => {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  const token = await encrypt({ userId, email, roles, expiresAt });

  cookies().set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // ✅ good default when same domain (your vercel site)
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const verifySession = async () => {
  const token = cookies().get("session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);

    if (payload?.expiresAt && payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch (e) {
    console.error("❌ Invalid session token:", e?.message || e);
    return null;
  }
};

export const deleteSession = async () => {
  cookies().delete("session");
};

export const getCurrentUser = async () => {
  const session = await verifySession();
  if (!session) return null;

  return {
    userId: session.userId,
    email: session.email,
    roles: session.roles || [],
  };
};
