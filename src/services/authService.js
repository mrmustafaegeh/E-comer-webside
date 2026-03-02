import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function getUserByEmail(email) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  return user;
}

export async function getUserById(id) {
  if (!id) return null;
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
}

export async function updateProfile(userId, data) {
  const result = await prisma.user.update({
    where: { id: userId },
    data
  });
  return result;
}

export async function registerUser({ name, email, password, referredBy }) {
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Generate a unique referral code: First 3 chars of name + 4 random digits
  const refCode = `${name.substring(0, 3).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;

  const loyaltyHistory = referredBy ? [{
    type: "EARNED",
    points: 100,
    date: new Date().toISOString(),
    description: "Referral signup bonus 🎁"
  }] : [];

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "USER",
      loyaltyPoints: referredBy ? 100 : 0,
      loyaltyHistory,
      referralCode: refCode,
      referredBy: referredBy || null,
    }
  });

  return user;
}
