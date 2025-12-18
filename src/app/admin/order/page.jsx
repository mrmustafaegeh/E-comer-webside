"use client";

import { useEffect, useState } from "react";
import OrderTable from "@/components/dashboard/OrderTable";

export default function DashboardOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/admin/admin-orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return <OrderTable orders={orders} />;
}
