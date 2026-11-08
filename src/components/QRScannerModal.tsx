import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Camera, QrCode, Play, Square, UserCheck, ShieldCheck } from 'lucide-react';
import { AttendanceRecord, Student } from '../types';
import { attendanceService } from '../services/attendanceService.js';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onAttendanceUpdated: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  students,
  onAttendanceUpdated,
}) => {
  const [selectedClass, setSelectedClass] = useState('VI A');
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; studentName?: string; time?: string } | null>({
    success: true,
    message: 'Presensi Berhasil!',
    studentName: 'Andi Pratama',
    time: 'Kelas VI A • 07:24'
  });
  const [recentAttendees, setRecentAttendees] = useState<Array<{ name: string; time: string }>>([
    { name: 'Andi Pratama', time: '07:24' },
    { name: 'Budi Santoso', time: '07:20' },
    { name: 'Citra Lestari', time: '07:22' },
    { name: 'Deni Saputra', time: '07:25' },
    { name: 'Eika Wijaya', time: '07:27' },
  ]);

  if (!isOpen) return null;

  const handleSimulateScan = async (student: Student) => {
    try {
      const res = await attendanceService.recordQR(student.qrToken, selectedClass);
      if (res.success) {
        const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setScanResult({
          success: true,
          message: 'Presensi Berhasil!',
          studentName: student.name,
          time: `Kelas ${student.className} • ${timeNow}`
        });
        setRecentAttendees(prev => [{ name: student.name, time: timeNow }, ...prev.slice(0, 5)]);
        onAttendanceUpdated();
      } else {
        setScanResult({
          success: false,
          message: res.error || 'Gagal memproses QR'
        });
      }
    } catch (err: any) {
      setScanResult({
        success: false,
        message: err.message
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0a192f] text-white w-full max-w-5xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Presensi Siswa <span className="text-slate-400 font-normal">›</span> QR Scanner
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Column Layout Matching Image 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          {/* Column 1: Filter & Counts (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
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
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Tanggal</label>
              <input
                type="text"
                disabled
                value="6 Nov 2026"
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 font-medium cursor-not-allowed"
              />
            </div>

            {/* Attendance Status Counts */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Hadir
                </span>
                <span className="font-bold text-white">24</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Izin
                </span>
                <span className="font-bold text-white">2</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Sakit
                </span>
                <span className="font-bold text-white">1</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Alpa
                </span>
                <span className="font-bold text-white">1</span>
              </div>
            </div>

            <button
              onClick={() => setIsScanning(!isScanning)}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                isScanning
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              }`}
            >
              {isScanning ? (
                <>
                  <Square className="w-4 h-4 fill-current" /> Hentikan Sesi
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Mulai Kamera
                </>
              )}
            </button>
          </div>

          {/* Column 2: Viewfinder Camera with Guides (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden flex items-center justify-center">
              {/* Corner Targeting Brackets */}
              <div className="absolute inset-8 pointer-events-none border border-white/10 rounded-2xl">
                {/* Top Left */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-xl" />
                {/* Top Right */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-xl" />
                {/* Bottom Left */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-xl" />
                {/* Bottom Right */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-xl" />

                {/* Laser Scanning Animation Bar */}
                {isScanning && (
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-pulse absolute top-1/2 -translate-y-1/2" />
                )}
              </div>

              {/* Viewfinder Content Placeholder / Mock */}
              <div className="text-center p-6 space-y-3 z-10">
                <Camera className="w-12 h-12 text-slate-600 mx-auto animate-bounce" />
                <p className="text-xs text-slate-400 max-w-xs">
                  Arahkan QR Code Kartu Siswa ke dalam area kotak pemindai
                </p>
              </div>

              {/* Success Result Banner Overlay (Matching Image 1) */}
              {scanResult && scanResult.success && (
                <div className="absolute bottom-4 left-4 right-4 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl p-3 backdrop-blur-md flex items-center gap-3 shadow-xl animate-fade-in">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-emerald-400">
                      {scanResult.message}
                    </div>
                    <div className="text-sm font-bold text-white">
                      {scanResult.studentName}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {scanResult.time}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Test Simulator Bar */}
            <div className="w-full mt-4 bg-slate-900/90 rounded-2xl p-3 border border-slate-800">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                ⚡ Uji Scan Cepat (Simulasi Kartu Siswa):
              </span>
              <div className="flex flex-wrap gap-2">
                {students.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSimulateScan(s)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-200 text-xs rounded-lg transition-all font-medium flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Daftar Kehadiran (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Daftar Kehadiran
              </h3>
              <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                28 / 32
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
              {recentAttendees.map((att, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-bold w-4">{idx + 1}</span>
                    <span className="font-semibold text-slate-200">{att.name}</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 text-center text-xs text-blue-400 hover:text-blue-300 font-bold block"
            >
              Lihat Rekap Selengkapnya →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
