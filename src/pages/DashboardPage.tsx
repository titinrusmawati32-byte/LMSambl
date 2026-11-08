import React from 'react';
import {
  Users,
  GraduationCap,
  UserCheck,
  CalendarCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Clock,
  QrCode,
  Award
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { AttendanceChart, GradeProgressChart } from '../components/Charts';
import { User, Student } from '../types';

interface DashboardPageProps {
  currentUser: User | null;
  onOpenQRScanner: () => void;
  onOpenIDCard: () => void;
  onOpenGradeInput: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  onOpenQRScanner,
  onOpenIDCard,
  onOpenGradeInput,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* HERO BANNER MATCHING IMAGE 1                                              */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a192f] via-blue-950 to-slate-900 border border-slate-800 shadow-soft-lg text-white p-6 sm:p-8">
        {/* Glow Curves and Overlay Elements */}
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-blue-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> SDN Sumberejo 04 • TP 2026/2027
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Selamat Datang, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200">
                {currentUser?.fullName || 'Reza Fahlevi!'}
              </span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Semangat mendidik, menginspirasi, dan membangun masa depan generasi bangsa dengan administrasi digital terpadu.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigateTab('teachers')}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Lihat Jadwal Mengajar <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenQRScanner}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 border border-white/15 backdrop-blur-sm transition-all"
              >
                <QrCode className="w-4 h-4 text-amber-400" /> Buka Scanner Presensi
              </button>
            </div>
          </div>

          {/* Right School Badge / Banner Emblem Matching Image 1 */}
          <div className="hidden lg:flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-blue-900/50 to-slate-900/80 rounded-2xl border border-blue-500/30 backdrop-blur-md shadow-xl w-64 shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-400/20 mb-3 text-slate-950">
              <GraduationCap className="w-9 h-9" />
            </div>
            <h4 className="font-extrabold text-white text-sm tracking-wide italic">
              "Sekolah Maju, Berprestasi"
            </h4>
            <p className="text-[11px] text-slate-300 mt-1 font-medium">
              SDN Sumberejo 04 Ambulu
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 KPI STAT CARDS MATCHING IMAGE 1                                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Siswa"
          value="258"
          icon={Users}
          iconBgColor="bg-blue-100 dark:bg-blue-950/60"
          iconColor="text-blue-600 dark:text-blue-400"
          trend="+2%"
          trendUp={true}
          onClick={() => onNavigateTab('students')}
        />
        <StatCard
          title="Kelas"
          value="6"
          icon={GraduationCap}
          iconBgColor="bg-purple-100 dark:bg-purple-950/60"
          iconColor="text-purple-600 dark:text-purple-400"
          trend="0%"
          trendUp={true}
          onClick={() => onNavigateTab('students')}
        />
        <StatCard
          title="Total Guru"
          value="12"
          icon={UserCheck}
          iconBgColor="bg-emerald-100 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
          trend="+1%"
          trendUp={true}
          onClick={() => onNavigateTab('teachers')}
        />
        <StatCard
          title="Kehadiran Hari Ini"
          value="96.5%"
          icon={CalendarCheck}
          iconBgColor="bg-amber-100 dark:bg-amber-950/60"
          iconColor="text-amber-600 dark:text-amber-400"
          trend="+0.5%"
          trendUp={true}
          onClick={onOpenQRScanner}
        />
      </div>

      {/* ========================================================================= */}
      {/* CHARTS & ACTIVITY FEED MATCHING IMAGE 1                                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Attendance Line Chart (6 Cols) */}
        <div className="lg:col-span-4">
          <AttendanceChart />
        </div>

        {/* Middle Side: Grade Progress Bar Chart (5 Cols) */}
        <div className="lg:col-span-4">
          <GradeProgressChart />
        </div>

        {/* Right Side: Aktivitas Terbaru Matching Image 1 (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl md:rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                Aktivitas Terbaru
              </h3>
              <button
                onClick={() => onNavigateTab('reports')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Presensi kelas VI A
                  </div>
                  <div className="text-[11px] text-slate-400">Hari ini, 07:15</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Nilai UH Matematika
                  </div>
                  <div className="text-[11px] text-slate-400">Kelas V B, 08:20</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Dokumen Modul Ajar
                  </div>
                  <div className="text-[11px] text-slate-400">diunduh oleh Guru</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Data siswa baru
                  </div>
                  <div className="text-[11px] text-slate-400">diimport oleh Admin</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Laporan presensi bulanan
                  </div>
                  <div className="text-[11px] text-slate-400">siap diunduh</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" /> Sinkronisasi Real-time
            </span>
            <span className="font-bold text-emerald-500">Aktif</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* QUICK ACTIONS BAR (EMBEDDED MODAL TRIGGERS)                               */}
      {/* ========================================================================= */}
      <div className="bg-slate-100/80 dark:bg-slate-900/60 p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Aksi Cepat Guru:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenQRScanner}
            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-amber-500 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5 transition-all"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-500" /> Presensi QR
          </button>
          <button
            onClick={onOpenIDCard}
            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-blue-500 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5 transition-all"
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-500" /> Cetak Kartu Siswa
          </button>
          <button
            onClick={onOpenGradeInput}
            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-emerald-500 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Award className="w-3.5 h-3.5 text-emerald-500" /> Input Nilai
          </button>
        </div>
      </div>
    </div>
  );
};
