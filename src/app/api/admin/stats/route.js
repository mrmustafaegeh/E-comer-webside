import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (!user.isAdmin && !user.roles?.includes("ADMIN"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 1. Total Revenue & Orders
    const stats = await prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
      _count: {
        id: true,
      },
    });

    // 2. Entity Counts
    const [productsCount, usersCount, pendingOrders, processingOrders] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count({ where: { status: "processing" } }),
    ]);

    // 3. Recent Activity (Orders)
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    const formattedActivities = recentOrders.map((order) => ({
      id: order.id,
      type: "order",
      user: order.user?.email || "Guest",
      action: "placed an order",
      amount: "$" + (order.totalPrice || 0).toFixed(2),
      time: order.createdAt,
    }));

    // 4. Monthly Revenue (Simplified for Prisma)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const ordersLast6Months = await prisma.order.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
    });

    const monthlyMap = {};
    ordersLast6Months.forEach((order) => {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = {
          month: date.toLocaleString("default", { month: "short" }),
          revenue: 0,
          orders: 0,
          sortKey: date.getTime(),
        };
      }
      monthlyMap[key].revenue += order.totalPrice;
      monthlyMap[key].orders += 1;
    });

    const formattedMonthlyData = Object.values(monthlyMap).sort((a, b) => a.sortKey - b.sortKey);

    // 5. Top Products (Simplified - fetching from the last 100 orders)
    // Note: Items is a JSON field, so we process in memory for now
    const recentItemsOrders = await prisma.order.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
      select: { items: true },
    });

    const productSales = {};
    recentItemsOrders.forEach(order => {
      const items = Array.isArray(order.items) ? order.items : [];
      items.forEach(item => {
        const id = item.productId || item.id;
        if (!id) return;
        if (!productSales[id]) {
          productSales[id] = { id, name: item.name, sales: 0, revenue: 0 };
        }
        productSales[id].sales += item.quantity || item.qty || 1;
        productSales[id].revenue += (item.price || 0) * (item.quantity || item.qty || 1);
      });
    });

    const topProductsIds = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map(p => p.id);

    const dbProducts = await prisma.product.findMany({
      where: { id: { in: topProductsIds } },
      select: { id: true, image: true, stock: true },
    });

    const topProductsData = topProductsIds.map(id => {
      const sale = productSales[id];
      const dbP = dbProducts.find(p => p.id === id);
      return {
        ...sale,
        image: dbP?.image || null,
        stock: dbP?.stock || 0,
      };
    });

    const response = {
      revenue: stats._sum.totalPrice || 0,
      orders: stats._count.id || 0,
      products: productsCount,
      users: usersCount,
      monthlyData: formattedMonthlyData,
      topProducts: topProductsData,
      activities: formattedActivities,
      orderStats: {
        pending: pendingOrders,
        processing: processingOrders,
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to calculate stats" },
      { status: 500 }
    );
  }
}
