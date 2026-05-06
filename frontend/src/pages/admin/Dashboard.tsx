import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import type { Stats, Activity } from "../../services/adminApi";
import { StatsCard } from "../../components/admin/StatsCard";
import { TableSkeleton } from "../../components/admin/Skeleton";
import { useToast } from "../../components/admin/Toast";

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    Promise.all([adminApi.getStats(), adminApi.getActivity()])
      .then(([statsRes, activityRes]) => {
        if (statsRes.success) setStats(statsRes.data);
        if (activityRes.success) setActivity(activityRes.data);
      })
      .catch(() => {
        addToast("Failed to load dashboard data", "error");
      })
      .finally(() => setLoading(false));
  }, [addToast]);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white font-playfair mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#111111] rounded-2xl p-6 border border-[#1f1f1f]">
              <div className="h-4 w-24 bg-[#1f1f1f] rounded animate-pulse mb-3" />
              <div className="h-8 w-16 bg-[#1f1f1f] rounded animate-pulse" />
            </div>
          ))}
        </div>
        <TableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: "Total Therapists",
      value: stats?.totalTherapists || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Active Sessions",
      value: stats?.activeSessions || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Pending Approvals",
      value: stats?.pendingApprovals || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white font-playfair mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <StatsCard key={idx} title={stat.title} value={stat.value} icon={stat.icon} variant={idx === 3 ? "warning" : "default"} />
        ))}
      </div>

      <div className="bg-[#111111] rounded-2xl border border-[#1f1f1f] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1f1f1f]">
          <h2 className="text-lg font-semibold text-white font-nunito">Recent Activity</h2>
        </div>
        <div className="divide-y divide-[#1f1f1f]">
          {activity.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 font-nunito">No recent activity</div>
          ) : (
            activity.map((item, idx) => (
              <div key={idx} className="px-6 py-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.type === "therapist" ? "bg-[#47898E]/10 text-[#47898E]" : "bg-[#E77D3C]/10 text-[#E77D3C]"
                }`}>
                  {item.type === "therapist" ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white font-nunito">{item.name}</div>
                  <div className="text-xs text-gray-500 font-nunito">
                    {item.type === "user" && item.email}
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-nunito">
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}