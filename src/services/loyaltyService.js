/**
 * Loyalty Service - Handles points calculation and allocation
 */
import { prisma } from "@/lib/prisma";

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
  if (!points || points <= 0 || !userId) return;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      loyaltyPoints: { increment: points },
      loyaltyHistory: { push: {
        type: "EARNED",
        points,
        date: new Date().toISOString(),
        description: "Order completed"
      }}
    }
  });

  // Check for Referral Reward (First Order only)
  if (user?.referredBy && !user?.awardedReferrer) {
    const orderCount = await prisma.order.count({ where: { userId } });
    if (orderCount === 1) {
      // Award 500 points to the referrer
      const referrer = await prisma.user.findUnique({ where: { referralCode: user.referredBy } });
      if (referrer) {
        await prisma.user.update({
          where: { id: referrer.id },
          data: {
            loyaltyPoints: { increment: 500 },
            successfulReferrals: { increment: 1 },
            loyaltyHistory: { push: {
              type: "REFERRAL_BONUS",
              points: 500,
              date: new Date().toISOString(),
              description: `Successfully referred ${user.name}!`
            }}
          }
        });
        
        // Mark as awarded to prevent double awarding
        await prisma.user.update({
          where: { id: user.id },
          data: { awardedReferrer: true }
        });
      }
    }
  }
}

/**
 * Get top referrers for the leaderboard
 */
export async function getLeaderboard() {
  if (typeof window !== "undefined") return []; // Safety check
  
  const topUsers = await prisma.user.findMany({
    orderBy: [
      { successfulReferrals: 'desc' },
      { loyaltyPoints: 'desc' }
    ],
    take: 5,
    select: {
      id: true,
      name: true,
      loyaltyPoints: true,
      successfulReferrals: true,
      image: true
    }
  });
    
  return topUsers;
}
