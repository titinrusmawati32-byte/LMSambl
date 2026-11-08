import React, { useState } from 'react';
import { Users, Search, Plus, QrCode, Filter, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { Student } from '../types';

interface StudentsPageProps {
  students: Student[];
  onOpenIDCard: (student: Student) => void;
  onOpenQRScanner: () => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({
  students,
  onOpenIDCard,
  onOpenQRScanner,
}) => {
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [search, setSearch] = useState('');

  const filtered = students.filter((s) => {
    const matchClass = selectedClass === 'Semua' || s.className === selectedClass;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nisn.includes(search) ||
      s.nis.includes(search);
    return matchClass && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Kelola Siswa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daftar siswa terdaftar, identitas digital, dan token QR presensi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQRScanner}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 border border-slate-700 shadow-sm transition"
          >
            <QrCode className="w-4 h-4 text-amber-400" /> Buka Scanner
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl md:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['Semua', 'VI A', 'VI B', 'V A', 'V B'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                selectedClass === cls
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cls === 'Semua' ? 'Semua Kelas' : `Kelas ${cls}`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau NISN..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-full border border-transparent focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Student Table / Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl md:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">NISN / NIS</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Status Token QR</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 text-center text-slate-400 font-bold">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-100">{s.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.qrToken}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                    <div>{s.nisn}</div>
                    <div className="text-[10px] text-slate-400">NIS: {s.nis}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                      {s.className}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">
                    {s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Siap Dipindai
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenIDCard(s)}
                      className="px-3 py-1.5 bg-amber-400/10 hover:bg-amber-400 text-amber-700 hover:text-slate-950 dark:text-amber-400 font-bold rounded-lg text-xs transition inline-flex items-center gap-1"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Cetak Kartu
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
