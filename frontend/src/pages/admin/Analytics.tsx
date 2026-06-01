import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import type { Analytics as AnalyticsData } from "../../services/adminApi";
import { StatsCard } from "../../components/admin/StatsCard";
import { useToast } from "../../components/admin/Toast";

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    adminApi
      .getAnalytics()
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch(() => addToast("Failed to load analytics", "error"))
      .finally(() => setLoading(false));
  }, [addToast]);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white font-playfair mb-6">
          Analytics
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#111111] rounded-2xl p-6 border border-[#1f1f1f]"
            >
              <div className="h-4 w-24 bg-[#1f1f1f] rounded animate-pulse mb-3" />
              <div className="h-8 w-16 bg-[#1f1f1f] rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="h-64 bg-[#111111] rounded-2xl border border-[#1f1f1f] animate-pulse" />
      </div>
    );
  }

  const usersIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
  const therapistsIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  const sessionsIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const maxGrowth = Math.max(1, ...(data?.userGrowth.map((m) => m.count) ?? [0]));
  const maxSpecialty = Math.max(
    1,
    ...(data?.topSpecialties.map((s) => s.count) ?? [0]),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-white font-playfair mb-6">
        Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Users" value={data?.userTotal ?? 0} icon={usersIcon} />
        <StatsCard title="Total Therapists" value={data?.therapistTotal ?? 0} icon={therapistsIcon} />
        <StatsCard title="Active Sessions" value={data?.activeSessions ?? 0} icon={sessionsIcon} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111111] rounded-2xl p-6 border border-[#1f1f1f]">
          <h3 className="text-lg font-semibold text-white font-nunito mb-4">
            User Growth
          </h3>
          <div className="h-48 flex items-end gap-2">
            {data?.userGrowth.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-[#47898E]/30 hover:bg-[#47898E]/50 rounded-t-lg transition-colors min-h-[2px]"
                  style={{ height: `${(m.count / maxGrowth) * 100}%` }}
                  title={`${m.label}: ${m.count}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 font-nunito">
            <span>{data?.userGrowth[0]?.label}</span>
            <span>{data?.userGrowth[data.userGrowth.length - 1]?.label}</span>
          </div>
        </div>

        <div className="bg-[#111111] rounded-2xl p-6 border border-[#1f1f1f]">
          <h3 className="text-lg font-semibold text-white font-nunito mb-4">
            Top Specialties
          </h3>
          {data && data.topSpecialties.length > 0 ? (
            <div className="space-y-4">
              {data.topSpecialties.map((spec) => (
                <div key={spec.name} className="flex items-center gap-4">
                  <span className="text-sm text-gray-400 font-nunito w-32 truncate">
                    {spec.name}
                  </span>
                  <div className="flex-1 h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#47898E] rounded-full"
                      style={{ width: `${(spec.count / maxSpecialty) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-white font-nunito w-8 text-right">
                    {spec.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 font-nunito py-8 text-center">
              No specialty data yet.
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-[#111111] rounded-2xl p-6 border border-dashed border-[#1f1f1f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E77D3C]/10 text-[#E77D3C] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-white font-nunito">
                Appointments &amp; Revenue
              </div>
              <div className="text-xs text-gray-500 font-nunito">
                Coming soon — available once booking launches.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
