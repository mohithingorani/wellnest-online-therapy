import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger";
}

export function StatsCard({ title, value, icon, trend, variant = "default" }: StatsCardProps) {
  const variantStyles = {
    default: "text-[#4a6b52] bg-[#4a6b52]/10",
    success: "text-emerald-500 bg-emerald-500/10",
    warning: "text-amber-500 bg-amber-500/10",
    danger: "text-red-500 bg-red-500/10",
  };

  return (
    <div className="bg-[#fffefb] rounded-2xl p-6 border border-[#e4dccb] hover:border-[#ded4c0] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${variantStyles[variant]}`}>{icon}</div>
        {trend && (
          <div className={`text-sm font-medium ${trend.isPositive ? "text-emerald-500" : "text-red-500"}`}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="text-sm text-fg-muted font-nunito mb-1">{title}</div>
      <div className="text-2xl font-bold text-fg-strong font-nunito">{value}</div>
    </div>
  );
}