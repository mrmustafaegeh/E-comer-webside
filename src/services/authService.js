import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export async function getUserByEmail(email) {
  const client = await clientPromise;
  const user = await client.db(process.env.MONGODB_DB).collection("users").findOne({ email: email.toLowerCase() });
  return user;
}

export async function getUserById(id) {
  if (!ObjectId.isValid(id)) return null;
  const client = await clientPromise;
  const user = await client.db(process.env.MONGODB_DB).collection("users").findOne({ _id: new ObjectId(id) });
  return user;
}

export async function updateProfile(userId, data) {
  const client = await clientPromise;
  const result = await client.db(process.env.MONGODB_DB).collection("users").findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result.value || result;
}

export async function registerUser({ name, email, password, referredBy }) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  
  const existing = await db.collection("users").findOne({ email: email.toLowerCase() });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Generate a unique referral code: First 3 chars of name + 4 random digits
  const refCode = `${name.substring(0, 3).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;

  const user = {
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "user",
    loyaltyPoints: referredBy ? 100 : 0, // 100 bonus points for being referred
    loyaltyHistory: referredBy ? [{
      type: "EARNED",
      points: 100,
      date: new Date(),
      description: "Referral signup bonus 🎁"
    }] : [],
    referralCode: refCode,
    referredBy: referredBy || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("users").insertOne(user);
  
  // If referred, we could also reward the referrer now or later (e.g. after first purchase)
  // For this simplified version, let's just log the link.
  
  return { ...user, id: result.insertedId.toString() };
}
