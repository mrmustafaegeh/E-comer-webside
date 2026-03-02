import { prisma } from "@/lib/prisma";
import { calculatePoints, allocatePoints } from "./loyaltyService";

export async function createOrder(orderData) {
  const order = await prisma.order.create({
    data: {
      userId: orderData.userId,
      items: orderData.products || orderData.items || [],
      subtotal: orderData.totalPrice || orderData.subtotal || 0,
      totalAmount: orderData.totalPrice || orderData.totalAmount || 0,
      status: "PENDING",
      paymentStatus: "PENDING",
      deliveryAddress: orderData.deliveryAddress || null,
    }
  });

  // ✅ Allocate points with tier awareness
  try {
    const user = await prisma.user.findUnique({ where: { id: orderData.userId } });
    const currentPoints = user?.loyaltyPoints || 0;
    const productsArray = orderData.products || orderData.items || [];
    const points = calculatePoints(productsArray, orderData.totalPrice || orderData.totalAmount || 0, currentPoints);
    await allocatePoints(orderData.userId, points);

    // Reward logic is already handled by allocatePoints within the loyaltyService,
    // so we don't need to rebuild query/increment here.
  } catch (err) {
    console.error("Loyalty points error:", err);
  }

  return order;
}

export async function getOrdersByUser(userId) {
  const docs = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  
  return docs;
}

export async function getOrderById(id) {
  try {
    return await prisma.order.findUnique({ where: { id } });
  } catch (err) {
    return null;
  }
}
