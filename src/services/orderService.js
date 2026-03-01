import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { transformOrder } from "@/lib/transformers";
import { calculatePoints, allocatePoints } from "./loyaltyService";

export async function createOrder(orderData) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  
  const order = {
    ...orderData,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("orders").insertOne(order);

  // ✅ Allocate points with tier awareness
  try {
    const user = await db.collection("users").findOne({ _id: typeof orderData.userId === 'string' ? new ObjectId(orderData.userId) : orderData.userId });
    const currentPoints = user?.loyaltyPoints || 0;
    const points = calculatePoints(orderData.products || [], orderData.totalPrice || 0, currentPoints);
    await allocatePoints(orderData.userId, points);

    // ✅ Reward referrer if this is the first order
    if (user?.referredBy) {
        const orderCount = await db.collection("orders").countDocuments({ userId: orderData.userId.toString() });
        if (orderCount === 1) { // This is the first order (just inserted)
            const referrer = await db.collection("users").findOne({ referralCode: user.referredBy });
            if (referrer) {
                const bonusPoints = 500;
                await db.collection("users").updateOne(
                    { _id: referrer._id },
                    { 
                        $inc: { 
                            loyaltyPoints: bonusPoints,
                            successfulReferrals: 1
                        },
                        $push: {
                            loyaltyHistory: {
                                type: "EARNED",
                                points: bonusPoints,
                                date: new Date(),
                                description: `Referral Bonus: ${user.name}'s first order! 🚀`
                            }
                        }
                    }
                );
            }
        }
    }
  } catch (err) {
    console.error("Loyalty points error:", err);
  }

  return { ...order, id: result.insertedId.toString() };
}

export async function getOrdersByUser(userId) {
  const client = await clientPromise;
  const docs = await client.db(process.env.MONGODB_DB)
    .collection("orders")
    .find({ userId: userId.toString() })
    .sort({ createdAt: -1 })
    .toArray();
  
  return docs.map(transformOrder);
}

export async function getOrderById(id) {
  if (!ObjectId.isValid(id)) return null;
  const client = await clientPromise;
  const doc = await client.db(process.env.MONGODB_DB)
    .collection("orders")
    .findOne({ _id: new ObjectId(id) });
  
  return transformOrder(doc);
}
