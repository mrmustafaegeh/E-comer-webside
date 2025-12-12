export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  change,
  positive,
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>

          <div className="flex items-center mt-2">
            {positive ? (
              <span className="text-green-600 text-xs font-semibold">
                {change}
              </span>
            ) : (
              <span className="text-red-600 text-xs font-semibold">
                {change}
              </span>
            )}
          </div>
        </div>

        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
