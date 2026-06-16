export default function DashboardLoading() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)]"
        />
      ))}
    </div>
  );
}
