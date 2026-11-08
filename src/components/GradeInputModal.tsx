import React, { useState } from 'react';
import { X, Save, CheckCircle2, Award } from 'lucide-react';
import { Student } from '../types';
import { gradeService } from '../services/gradeService.js';

interface GradeInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
}

export const GradeInputModal: React.FC<GradeInputModalProps> = ({
  isOpen,
  onClose,
  students,
}) => {
  const [selectedClass, setSelectedClass] = useState('VI A');
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const [assessmentType, setAssessmentType] = useState('Ulangan Harian');
  const [assessmentDate, setAssessmentDate] = useState('6 Nov 2026');
  const [scores, setScores] = useState<Record<string, { score: number; notes: string }>>({
    'std-02': { score: 90, notes: 'Sangat baik' },
    'std-07': { score: 85, notes: 'Aktif bertanya' },
    'std-08': { score: 88, notes: 'Tuntas' },
    'std-09': { score: 92, notes: 'Istimewa' },
    'std-10': { score: 87, notes: 'Tuntas' },
  });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleScoreChange = (studentId: string, val: number) => {
    setScores(prev => ({
      ...prev,
      [studentId]: {
        score: val,
        notes: prev[studentId]?.notes || ''
      }
    }));
  };

  const handleNotesChange = (studentId: string, val: string) => {
    setScores(prev => ({
      ...prev,
      [studentId]: {
        score: prev[studentId]?.score || 0,
        notes: val
      }
    }));
  };

  const handleSave = async () => {
    const payload = students.map(s => ({
      studentId: s.id,
      studentName: s.name,
      nisn: s.nisn,
      className: selectedClass,
      subject: selectedSubject,
      assessmentType: assessmentType as any,
      score: scores[s.id]?.score || 80,
      date: '2026-11-06',
      notes: scores[s.id]?.notes || '-'
    }));

    const res = await gradeService.saveBatchGrades(payload);
    if (res.success) {
      setSaveStatus('Nilai berhasil disimpan!');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0a192f] text-white w-full max-w-5xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Penilaian <span className="text-slate-400 font-normal">›</span> Input Nilai
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar Matching Image 1 */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-900/60">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Kelas</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="VI A">VI A</option>
                <option value="VI B">VI B</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Mapel</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Matematika">Matematika</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="IPA">IPA</option>
                <option value="IPS">IPS</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Jenis Penilaian</label>
              <select
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Ulangan Harian">Ulangan Harian</option>
                <option value="Tugas">Tugas Portofolio</option>
                <option value="UTS">Sumatif Tengah Semester</option>
                <option value="UAS">Sumatif Akhir Semester</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Tanggal</label>
              <input
                type="text"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <button
                onClick={handleSave}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/30"
              >
                <Save className="w-3.5 h-3.5" /> Simpan Nilai
              </button>
            </div>
          </div>

          {saveStatus && (
            <div className="mt-3 p-2 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{saveStatus}</span>
            </div>
          )}
        </div>

        {/* Table Matching Image 1 */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">NISN</th>
                <th className="py-3 px-4 w-28">Nilai</th>
                <th className="py-3 px-4">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {students.slice(0, 5).map((student, idx) => (
                <tr key={student.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 text-center text-slate-500 font-bold">{idx + 1}</td>
                  <td className="py-3 px-4 font-bold text-white">{student.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{student.nisn}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={scores[student.id]?.score ?? 85}
                      onChange={(e) => handleScoreChange(student.id, parseInt(e.target.value) || 0)}
                      className="w-20 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-center focus:outline-none focus:border-amber-400"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      placeholder="Catatan guru..."
                      value={scores[student.id]?.notes ?? '-'}
                      onChange={(e) => handleNotesChange(student.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-xs focus:outline-none focus:border-amber-400"
                    />
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
