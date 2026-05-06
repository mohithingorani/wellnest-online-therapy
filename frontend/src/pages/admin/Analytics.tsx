import { StatsCard } from "../../components/admin/StatsCard";

export default function Analytics() {
  const stats = [
    { title: "Total Users", value: "1,234", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>, trend: { value: 12, isPositive: true } },
    { title: "Total Therapists", value: "89", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, trend: { value: 5, isPositive: true } },
    { title: "Appointments This Month", value: "456", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, trend: { value: 8, isPositive: true } },
    { title: "Revenue This Month", value: "$12,450", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, trend: { value: 15, isPositive: true } },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-playfair mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} title={stat.title} value={stat.value} icon={stat.icon} trend={stat.trend} variant={idx === 3 ? "success" : "default"} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-nunito mb-4">User Growth</h3>
          <div className="h-48 flex items-end gap-2">
            {[65, 78, 82, 90, 95, 100, 110, 105, 115, 120, 130, 140].map((h, i) => (
              <div key={i} className="flex-1 bg-[#47898E]/20 rounded-t-lg hover:bg-[#47898E]/30 transition-colors" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500 font-nunito">
            <span>Jan</span><span>Dec</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-nunito mb-4">Therapist Distribution</h3>
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#47898E" strokeWidth="3" strokeDasharray="70 30" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-slate-900 dark:text-white font-nunito">70%</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#47898E]" />
                <span className="text-sm text-slate-600 dark:text-slate-400 font-nunito">Active</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white font-nunito ml-auto">62</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400 font-nunito">Pending</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white font-nunito ml-auto">15</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400 font-nunito">Inactive</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white font-nunito ml-auto">12</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-nunito mb-4">Appointment Trends</h3>
          <div className="space-y-4">
            {["Video Sessions", "In-Person", "Chat Sessions", "Phone Calls"].map((item, i) => (
              <div key={item} className="flex items-center gap-4">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-nunito w-28">{item}</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#47898E] rounded-full" style={{ width: `${[75, 60, 45, 30][i]}%` }} />
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white font-nunito w-12 text-right">{[156, 124, 93, 62][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-nunito mb-4">Top Specialties</h3>
          <div className="space-y-3">
            {["Anxiety", "Depression", "Relationships", "Trauma", "Stress Management"].map((spec, i) => (
              <div key={spec} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-sm font-medium text-slate-900 dark:text-white font-nunito">{spec}</span>
                <span className="text-sm text-slate-500 font-nunito">{[45, 38, 28, 22, 18][i]}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}