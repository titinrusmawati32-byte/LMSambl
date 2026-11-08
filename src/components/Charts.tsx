import React from 'react';
import { Calendar, ChevronDown, TrendingUp } from 'lucide-react';

export const AttendanceChart: React.FC = () => {
  const days = [
    { day: 'Sen', rate: 70 },
    { day: 'Sel', rate: 85 },
    { day: 'Rab', rate: 80 },
    { day: 'Kam', rate: 84 },
    { day: 'Jum', rate: 98.2, peak: true },
    { day: 'Sab', rate: 90 },
    { day: 'Min', rate: 75 }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl md:rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">
              Grafik Kehadiran Siswa
            </h3>
            <span className="text-[11px] text-slate-400">Rata-rata presensi harian</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          <span>7 Hari Terakhir</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* SVG Line Chart Representation */}
      <div className="relative h-44 w-full pt-4">
        {/* Y Axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400">
          <div className="border-b border-dashed border-slate-100 dark:border-slate-800/80 w-full flex justify-between">
            <span>100%</span>
          </div>
          <div className="border-b border-dashed border-slate-100 dark:border-slate-800/80 w-full flex justify-between">
            <span>75%</span>
          </div>
          <div className="border-b border-dashed border-slate-100 dark:border-slate-800/80 w-full flex justify-between">
            <span>50%</span>
          </div>
        </div>

        {/* SVG Curve */}
        <svg viewBox="0 0 700 160" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area under curve */}
          <path
            d="M 50,110 Q 150,50 250,75 T 450,20 T 550,45 T 650,100 L 650,160 L 50,160 Z"
            fill="url(#chartGradient)"
          />

          {/* Line */}
          <path
            d="M 50,110 Q 150,50 250,75 T 450,20 T 550,45 T 650,100"
            fill="none"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Points */}
          {[
            { cx: 50, cy: 110 },
            { cx: 150, cy: 50 },
            { cx: 250, cy: 75 },
            { cx: 350, cy: 60 },
            { cx: 450, cy: 20, peak: true, val: '98.2%' },
            { cx: 550, cy: 45 },
            { cx: 650, cy: 100 }
          ].map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.cx}
                cy={pt.cy}
                r={pt.peak ? 6 : 4}
                className={pt.peak ? "fill-blue-600 stroke-4 stroke-white dark:stroke-slate-900" : "fill-blue-500"}
              />
              {pt.peak && (
                <g>
                  <rect
                    x={pt.cx - 28}
                    y={pt.cy - 30}
                    width="56"
                    height="20"
                    rx="6"
                    className="fill-slate-900 dark:fill-white"
                  />
                  <text
                    x={pt.cx}
                    y={pt.cy - 16}
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-white dark:fill-slate-900"
                  >
                    {pt.val}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>

        {/* X Axis Labels */}
        <div className="flex justify-between text-xs text-slate-400 font-semibold mt-2 px-4">
          {days.map((d, i) => (
            <span key={i} className={d.peak ? 'text-blue-600 font-extrabold' : ''}>
              {d.day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const GradeProgressChart: React.FC = () => {
  const subjects = [
    { name: 'IPA', current: 86.5, target: 80 },
    { name: 'Matematika', current: 82.3, target: 80 },
    { name: 'Bahasa Indonesia', current: 88.7, target: 85 },
    { name: 'IPS', current: 84.1, target: 80 }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl md:rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 dark:bg-amber-950/50 text-amber-500 rounded-xl">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">
              Perkembangan Nilai
            </h3>
            <span className="text-[11px] text-slate-400">Rata-rata per mata pelajaran</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          <span>Semester Ganjil</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-600" />
          <span>Rata-rata</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-400" />
          <span>Target</span>
        </div>
      </div>

      {/* Bars */}
      <div className="grid grid-cols-4 gap-4 items-end h-36 pt-4 border-b border-slate-100 dark:border-slate-800 pb-2">
        {subjects.map((sub, i) => (
          <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              {sub.current}
            </div>
            <div className="flex items-end gap-1.5 h-24">
              {/* Blue Bar: Current */}
              <div
                className="w-4 sm:w-6 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-lg shadow-sm"
                style={{ height: `${(sub.current / 100) * 100}%` }}
              />
              {/* Amber Bar: Target */}
              <div
                className="w-4 sm:w-6 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-lg shadow-sm"
                style={{ height: `${(sub.target / 100) * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate max-w-full text-center">
              {sub.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
