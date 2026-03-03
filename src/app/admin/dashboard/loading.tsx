export default function DashboardLoading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-[#0f1117]">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-6 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>
      <h2 className="text-white font-sora font-semibold tracking-tight text-xl mb-1">Initializing Protocol</h2>
      <p className="text-blue-400 font-mono text-[10px] uppercase tracking-widest animate-pulse">Establishing secure link...</p>
    </div>
  );
}
