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
    default: "text-[#47898E] bg-[#47898E]/10",
    success: "text-emerald-500 bg-emerald-500/10",
    warning: "text-amber-500 bg-amber-500/10",
    danger: "text-red-500 bg-red-500/10",
  };

  return (
    <div className="bg-[#111111] rounded-2xl p-6 border border-[#1f1f1f] hover:border-[#333333] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${variantStyles[variant]}`}>{icon}</div>
        {trend && (
          <div className={`text-sm font-medium ${trend.isPositive ? "text-emerald-500" : "text-red-500"}`}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="text-sm text-gray-500 font-nunito mb-1">{title}</div>
      <div className="text-2xl font-bold text-white font-nunito">{value}</div>
    </div>
  );
}