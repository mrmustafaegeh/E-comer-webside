export default function ProductTable({ products }) {
  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="border-b bg-gray-100 text-left text-sm font-medium text-gray-700">
            <th className="p-3">ID</th>
            <th className="p-3">Image</th>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products?.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{product.id}</td>

              <td className="p-3">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-12 w-12 rounded object-cover"
                />
              </td>

              <td className="p-3">{product.title}</td>
              <td className="p-3">{product.category}</td>

              <td className="p-3">${product.price}</td>
              <td className="p-3">{product.stock}</td>

              <td className="p-3 space-x-2">
                <button className="rounded bg-blue-500 px-3 py-1 text-sm text-white">
                  Edit
                </button>
                <button className="rounded bg-red-500 px-3 py-1 text-sm text-white">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
