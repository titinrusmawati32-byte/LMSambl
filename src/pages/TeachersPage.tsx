import React, { useState } from 'react';
import { UserCheck, Search, Plus, Mail, BookOpen, ShieldCheck } from 'lucide-react';
import { Teacher } from '../types';

interface TeachersPageProps {
  teachers: Teacher[];
}

export const TeachersPage: React.FC<TeachersPageProps> = ({ teachers }) => {
  const [search, setSearch] = useState('');

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.nip.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Kelola Guru & Tenaga Pendidik
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daftar guru, penugasan mata pelajaran, dan wali kelas SDN Sumberejo 04
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl md:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft flex items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama guru atau NIP..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-full border border-transparent focus:border-amber-400 focus:outline-none"
          />
        </div>
        <span className="text-xs font-bold text-slate-400">
          Total: {filtered.length} Guru
        </span>
      </div>

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-slate-900 rounded-3xl md:rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-soft-lg transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">NIP: {t.nip}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Tugas Pokok:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{t.subject}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Penugasan Kelas:</span>
                <div className="flex gap-1">
                  {t.assignedClasses.map((c) => (
                    <span key={c} className="font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
