import React from 'react';
import { Home, Users, QrCode, GraduationCap, Settings } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenQRScanner: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenQRScanner,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-1 pointer-events-none">
      <div className="max-w-md mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-soft-lg pointer-events-auto px-3 py-2 flex items-center justify-around">
        {/* Tab 1: Home */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'dashboard'
              ? 'text-amber-500 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Tab 2: Siswa & Guru */}
        <button
          onClick={() => onSelectTab('students')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'students' || activeTab === 'teachers'
              ? 'text-amber-500 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Users className={`w-5 h-5 ${activeTab === 'students' || activeTab === 'teachers' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">Siswa</span>
        </button>

        {/* Center Floating Action: Scan QR (Primary Action) */}
        <button
          onClick={onOpenQRScanner}
          className="flex flex-col items-center -mt-6 group focus:outline-none"
        >
          <div className="w-13 h-13 w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-gold-glow group-hover:scale-105 group-active:scale-95 transition-transform ring-4 ring-white dark:ring-slate-900">
            <QrCode className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-amber-500 mt-1">Scan</span>
        </button>

        {/* Tab 4: Nilai */}
        <button
          onClick={() => onSelectTab('grades')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'grades' || activeTab === 'grades-recap'
              ? 'text-amber-500 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <GraduationCap className={`w-5 h-5 ${activeTab === 'grades' || activeTab === 'grades-recap' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">Nilai</span>
        </button>

        {/* Tab 5: Settings / Lainnya */}
        <button
          onClick={() => onSelectTab('settings')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'settings'
              ? 'text-amber-500 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">Akun</span>
        </button>
      </div>
    </div>
  );
};
