/**
 * Definisi Tipe Sistem Portal Administrasi Guru
 */

export type UserRole = 'super_admin' | 'school_admin' | 'teacher';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  schoolId: string;
  avatarUrl?: string;
  nip?: string;
}

export interface School {
  id: string;
  name: string;
  npsn?: string;
  address: string;
  district: string;
  city: string;
  logoUrl?: string;
  motto: string;
  academicYear: string;
}

export interface Teacher {
  id: string;
  schoolId: string;
  nip: string;
  name: string;
  email?: string;
  phone?: string;
  subject: string;
  assignedClasses: string[];
  status: 'active' | 'inactive';
}

export interface Student {
  id: string;
  schoolId: string;
  nisn: string;
  nis: string;
  name: string;
  className: string;
  gender: 'L' | 'P';
  photoUrl?: string;
  qrToken: string;
  status: 'active' | 'graduated' | 'transferred';
}

export interface ClassRoom {
  id: string;
  schoolId: string;
  name: string; // e.g. "VI A"
  level: number; // e.g. 6
  homeroomTeacherId: string;
  homeroomTeacherName: string;
  studentCount: number;
  academicYear: string;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  code: string;
}

export type AttendanceStatus = 'hadir' | 'izin' | 'sakit' | 'alpa';

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  nisn: string;
  className: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AttendanceStatus;
  method: 'qr' | 'manual';
  recordedBy: string;
}

export interface GradeRecord {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  nisn: string;
  className: string;
  subject: string;
  assessmentType: 'Ulangan Harian' | 'Tugas' | 'UTS' | 'UAS';
  score: number;
  date: string;
  notes?: string;
}

export interface TeachingResource {
  id: string;
  title: string;
  category: 'Modul Ajar' | 'Prota' | 'Promes' | 'KKTP' | 'Bahan Ajar' | 'Silabus';
  gradeLevel: string; // "Kelas VI"
  subject: string;
  fileType: 'pdf' | 'doc' | 'xls';
  fileSize: string;
  driveFileId: string;
  downloadUrl: string;
  uploadedBy: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  isSimulated?: boolean;
}
