// src/lib/auth/audit.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AuditLogger {
  static async logEvent(event) {
    try {
      // Don't block the main thread
      setTimeout(async () => {
        try {
          await prisma.auditLog.create({
            data: {
              userId: event.userId,
              action: event.action,
              resource: event.resource,
              details: event.details || {},
              ipAddress: event.ip,
              userAgent: event.userAgent,
              timestamp: new Date(),
            },
          });

          // Also send to external monitoring service if configured
          if (process.env.MONITORING_WEBHOOK) {
            await fetch(process.env.MONITORING_WEBHOOK, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                event: event.action,
                userId: event.userId,
                timestamp: new Date().toISOString(),
                severity: event.severity || "INFO",
              }),
            });
          }
        } catch (error) {
          console.error("Audit logging failed:", error);
        }
      }, 0);
    } catch (error) {
      console.error("Failed to queue audit log:", error);
    }
  }

  static async getEvents(userId, limit = 50, offset = 0) {
    return await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: limit,
      skip: offset,
    });
  }
}

// Convenience function for security events
export async function logSecurityEvent(event) {
  await AuditLogger.logEvent({
    ...event,
    action: `SECURITY_${event.action}`,
  });
}
