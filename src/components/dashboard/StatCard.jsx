export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="text-blue-600">{icon}</div>
    </div>
  );
}
