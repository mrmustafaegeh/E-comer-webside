// src/app/api/user/permissions/route.js
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs";
import { PrismaClient } from "@prisma/client";
import { redis } from "@/lib/auth/cache";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { kindeId: kindeUser.id },
      include: {
        permissions: {
          select: { name: true },
        },
      },
    });

    if (!user) {
      return Response.json({ permissions: [] });
    }

    // Calculate permissions based on role
    let permissions = user.permissions.map((p) => p.name);

    // Add role-based permissions
    switch (user.role) {
      case "SUPER_ADMIN":
        permissions.push("admin_access", "user_management", "system_settings");
        break;
      case "ADMIN":
        permissions.push("admin_access", "user_management");
        break;
      case "MODERATOR":
        permissions.push("content_moderation", "user_reports");
        break;
      case "DEPARTMENT_LEAD":
        permissions.push("department_management", "team_oversight");
        break;
    }

    // Add department-specific permissions
    if (user.department) {
      permissions.push(`${user.department.toLowerCase()}_access`);
    }

    return Response.json({
      permissions: [...new Set(permissions)], // Remove duplicates
      role: user.role,
      department: user.department,
    });
  } catch (error) {
    console.error("Permissions fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
