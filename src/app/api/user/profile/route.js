// src/app/api/user/profile/route.js
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs";
import { PrismaClient } from "@prisma/client";
import { redis } from "@/lib/auth/cache";
import { validatePhone, validateAge } from "@/lib/auth/security";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check Redis cache first
    const cacheKey = `user_profile:${kindeUser.id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return Response.json(JSON.parse(cached));
    }

    // Fetch from database
    const user = await prisma.user.findUnique({
      where: { kindeId: kindeUser.id },
      include: {
        permissions: {
          select: { name: true },
        },
        featureFlags: {
          select: { name: true, value: true },
        },
      },
    });

    if (!user) {
      // Auto-create user on first access
      const newUser = await prisma.user.create({
        data: {
          kindeId: kindeUser.id,
          email: kindeUser.email,
          name: kindeUser.given_name,
          lastLogin: new Date(),
          loginCount: 1,
        },
      });

      // Cache the new user
      await redis.setex(cacheKey, 300, JSON.stringify(newUser));

      return Response.json(newUser);
    }

    // Transform for response
    const responseData = {
      ...user,
      permissions: user.permissions.map((p) => p.name),
      featureFlags: user.featureFlags.reduce((acc, flag) => {
        acc[flag.name] = flag.value;
        return acc;
      }, {}),
    };

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(responseData));

    return Response.json(responseData);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate input
    const validationErrors = [];

    if (data.phone && !validatePhone(data.phone)) {
      validationErrors.push("Invalid phone number format");
    }

    if (data.age && !validateAge(data.age)) {
      validationErrors.push("Age must be between 18 and 100");
    }

    if (validationErrors.length > 0) {
      return Response.json({ errors: validationErrors }, { status: 400 });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { kindeId: kindeUser.id },
      data: {
        name: data.name,
        phone: data.phone,
        age: data.age ? parseInt(data.age) : null,
        isEmployee: data.isEmployee,
        salaryRange: data.salaryRange,
        department: data.department,
      },
    });

    // Clear cache
    await redis.del(`user_profile:${kindeUser.id}`);
    await redis.del(`user:${updatedUser.id}:permissions`);

    // Log the update
    await fetch("/api/user/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "PROFILE_UPDATE",
        userId: updatedUser.id,
        details: { fields: Object.keys(data) },
      }),
    });

    return Response.json({
      success: true,
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
