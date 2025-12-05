export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow rounded-xl">Total Products</div>
        <div className="bg-white p-6 shadow rounded-xl">Total Orders</div>
        <div className="bg-white p-6 shadow rounded-xl">Total Users</div>
      </div>
    </div>
  );
}
