import { apiRequest, isBackendConfigured } from './api.js';
import { mockAttendance, mockStudents } from './mockData.ts';

export const attendanceService = {
  /**
   * Ambil riwayat presensi berdasarkan kelas dan tanggal
   */
  async getAttendanceRecords(className = 'VI A', date = '2026-11-06', schoolId = 'sdn-sumberejo-04') {
    if (!isBackendConfigured()) {
      const records = mockAttendance.filter(a => a.className === className && a.date === date);
      return { success: true, data: records, isSimulated: true };
    }
    try {
      return await apiRequest('getAttendance', { className, date, schoolId });
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Catat presensi via token QR
   */
  async recordQR(qrToken, className, schoolId = 'sdn-sumberejo-04') {
    if (!isBackendConfigured()) {
      // Validasi token unik terhadap database siswa simulasi
      const student = mockStudents.find(s => s.qrToken === qrToken);
      if (!student) {
        return { success: false, error: 'Token QR tidak valid atau tidak terdaftar!', isSimulated: true };
      }
      if (className && student.className !== className) {
        return { success: false, error: `Siswa terdaftar di kelas ${student.className}, bukan ${className}!`, isSimulated: true };
      }

      // Cek duplikasi
      const today = new Date().toISOString().split('T')[0];
      const existing = mockAttendance.find(a => a.studentId === student.id && a.date === today);
      if (existing) {
        return { success: false, error: `Siswa ${student.name} sudah tercatat hadir pada pukul ${existing.time}!`, isSimulated: true };
      }

      const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
      const newRecord = {
        id: `att-${Date.now()}`,
        schoolId,
        studentId: student.id,
        studentName: student.name,
        nisn: student.nisn,
        className: student.className,
        date: today,
        time: nowTime,
        status: 'hadir',
        method: 'qr',
        recordedBy: 'Guru Pengampu'
      };

      mockAttendance.unshift(newRecord);
      return {
        success: true,
        data: newRecord,
        isSimulated: true,
        message: `Presensi Berhasil! ${student.name} (${student.className}) - ${nowTime}`
      };
    }

    try {
      return await apiRequest('recordQRAttendance', { qrToken, className, schoolId });
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Catat presensi manual (hadir, izin, sakit, alpa)
   */
  async recordManual(studentId, className, status, notes = '', schoolId = 'sdn-sumberejo-04') {
    if (!isBackendConfigured()) {
      const student = mockStudents.find(s => s.id === studentId);
      const today = new Date().toISOString().split('T')[0];
      const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');

      // Update jika sudah ada atau buat baru
      const existingIdx = mockAttendance.findIndex(a => a.studentId === studentId && a.date === today);
      const record = {
        id: existingIdx >= 0 ? mockAttendance[existingIdx].id : `att-${Date.now()}`,
        schoolId,
        studentId,
        studentName: student?.name || 'Siswa',
        nisn: student?.nisn || '',
        className,
        date: today,
        time: nowTime,
        status,
        method: 'manual',
        recordedBy: 'Guru Pengampu'
      };

      if (existingIdx >= 0) {
        mockAttendance[existingIdx] = record;
      } else {
        mockAttendance.unshift(record);
      }

      return { success: true, data: record, isSimulated: true };
    }

    try {
      return await apiRequest('recordManualAttendance', { studentId, className, status, notes, schoolId });
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
