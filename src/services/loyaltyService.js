/**
 * Loyalty Service - Handles points calculation and allocation
 */

// Configuration for active boosters
export const ACTIVE_BOOSTERS = [
  {
    category: "Electronics",
    multiplier: 2,
    message: "2x points on all Electronics!",
    validUntil: "2026-03-31" // End of month
  }
];

// Loyalty Tiers Configuration
export const LOYALTY_TIERS = [
  { name: "Bronze", minPoints: 0, multiplier: 1.0, color: "text-orange-500", nextTier: "Silver", threshold: 500 },
  { name: "Silver", minPoints: 500, multiplier: 1.1, color: "text-gray-400", nextTier: "Gold", threshold: 2000 },
  { name: "Gold", minPoints: 2000, multiplier: 1.25, color: "text-yellow-500", nextTier: "Platinum", threshold: 5000 },
  { name: "Platinum", minPoints: 5000, multiplier: 1.5, color: "text-purple-500", nextTier: "None", threshold: Infinity }
];

export function getUserTier(points) {
  return LOYALTY_TIERS.reduce((prev, curr) => (points >= curr.minPoints ? curr : prev));
}

/**
 * Calculates points earned for an order
 * @param {Array} products - List of products in the order
 * @param {number} total - Total order amount
 * @param {number} userPoints - Current points of the user to determine tier
 */
export function calculatePoints(products, total, userPoints = 0) {
  const tier = getUserTier(userPoints);
  let basePoints = Math.floor(total / 10); // 1 point per $10 spent
  let bonusPoints = 0;

  // Apply category boosters if any
  products.forEach(p => {
    const activeBooster = ACTIVE_BOOSTERS.find(b => b.category === p.category);
    if (activeBooster) {
      const productPrice = Number(p.price) || 0;
      const productPoints = Math.floor(productPrice / 10);
      bonusPoints += (productPoints * (activeBooster.multiplier - 1));
    }
  });

  // Apply Tier Multiplier to total points
  const totalEarned = Math.floor((basePoints + bonusPoints) * tier.multiplier);
  return totalEarned;
}

/**
 * Adds points to a user's account
 */
export async function allocatePoints(userId, points) {
  if (typeof window !== "undefined") return; // Safety check
  const clientPromise = (await import("@/lib/mongodb")).default;
  const { ObjectId } = await import("mongodb");

  if (!points || points <= 0 || !userId) return;

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  
  await db.collection("users").updateOne(
    { _id: typeof userId === 'string' ? new ObjectId(userId) : userId },
    { 
      $inc: { loyaltyPoints: points },
      $push: { 
        loyaltyHistory: {
          type: "EARNED",
          points,
          date: new Date(),
          description: "Order completed"
        }
      }
    }
  );

  // Check for Referral Reward (First Order only)
  const user = await db.collection("users").findOne({ _id: typeof userId === 'string' ? new ObjectId(userId) : userId });
  if (user?.referredBy && !user?.awardedReferrer) {
    const orderCount = await db.collection("orders").countDocuments({ userId: userId.toString() });
    if (orderCount === 1) {
      // Award 500 points to the referrer
      const referrer = await db.collection("users").findOne({ referralCode: user.referredBy });
      if (referrer) {
        await db.collection("users").updateOne(
          { _id: referrer._id },
          { 
            $inc: { 
              loyaltyPoints: 500,
              successfulReferrals: 1
            },
            $push: { 
              loyaltyHistory: {
                type: "REFERRAL_BONUS",
                points: 500,
                date: new Date(),
                description: `Successfully referred ${user.name}!`
              }
            }
          }
        );
        // Mark as awarded to prevent double awarding
        await db.collection("users").updateOne(
          { _id: user._id },
          { $set: { awardedReferrer: true } }
        );
      }
    }
  }
}

/**
 * Get top referrers for the leaderboard
 */
export async function getLeaderboard() {
  if (typeof window !== "undefined") return []; // Safety check
  const clientPromise = (await import("@/lib/mongodb")).default;
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  
  const topUsers = await db.collection("users")
    .find({}, { 
      projection: { 
        name: 1, 
        loyaltyPoints: 1, 
        successfulReferrals: 1,
        image: 1
      } 
    })
    .sort({ successfulReferrals: -1, loyaltyPoints: -1 })
    .limit(5)
    .toArray();
    
  return topUsers.map(u => ({
    ...u,
    id: u._id.toString(),
    successfulReferrals: u.successfulReferrals || 0,
    loyaltyPoints: u.loyaltyPoints || 0
  }));
}
