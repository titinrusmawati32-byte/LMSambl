import React, { useState } from 'react';
import { FileText, Download, Printer, Filter, Calendar } from 'lucide-react';
import { reportService } from '../services/reportService.js';
import { mockAttendance, mockGrades, mockSchool } from '../services/mockData.ts';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<'presensi' | 'nilai'>('presensi');

  const handleExportCSV = () => {
    if (reportType === 'presensi') {
      const headers = ['No', 'Nama Siswa', 'NISN', 'Kelas', 'Tanggal', 'Waktu', 'Status', 'Metode'];
      const rows = mockAttendance.map((a, i) => [
        i + 1,
        a.studentName,
        a.nisn,
        a.className,
        a.date,
        a.time,
        a.status.toUpperCase(),
        a.method.toUpperCase()
      ]);
      reportService.exportToCSV('Laporan_Presensi_SDN_Sumberejo_04', headers, rows);
    } else {
      const headers = ['No', 'Nama Siswa', 'NISN', 'Kelas', 'Mata Pelajaran', 'Penilaian', 'Nilai', 'Tanggal'];
      const rows = mockGrades.map((g, i) => [
        i + 1,
        g.studentName,
        g.nisn,
        g.className,
        g.subject,
        g.assessmentType,
        g.score,
        g.date
      ]);
      reportService.exportToCSV('Laporan_Nilai_SDN_Sumberejo_04', headers, rows);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Pusat Laporan & Rekapitulasi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ekspor rekap presensi dan penilaian siswa format profesional cetak & Excel
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => reportService.triggerPrint()}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" /> Cetak / PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition"
          >
            <Download className="w-4 h-4" /> Export Excel (CSV)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setReportType('presensi')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportType === 'presensi'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Rekap Presensi Harian
        </button>
        <button
          onClick={() => setReportType('nilai')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportType === 'nilai'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Rekap Nilai Siswa
        </button>
      </div>

      {/* Printable Report Preview */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl md:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-4">
        {/* School Header on Printed Report */}
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
          <h3 className="font-black text-base text-slate-900 dark:text-white uppercase tracking-wider">
            {mockSchool.name}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {mockSchool.district} • {mockSchool.city} • NPSN: {mockSchool.npsn}
          </p>
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">
            {reportType === 'presensi' ? 'REKAPITULASI PRESENSI SISWA KELAS VI' : 'REKAPITULASI NILAI SUMATIF DAN FORMATIF'}
          </p>
        </div>

        {reportType === 'presensi' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 font-bold uppercase text-[10px] text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3">NISN</th>
                  <th className="p-3">Kelas</th>
                  <th className="p-3">Tanggal & Waktu</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Metode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mockAttendance.map((a, i) => (
                  <tr key={a.id}>
                    <td className="p-3 text-slate-400">{i + 1}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-white">{a.studentName}</td>
                    <td className="p-3 font-mono">{a.nisn}</td>
                    <td className="p-3">{a.className}</td>
                    <td className="p-3">{a.date} • {a.time}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        a.status === 'hadir' ? 'bg-emerald-100 text-emerald-800' :
                        a.status === 'izin' ? 'bg-amber-100 text-amber-800' :
                        a.status === 'sakit' ? 'bg-orange-100 text-orange-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {a.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[10px]">{a.method.toUpperCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 font-bold uppercase text-[10px] text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3">NISN</th>
                  <th className="p-3">Mata Pelajaran</th>
                  <th className="p-3">Penilaian</th>
                  <th className="p-3">Nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mockGrades.map((g, i) => (
                  <tr key={g.id}>
                    <td className="p-3 text-slate-400">{i + 1}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-white">{g.studentName}</td>
                    <td className="p-3 font-mono">{g.nisn}</td>
                    <td className="p-3 font-semibold">{g.subject}</td>
                    <td className="p-3">{g.assessmentType}</td>
                    <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{g.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
