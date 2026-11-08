import { School, User, Teacher, Student, ClassRoom, AttendanceRecord, GradeRecord, TeachingResource } from '../types';

export const mockSchool: School = {
  id: "sdn-sumberejo-04",
  name: "SDN SUMBEREJO 04",
  npsn: "20523456",
  address: "Jl. Ki Hajar Dewantara No. 12",
  district: "Kec. Ambulu",
  city: "Jember",
  motto: "Berprestasi • Berkarakter • Berakhlak Mulia",
  academicYear: "2026/2027"
};

export const mockUsers: User[] = [
  {
    id: "usr-01",
    username: "reza.fahlevi",
    fullName: "Reza Fahlevi",
    role: "teacher",
    schoolId: "sdn-sumberejo-04",
    nip: "19890412 201403 1 002"
  },
  {
    id: "usr-02",
    username: "admin.sekolah",
    fullName: "Budi Santoso, S.Pd",
    role: "school_admin",
    schoolId: "sdn-sumberejo-04",
    nip: "19820515 200801 1 011"
  },
  {
    id: "usr-00",
    username: "superadmin",
    fullName: "Administrator Pusat",
    role: "super_admin",
    schoolId: "all"
  }
];

export const mockClasses: ClassRoom[] = [
  { id: "cls-1", schoolId: "sdn-sumberejo-04", name: "VI A", level: 6, homeroomTeacherId: "usr-01", homeroomTeacherName: "Reza Fahlevi", studentCount: 32, academicYear: "2026/2027" },
  { id: "cls-2", schoolId: "sdn-sumberejo-04", name: "VI B", level: 6, homeroomTeacherId: "usr-03", homeroomTeacherName: "Siti Rahma, S.Pd", studentCount: 30, academicYear: "2026/2027" },
  { id: "cls-3", schoolId: "sdn-sumberejo-04", name: "V A", level: 5, homeroomTeacherId: "usr-04", homeroomTeacherName: "Ahmad Yani, S.Pd", studentCount: 28, academicYear: "2026/2027" },
  { id: "cls-4", schoolId: "sdn-sumberejo-04", name: "V B", level: 5, homeroomTeacherId: "usr-05", homeroomTeacherName: "Dewi Sartika, S.Pd", studentCount: 29, academicYear: "2026/2027" },
  { id: "cls-5", schoolId: "sdn-sumberejo-04", name: "IV A", level: 4, homeroomTeacherId: "usr-06", homeroomTeacherName: "Joko Widodo, S.Pd", studentCount: 31, academicYear: "2026/2027" },
  { id: "cls-6", schoolId: "sdn-sumberejo-04", name: "IV B", level: 4, homeroomTeacherId: "usr-07", homeroomTeacherName: "Megawati, S.Pd", studentCount: 30, academicYear: "2026/2027" }
];

export const mockStudents: Student[] = [
  { id: "std-01", schoolId: "sdn-sumberejo-04", nisn: "1234567890", nis: "001", name: "Andi Pratama", className: "VI A", gender: "L", qrToken: "TKN-SDN4-VI-001-ANDI", status: "active" },
  { id: "std-02", schoolId: "sdn-sumberejo-04", nisn: "1234567891", nis: "002", name: "Ahmad Fauzi", className: "VI A", gender: "L", qrToken: "TKN-SDN4-VI-002-FAUZI", status: "active" },
  { id: "std-03", schoolId: "sdn-sumberejo-04", nisn: "1234567892", nis: "003", name: "Budi Santoso", className: "VI A", gender: "L", qrToken: "TKN-SDN4-VI-003-BUDI", status: "active" },
  { id: "std-04", schoolId: "sdn-sumberejo-04", nisn: "1234567893", nis: "004", name: "Citra Lestari", className: "VI A", gender: "P", qrToken: "TKN-SDN4-VI-004-CITRA", status: "active" },
  { id: "std-05", schoolId: "sdn-sumberejo-04", nisn: "1234567894", nis: "005", name: "Deni Saputra", className: "VI A", gender: "L", qrToken: "TKN-SDN4-VI-005-DENI", status: "active" },
  { id: "std-06", schoolId: "sdn-sumberejo-04", nisn: "1234567895", nis: "006", name: "Eika Wijaya", className: "VI A", gender: "P", qrToken: "TKN-SDN4-VI-006-EIKA", status: "active" },
  { id: "std-07", schoolId: "sdn-sumberejo-04", nisn: "1234567896", nis: "007", name: "Nur Aini", className: "VI A", gender: "P", qrToken: "TKN-SDN4-VI-007-NUR", status: "active" },
  { id: "std-08", schoolId: "sdn-sumberejo-04", nisn: "1234567897", nis: "008", name: "Rizky Pratama", className: "VI A", gender: "L", qrToken: "TKN-SDN4-VI-008-RIZKY", status: "active" },
  { id: "std-09", schoolId: "sdn-sumberejo-04", nisn: "1234567898", nis: "009", name: "Siti Nurhaliza", className: "VI A", gender: "P", qrToken: "TKN-SDN4-VI-009-SITI", status: "active" },
  { id: "std-10", schoolId: "sdn-sumberejo-04", nisn: "1234567899", nis: "010", name: "Dika Santoso", className: "VI A", gender: "L", qrToken: "TKN-SDN4-VI-010-DIKA", status: "active" }
];

export const mockTeachers: Teacher[] = [
  { id: "tch-01", schoolId: "sdn-sumberejo-04", nip: "19890412 201403 1 002", name: "Reza Fahlevi, S.Pd", subject: "Guru Kelas VI", assignedClasses: ["VI A"], status: "active", email: "reza.fahlevi@sdn-sumberejo04.sch.id" },
  { id: "tch-02", schoolId: "sdn-sumberejo-04", nip: "19850210 201001 2 018", name: "Siti Rahma, S.Pd", subject: "Guru Kelas VI", assignedClasses: ["VI B"], status: "active" },
  { id: "tch-03", schoolId: "sdn-sumberejo-04", nip: "19910824 201903 1 007", name: "Ahmad Fauzi, S.Pd", subject: "Pendidikan Jasmani", assignedClasses: ["VI A", "VI B", "V A"], status: "active" },
  { id: "tch-04", schoolId: "sdn-sumberejo-04", nip: "19871105 201101 2 009", name: "Nurul Hidayah, S.Pd", subject: "Pendidikan Agama Islam", assignedClasses: ["VI A", "VI B"], status: "active" },
  { id: "tch-05", schoolId: "sdn-sumberejo-04", nip: "19940316 202203 2 014", name: "Rina Astuti, S.Pd", subject: "Bahasa Inggris", assignedClasses: ["VI A", "VI B", "V A"], status: "active" },
  { id: "tch-06", schoolId: "sdn-sumberejo-04", nip: "19830612 200902 1 005", name: "Drs. Hendro Wibowo", subject: "Matematika", assignedClasses: ["VI A"], status: "active" }
];

export const mockAttendance: AttendanceRecord[] = [
  { id: "att-01", schoolId: "sdn-sumberejo-04", studentId: "std-01", studentName: "Andi Pratama", nisn: "1234567890", className: "VI A", date: "2026-11-06", time: "07:24", status: "hadir", method: "qr", recordedBy: "Reza Fahlevi" },
  { id: "att-02", schoolId: "sdn-sumberejo-04", studentId: "std-02", studentName: "Ahmad Fauzi", nisn: "1234567891", className: "VI A", date: "2026-11-06", time: "07:18", status: "hadir", method: "qr", recordedBy: "Reza Fahlevi" },
  { id: "att-03", schoolId: "sdn-sumberejo-04", studentId: "std-03", studentName: "Budi Santoso", nisn: "1234567892", className: "VI A", date: "2026-11-06", time: "07:20", status: "hadir", method: "qr", recordedBy: "Reza Fahlevi" },
  { id: "att-04", schoolId: "sdn-sumberejo-04", studentId: "std-04", studentName: "Citra Lestari", nisn: "1234567893", className: "VI A", date: "2026-11-06", time: "07:22", status: "hadir", method: "qr", recordedBy: "Reza Fahlevi" },
  { id: "att-05", schoolId: "sdn-sumberejo-04", studentId: "std-05", studentName: "Deni Saputra", nisn: "1234567894", className: "VI A", date: "2026-11-06", time: "07:25", status: "hadir", method: "qr", recordedBy: "Reza Fahlevi" },
  { id: "att-06", schoolId: "sdn-sumberejo-04", studentId: "std-06", studentName: "Eika Wijaya", nisn: "1234567895", className: "VI A", date: "2026-11-06", time: "07:27", status: "hadir", method: "qr", recordedBy: "Reza Fahlevi" },
  { id: "att-07", schoolId: "sdn-sumberejo-04", studentId: "std-07", studentName: "Nur Aini", nisn: "1234567896", className: "VI A", date: "2026-11-06", time: "07:30", status: "izin", method: "manual", recordedBy: "Reza Fahlevi" },
  { id: "att-08", schoolId: "sdn-sumberejo-04", studentId: "std-08", studentName: "Rizky Pratama", nisn: "1234567897", className: "VI A", date: "2026-11-06", time: "07:30", status: "sakit", method: "manual", recordedBy: "Reza Fahlevi" },
  { id: "att-09", schoolId: "sdn-sumberejo-04", studentId: "std-09", studentName: "Siti Nurhaliza", nisn: "1234567898", className: "VI A", date: "2026-11-06", time: "07:30", status: "alpa", method: "manual", recordedBy: "Reza Fahlevi" },
  { id: "att-10", schoolId: "sdn-sumberejo-04", studentId: "std-10", studentName: "Dika Santoso", nisn: "1234567899", className: "VI A", date: "2026-11-06", time: "07:28", status: "hadir", method: "qr", recordedBy: "Reza Fahlevi" }
];

export const mockGrades: GradeRecord[] = [
  { id: "grd-01", schoolId: "sdn-sumberejo-04", studentId: "std-02", studentName: "Ahmad Fauzi", nisn: "1234567891", className: "VI A", subject: "Matematika", assessmentType: "Ulangan Harian", score: 90, date: "2026-11-06" },
  { id: "grd-02", schoolId: "sdn-sumberejo-04", studentId: "std-07", studentName: "Nur Aini", nisn: "1234567892", className: "VI A", subject: "Matematika", assessmentType: "Ulangan Harian", score: 85, date: "2026-11-06" },
  { id: "grd-03", schoolId: "sdn-sumberejo-04", studentId: "std-08", studentName: "Rizky Pratama", nisn: "1234567893", className: "VI A", subject: "Matematika", assessmentType: "Ulangan Harian", score: 88, date: "2026-11-06" },
  { id: "grd-04", schoolId: "sdn-sumberejo-04", studentId: "std-09", studentName: "Siti Nurhaliza", nisn: "1234567894", className: "VI A", subject: "Matematika", assessmentType: "Ulangan Harian", score: 92, date: "2026-11-06" },
  { id: "grd-05", schoolId: "sdn-sumberejo-04", studentId: "std-10", studentName: "Dika Santoso", nisn: "1234567895", className: "VI A", subject: "Matematika", assessmentType: "Ulangan Harian", score: 87, date: "2026-11-06" }
];

export const mockResources: TeachingResource[] = [
  {
    id: "res-01",
    title: "Modul Ajar Matematika Kelas VI",
    category: "Modul Ajar",
    gradeLevel: "Kelas VI",
    subject: "Matematika",
    fileType: "pdf",
    fileSize: "2.5 MB",
    driveFileId: "DRIVE_FILE_01",
    downloadUrl: "#",
    uploadedBy: "Pusat Kurikulum",
    updatedAt: "2026-10-15"
  },
  {
    id: "res-02",
    title: "ATP Kelas V Bahasa Indonesia",
    category: "Modul Ajar",
    gradeLevel: "Kelas V",
    subject: "Bahasa Indonesia",
    fileType: "doc",
    fileSize: "1.8 MB",
    driveFileId: "DRIVE_FILE_02",
    downloadUrl: "#",
    uploadedBy: "Pusat Kurikulum",
    updatedAt: "2026-10-18"
  },
  {
    id: "res-03",
    title: "Program Tahunan 2026/2027",
    category: "Prota",
    gradeLevel: "Semua Kelas",
    subject: "Administrasi",
    fileType: "xls",
    fileSize: "1.2 MB",
    driveFileId: "DRIVE_FILE_03",
    downloadUrl: "#",
    uploadedBy: "Super Admin",
    updatedAt: "2026-09-01"
  },
  {
    id: "res-04",
    title: "Program Semester Ganjil Kelas VI",
    category: "Promes",
    gradeLevel: "Kelas VI",
    subject: "Tematik",
    fileType: "xls",
    fileSize: "1.5 MB",
    driveFileId: "DRIVE_FILE_04",
    downloadUrl: "#",
    uploadedBy: "Super Admin",
    updatedAt: "2026-09-10"
  },
  {
    id: "res-05",
    title: "Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) IPAS",
    category: "KKTP",
    gradeLevel: "Kelas VI",
    subject: "IPAS",
    fileType: "pdf",
    fileSize: "3.1 MB",
    driveFileId: "DRIVE_FILE_05",
    downloadUrl: "#",
    uploadedBy: "Pusat Kurikulum",
    updatedAt: "2026-10-05"
  }
];
