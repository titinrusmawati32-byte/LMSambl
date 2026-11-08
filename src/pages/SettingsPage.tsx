import React from 'react';
import { Settings, ShieldCheck, School, Server, Moon, Sun, Info } from 'lucide-react';
import { APP_CONFIG } from '../config/config.js';
import { mockSchool } from '../services/mockData.ts';

interface SettingsPageProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Pengaturan Sistem & Profil Instansi
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Informasi konfigurasi aplikasi terpusat dan preferensi antarmuka
        </p>
      </div>

      {/* School Profile Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl md:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-2xl">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">
              Identitas Satuan Pendidikan (Multi-Tenant)
            </h3>
            <p className="text-[11px] text-slate-400">Dikelola di master Google Sheets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Nama Sekolah:</span>
            <strong className="text-slate-800 dark:text-white text-sm">{mockSchool.name}</strong>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-slate-400 block text-[10px]">NPSN:</span>
            <strong className="text-slate-800 dark:text-white text-sm">{mockSchool.npsn}</strong>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Wilayah:</span>
            <span className="text-slate-800 dark:text-white font-medium">{mockSchool.district}, {mockSchool.city}</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Tahun Ajaran Aktif:</span>
            <span className="text-amber-500 font-bold">{mockSchool.academicYear}</span>
          </div>
        </div>
      </div>

      {/* System Architecture Metadata Card (Read-only Developer Config) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl md:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-2xl">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">
              Arsitektur Teknis Backend (PRD v1.2)
            </h3>
            <p className="text-[11px] text-slate-400">Konfigurasi pusat dikelola via <code className="font-mono text-amber-500">src/config/config.js</code></p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Provider Database:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{APP_CONFIG.DATABASE.PROVIDER}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Storage Dokumen / Foto:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{APP_CONFIG.STORAGE.PROVIDER}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Hosting Target:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{APP_CONFIG.HOSTING.PROVIDER}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Multi-Tenant Enabled:</span>
            <span className="font-bold text-emerald-500">{APP_CONFIG.MULTI_TENANT ? 'YA (Aktif)' : 'TIDAK'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 rounded-xl text-xs text-blue-700 dark:text-blue-300">
          <Info className="w-4 h-4 shrink-0" />
          <span>
            Sesuai aturan keamanan PRD v1.2, tidak ada input manual URL backend di antarmuka pengguna demi mencegah kebocoran endpoint atau manipulasi koneksi.
          </span>
        </div>
      </div>

      {/* Theme Preference */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl md:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">
            Tema Tampilan
          </h3>
          <p className="text-xs text-slate-400">Beralih antara mode gelap dan mode terang</p>
        </div>
        <button
          onClick={onToggleDarkMode}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 transition"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" /> Mode Terang
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-700" /> Mode Gelap
            </>
          )}
        </button>
      </div>
    </div>
  );
};
