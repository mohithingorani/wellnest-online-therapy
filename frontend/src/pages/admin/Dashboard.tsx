import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import type { Stats, Activity } from "../../services/adminApi";
import { useToast } from "../../components/admin/Toast";

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

function KpiCard({ label, value, sub, icon, accent = false }: {
  label: string; value: number | string; sub?: string; icon: React.ReactNode; accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-3 ${accent ? "bg-[#4a6b52] border-[#3a5540] text-white" : "bg-[#fffefb] border-[#e4dccb]"}`}>
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? "bg-white/20" : "bg-[#f0ece2]"}`}>
          <span className={accent ? "text-white" : "text-[#4a6b52]"}>{icon}</span>
        </div>
      </div>
      <div>
        <div className={`font-display font-semibold text-[2rem] leading-none ${accent ? "text-white" : "text-fg-strong"}`}>
          {typeof value === "number" ? fmt(value) : value}
        </div>
        <div className={`mt-1 text-sm font-medium ${accent ? "text-white/70" : "text-fg-muted"}`}>{label}</div>
        {sub && <div className={`text-[11px] mt-0.5 ${accent ? "text-white/50" : "text-fg-muted/60"}`}>{sub}</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    Promise.all([adminApi.getStats(), adminApi.getActivity()])
      .then(([s, a]) => {
        if (s.success) setStats(s.data);
        if (a.success) setActivity(a.data);
      })
      .catch(() => addToast("Failed to load dashboard", "error"))
      .finally(() => setLoading(false));
  }, [addToast]);

  if (loading) return (
    <div>
      <div className="h-8 w-40 bg-[#e4dccb] rounded animate-pulse mb-6" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-[#fffefb] rounded-2xl border border-[#e4dccb] p-5 h-28 animate-pulse" />
        ))}
      </div>
    </div>
  );

  const kpis = [
    { label: "Total Users",       value: stats?.totalUsers ?? 0,          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>, accent: true },
    { label: "Signed up today",    value: stats?.todaySignups ?? 0,        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>, sub: "new accounts" },
    { label: "Waitlist",           value: stats?.waitlistCount ?? 0,       icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, sub: "therapist requests" },
    { label: "Therapists",         value: stats?.totalTherapists ?? 0,     icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: "Assessments taken",  value: stats?.assessmentCount ?? 0,     icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
    { label: "Journal entries",    value: stats?.journalCount ?? 0,        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
    { label: "Active sessions",    value: stats?.activeSessions ?? 0,      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, sub: "logged in now" },
    { label: "Seeds distributed",  value: stats?.totalSeedsDistributed ?? 0, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 4 15 4 9a8 8 0 0116 0c0 6-8 12-8 12z" /></svg> },
  ];

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl font-bold text-fg-strong font-display">Dashboard</h1>
        <span className="text-sm text-fg-muted">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</span>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <KpiCard key={k.label} label={k.label} value={k.value} sub={k.sub} icon={k.icon} accent={k.accent} />
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-[#fffefb] rounded-2xl border border-[#e4dccb] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e4dccb] flex items-center justify-between">
          <h2 className="font-semibold text-fg-strong">Recent Activity</h2>
          <span className="text-xs text-fg-muted">{activity.length} entries</span>
        </div>
        <div className="divide-y divide-[#e4dccb]">
          {activity.length === 0 ? (
            <div className="px-6 py-12 text-center text-fg-muted">No recent activity</div>
          ) : activity.map((item, i) => (
            <div key={i} className="px-6 py-3.5 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                item.type === "therapist" ? "bg-[#4a6b52]/10 text-[#4a6b52]" : "bg-[#d97a58]/10 text-[#d97a58]"
              }`}>
                {item.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-fg-strong truncate">{item.name}</div>
                {item.email && <div className="text-xs text-fg-muted truncate">{item.email}</div>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  item.type === "therapist" ? "bg-[#4a6b52]/10 text-[#4a6b52]" : "bg-[#d97a58]/10 text-[#d97a58]"
                }`}>{item.type}</span>
                <span className="text-xs text-fg-muted">{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
