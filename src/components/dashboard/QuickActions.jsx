import Link from "next/link";
import { Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <Link href="/admin/products/create" className="action-card">
        <Package className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
        <h3>Add Product</h3>
        <p>Create a new listing</p>
      </Link>

      <Link href="/admin/orders" className="action-card">
        <ShoppingCart className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3>Manage Orders</h3>
        <p>View customer orders</p>
      </Link>

      <Link href="/admin/products" className="action-card">
        <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h3>Analytics</h3>
        <p>Track store performance</p>
      </Link>
    </div>
  );
}
