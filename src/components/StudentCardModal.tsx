import React, { useState } from 'react';
import { X, Printer, Download, Eye, GraduationCap, Sparkles } from 'lucide-react';
import { Student } from '../types';

interface StudentCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (s: Student) => void;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({
  isOpen,
  onClose,
  students,
  selectedStudent,
  onSelectStudent,
}) => {
  const [selectedClass, setSelectedClass] = useState('VI A');
  const currentStudent = selectedStudent || students[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0a192f] text-white w-full max-w-4xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Kartu QR Siswa <span className="text-slate-400 font-normal">›</span> Detail Kartu
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 items-center">
          {/* Controls Column (4 Cols) */}
          <div className="md:col-span-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Kelas</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="VI A">Kelas VI A</option>
                <option value="VI B">Kelas VI B</option>
                <option value="V A">Kelas V A</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Pilih Siswa</label>
              <select
                value={currentStudent?.id}
                onChange={(e) => {
                  const s = students.find((item) => item.id === e.target.value);
                  if (s) onSelectStudent(s);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.nisn})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
              >
                <Printer className="w-4 h-4" /> Cetak Kartu
              </button>
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>

          {/* Physical ID Card Preview (8 Cols Matching Image 1) */}
          <div className="md:col-span-8 flex justify-center">
            <div className="w-full max-w-md bg-gradient-to-br from-slate-950 via-[#0a192f] to-blue-950 rounded-2xl border-2 border-amber-400/40 p-4 shadow-2xl relative overflow-hidden text-slate-900 print:shadow-none print:border-black">
              {/* Gold Ribbon Curves Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/20 via-blue-500/10 to-transparent rounded-full blur-xl pointer-events-none" />

              {/* Card Inner White Container */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 relative">
                {/* School Header */}
                <div className="flex items-center gap-3 border-b-2 border-amber-400/80 pb-2 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-amber-400 font-bold shadow shrink-0">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-blue-950 text-xs sm:text-sm tracking-tight leading-tight">
                      SDN SUMBEREJO 04
                    </h3>
                    <p className="text-[10px] text-slate-600 font-medium">
                      Kec. Ambulu • Jember
                    </p>
                  </div>
                </div>

                <div className="text-center mb-3">
                  <span className="text-[11px] font-extrabold text-blue-900 uppercase tracking-widest bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200">
                    KARTU IDENTITAS PESERTA DIDIK
                  </span>
                </div>

                {/* Body Content */}
                <div className="flex items-center gap-3">
                  {/* Photo */}
                  <div className="w-20 h-24 rounded-lg bg-slate-200 border-2 border-slate-300 overflow-hidden flex flex-col items-center justify-center shrink-0 shadow-inner">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold text-lg mb-1">
                      {currentStudent?.name.charAt(0)}
                    </div>
                    <span className="text-[8px] font-bold text-slate-500 uppercase">
                      PAS FOTO
                    </span>
                  </div>

                  {/* Student Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="text-sm font-extrabold text-slate-900 truncate">
                      {currentStudent?.name}
                    </div>
                    <div className="text-[11px] text-slate-700 font-medium">
                      <span className="text-slate-400 inline-block w-12">NISN</span>: <strong className="text-slate-900">{currentStudent?.nisn}</strong>
                    </div>
                    <div className="text-[11px] text-slate-700 font-medium">
                      <span className="text-slate-400 inline-block w-12">NIS</span>: {currentStudent?.nis}
                    </div>
                    <div className="text-[11px] text-slate-700 font-medium">
                      <span className="text-slate-400 inline-block w-12">Kelas</span>: <strong className="text-blue-900 font-bold">{currentStudent?.className}</strong>
                    </div>
                  </div>

                  {/* High Quality SVG QR Code Matrix */}
                  <div className="w-20 h-20 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center shadow-sm shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                      {/* Stylized QR Code Pattern */}
                      <rect x="5" y="5" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="13" y="13" width="14" height="14" rx="2" />
                      <rect x="65" y="5" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="73" y="13" width="14" height="14" rx="2" />
                      <rect x="5" y="65" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="13" y="73" width="14" height="14" rx="2" />
                      {/* Internal Data Dots */}
                      <rect x="44" y="10" width="8" height="8" />
                      <rect x="44" y="24" width="8" height="8" />
                      <rect x="10" y="44" width="8" height="8" />
                      <rect x="24" y="44" width="8" height="8" />
                      <rect x="44" y="44" width="12" height="12" />
                      <rect x="65" y="44" width="8" height="8" />
                      <rect x="80" y="44" width="10" height="10" />
                      <rect x="44" y="65" width="8" height="8" />
                      <rect x="65" y="65" width="8" height="8" />
                      <rect x="80" y="80" width="10" height="10" />
                    </svg>
                  </div>
                </div>

                {/* Footer Ribbon with Gold Wavy Gradient */}
                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] font-bold text-slate-600">
                  <span>Tahun Ajaran 2026/2027</span>
                  <span className="text-blue-900 font-extrabold">Berprestasi • Berkarakter • Berakhlak Mulia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
