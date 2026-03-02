import "server-only";

import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

// ------------------------
// Helpers
// ------------------------

export async function findUserByEmail(email) {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  if (!normalizedEmail) return null;
  return prisma.user.findUnique({ where: { email: normalizedEmail } });
}

export async function createUser(name, email, password) {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  const safeName = String(name || "").trim();

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: safeName,
      email: normalizedEmail,
      password: hashedPassword,
      role: "USER"
    }
  });

  return {
    ...newUser,
    id: newUser.id,
    _id: newUser.id,
  };
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
