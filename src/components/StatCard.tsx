import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  trend?: string;
  trendUp?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor,
  iconColor,
  trend,
  trendUp = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-3xl md:rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex items-center justify-between ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Rounded Icon Circle */}
        <div
          className={`w-14 h-14 md:w-12 md:h-12 rounded-2xl md:rounded-xl flex items-center justify-center shrink-0 shadow-sm ${iconBgColor}`}
        >
          <Icon className={`w-7 h-7 md:w-6 md:h-6 ${iconColor}`} />
        </div>

        <div>
          <div className="text-2xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {value}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            {title}
          </div>
          {subtitle && (
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};
