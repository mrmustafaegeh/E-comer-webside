// src/lib/auth/cache.js
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export class AuthCache {
  // Cache user permissions
  static async setUserPermissions(userId, permissions, ttl = 300) {
    const key = `user:${userId}:permissions`;
    await redis.setex(key, ttl, JSON.stringify(permissions));
  }

  static async getUserPermissions(userId) {
    const key = `user:${userId}:permissions`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Cache user profile
  static async setUserProfile(userId, profile, ttl = 300) {
    const key = `user_profile:${userId}`;
    await redis.setex(key, ttl, JSON.stringify(profile));
  }

  static async getUserProfile(userId) {
    const key = `user_profile:${userId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Rate limiting
  static async checkRateLimit(identifier, limit = 100, window = 60) {
    const key = `rate_limit:${identifier}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, window);
    }

    return current > limit;
  }

  // Session management
  static async setSession(sessionId, data, ttl = 3600) {
    const key = `session:${sessionId}`;
    await redis.setex(key, ttl, JSON.stringify(data));
  }

  static async getSession(sessionId) {
    const key = `session:${sessionId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async invalidateUserCache(userId) {
    const keys = await redis.keys(`*:${userId}:*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
