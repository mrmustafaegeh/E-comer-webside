export default function OrderTable({ orders }) {
  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="border-b bg-gray-100 text-left text-sm font-medium text-gray-700">
            <th className="p-3">Order ID</th>
            <th className="p-3">User</th>
            <th className="p-3">Status</th>
            <th className="p-3">Total</th>
            <th className="p-3">Items</th>
            <th className="p-3">Date</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders?.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{order.id}</td>
              <td className="p-3">{order.user?.email}</td>
              <td className="p-3">{order.status}</td>
              <td className="p-3">${order.total}</td>

              <td className="p-3">
                {Array.isArray(order.items) ? order.items.length : 0} items
              </td>

              <td className="p-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>

              <td className="p-3 space-x-2">
                <button className="rounded bg-blue-500 px-3 py-1 text-sm text-white">
                  Update Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
