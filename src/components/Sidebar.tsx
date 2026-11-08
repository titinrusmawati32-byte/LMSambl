import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  QrCode,
  ScanLine,
  ClipboardList,
  GraduationCap,
  BarChart3,
  BookOpen,
  FileText,
  Settings,
  Sparkles,
  BookMarked
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'teachers', label: 'Kelola Guru', icon: UserCheck },
    { id: 'students', label: 'Kelola Siswa', icon: Users },
    { id: 'qrcards', label: 'Kartu QR Siswa', icon: QrCode },
    { id: 'attendance', label: 'Presensi Siswa', icon: ScanLine },
    { id: 'attendance-recap', label: 'Rekap Presensi', icon: ClipboardList },
    { id: 'grades', label: 'Penilaian', icon: GraduationCap },
    { id: 'grades-recap', label: 'Rekap Nilai', icon: BarChart3 },
    { id: 'resources', label: 'Perangkat Ajar', icon: BookOpen },
    { id: 'reports', label: 'Laporan', icon: FileText },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0a192f] text-slate-200 z-50 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 shrink-0">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <div className="leading-tight">
              <h1 className="font-extrabold text-white text-base tracking-tight">
                Portal Administrasi
              </h1>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block">
                Guru • SDN Sumberejo 04
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20 translate-x-1'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Banner Card (Matching Screenshot Image 1) */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/60 to-slate-900 border border-blue-500/20 p-3.5 text-center shadow-lg">
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
            <BookMarked className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-white leading-tight">
              Maju Bersama
            </p>
            <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
              untuk Pendidikan Berkualitas
            </p>
            <div className="mt-2.5 inline-block text-[10px] font-semibold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
              Kurikulum Merdeka
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
