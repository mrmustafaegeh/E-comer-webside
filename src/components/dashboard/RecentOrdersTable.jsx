export default function RecentOrdersTable({ orders }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-3 text-left">Order ID</th>
            <th className="py-3 text-left">Customer</th>
            <th className="py-3 text-left">Date</th>
            <th className="py-3 text-left">Total</th>
            <th className="py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {orders?.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="py-3">{order.id}</td>
              <td className="py-3">{order.customerName || "Unknown"}</td>
              <td className="py-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3">${order.totalPrice.toFixed(2)}</td>
              <td className="py-3">
                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
