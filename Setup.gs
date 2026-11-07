/**
 * ============================================================================
 * LMS EDUCLOUD - DATABASE SETUP & TRIGGER CONFIGURATION (Setup.gs)
 * ============================================================================
 * Deskripsi : Skrip inisialisasi database Google Sheets untuk Learning Management System (LMS).
 *             Membuat tabel, header, validasi, styling warna, data sampel, dan trigger otomatis.
 * Penulis   : Google Apps Script Developer
 * ============================================================================
 */

// Konstanta Nama-Nama Sheet Database
const SHEET_NAMES = {
  CONFIG: 'Config',
  KELAS: 'Kelas',
  SISWA: 'Siswa',
  MATERI: 'Materi',
  TUGAS: 'Tugas',
  PENGUMPULAN: 'Pengumpulan',
  LOGS: 'Aktivitas_Log'
};

/**
 * Fungsi Utama: Menyiapkan seluruh database dan struktur sheet secara otomatis.
 * Jalankan fungsi ini SATU KALI saat pertama kali memasang aplikasi.
 */
function setupLMS() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("=== Memulai Inisialisasi Database LMS EduCloud ===");

  // 1. Inisialisasi Sheet Config
  setupConfigSheet(ss);

  // 2. Inisialisasi Sheet Kelas
  setupKelasSheet(ss);

  // 3. Inisialisasi Sheet Siswa
  setupSiswaSheet(ss);

  // 4. Inisialisasi Sheet Materi
  setupMateriSheet(ss);

  // 5. Inisialisasi Sheet Tugas
  setupTugasSheet(ss);

  // 6. Inisialisasi Sheet Pengumpulan
  setupPengumpulanSheet(ss);

  // 7. Inisialisasi Sheet Log Aktivitas
  setupLogSheet(ss);

  // 8. Hapus sheet bawaan "Sheet1" jika masih ada dan kosong
  hapusSheetBawaan(ss);

  // 9. Pasang trigger otomatis berkala
  pasangTriggerOtomatis();

  Logger.log("=== Inisialisasi Database Selesai dengan Sukses! ===");
}

/**
 * Membuat dan memformat sheet Config (Pengaturan Sistem & Kredensial Admin)
 */
function setupConfigSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.CONFIG);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.CONFIG);
  }

  const headers = ['Key', 'Value', 'Keterangan', 'Terakhir_Diperbarui'];
  const defaultData = [
    ['ADMIN_USERNAME', 'admin', 'Username default untuk login Admin', new Date()],
    ['ADMIN_PASSWORD', 'admin123', 'Password default untuk login Admin (bisa diganti di dashboard)', new Date()],
    ['APP_NAME', 'LMS EduCloud', 'Nama Aplikasi Platform Pembelajaran', new Date()],
    ['DEFAULT_STUDENT_PASSWORD', 'siswa123', 'Password default untuk seluruh akun siswa baru', new Date()],
    ['INSTITUSI', 'Sekolah / Lembaga EduCloud', 'Nama Lembaga atau Sekolah', new Date()]
  ];

  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, defaultData.length, headers.length).setValues(defaultData);

  formatHeaderSheet(sheet, headers.length, '#6B21A8'); // Warna Ungu Gelap
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Membuat dan memformat sheet Kelas
 */
function setupKelasSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.KELAS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.KELAS);
  }

  const headers = ['ID_Kelas', 'Nama_Kelas', 'Tingkat', 'Deskripsi', 'CreatedAt'];
  const now = new Date();
  const sampleData = [
    ['KLS-001', '10 MIPA 1', 'Kelas 10', 'Kelas Matematika dan Ilmu Pengetahuan Alam 1', now],
    ['KLS-002', '10 MIPA 2', 'Kelas 10', 'Kelas Matematika dan Ilmu Pengetahuan Alam 2', now],
    ['KLS-003', '11 IPS 1', 'Kelas 11', 'Kelas Ilmu Pengetahuan Sosial 1', now]
  ];

  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);

  formatHeaderSheet(sheet, headers.length, '#7C3AED'); // Warna Violet Modern
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Membuat dan memformat sheet Siswa
 */
function setupSiswaSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.SISWA);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.SISWA);
  }

  const headers = ['ID_Siswa', 'Nama_Lengkap', 'ID_Kelas', 'Nama_Kelas', 'Username', 'Password', 'CreatedAt'];
  const now = new Date();
  const sampleData = [
    ['SIS-001', 'Ahmad Fauzi', 'KLS-001', '10 MIPA 1', 'ahmad.fauzi', 'siswa123', now],
    ['SIS-002', 'Budi Pratama', 'KLS-001', '10 MIPA 1', 'budi.pratama', 'siswa123', now],
    ['SIS-003', 'Citra Lestari', 'KLS-002', '10 MIPA 2', 'citra.lestari', 'siswa123', now],
    ['SIS-004', 'Dewi Anggraini', 'KLS-003', '11 IPS 1', 'dewi.anggraini', 'siswa123', now]
  ];

  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);

  formatHeaderSheet(sheet, headers.length, '#8B5CF6'); // Warna Ungu Muda
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Membuat dan memformat sheet Materi
 * Mendukung Link Youtube, Google Drive, dan Website
 */
function setupMateriSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.MATERI);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.MATERI);
  }

  const headers = ['ID_Materi', 'Judul', 'ID_Kelas', 'Nama_Kelas', 'Tipe_Materi', 'Link_Resource', 'Deskripsi', 'CreatedAt'];
  const now = new Date();
  const sampleData = [
    [
      'MAT-001',
      'Pengantar Aljabar Linear & Matriks',
      'KLS-001',
      '10 MIPA 1',
      'youtube',
      'https://www.youtube.com/watch?v=fNk_zzaMoSs',
      'Video penjelasan konsep dasar vektor dan operasi perkalian matriks.',
      now
    ],
    [
      'MAT-002',
      'E-Book Rangkuman Fisika: Hukum Newton & Gravitasi',
      'KLS-001',
      '10 MIPA 1',
      'gdrive',
      'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view',
      'Modul bacaan pegangan siswa bab dinamika gerak lurus dan rotasi.',
      now
    ],
    [
      'MAT-003',
      'Simulasi Interaktif Fenomena Geografi Dunia',
      'KLS-003',
      '11 IPS 1',
      'website',
      'https://earth.google.com/web/',
      'Eksplorasi bentang alam bumi secara 3D langsung di browser web.',
      now
    ]
  ];

  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);

  formatHeaderSheet(sheet, headers.length, '#6366F1'); // Indigo
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Membuat dan memformat sheet Tugas / Soal
 */
function setupTugasSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.TUGAS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.TUGAS);
  }

  const headers = ['ID_Tugas', 'Judul_Tugas', 'ID_Kelas', 'Nama_Kelas', 'Deskripsi', 'Deadline', 'CreatedAt'];
  const now = new Date();
  const sampleData = [
    [
      'TGS-001',
      'Latihan 1: Operasi Perkalian Matriks',
      'KLS-001',
      '10 MIPA 1',
      'Kerjakan soal latihan no 1 sampai 5. Tuliskan langkah pengerjaan di lembar kerja atau lampirkan link Google Drive foto jawabanmu.',
      '2026-12-31 23:59',
      now
    ],
    [
      'TGS-002',
      'Esai Singkat: Analisis Dampak Urbanisasi',
      'KLS-003',
      '11 IPS 1',
      'Tuliskan esai minimal 300 kata tentang faktor penarik dan pendorong urbanisasi di kota-kota besar Indonesia.',
      '2026-12-31 23:59',
      now
    ]
  ];

  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);

  formatHeaderSheet(sheet, headers.length, '#4F46E5'); // Deep Indigo
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Membuat dan memformat sheet Pengumpulan Tugas Siswa
 */
function setupPengumpulanSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.PENGUMPULAN);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.PENGUMPULAN);
  }

  const headers = [
    'ID_Pengumpulan',
    'ID_Tugas',
    'ID_Siswa',
    'Nama_Siswa',
    'Nama_Kelas',
    'Jawaban_Teks',
    'Link_Lampiran',
    'Nilai',
    'Catatan_Guru',
    'Status',
    'SubmittedAt'
  ];

  const now = new Date();
  const sampleData = [
    [
      'SUB-001',
      'TGS-001',
      'SIS-001',
      'Ahmad Fauzi',
      '10 MIPA 1',
      'Berikut pengerjaan matriks 2x2 dan 3x3 beserta determinannya telah saya selesaikan dengan lengkap.',
      'https://drive.google.com/file/d/sampleSubmissionAhmad/view',
      '95',
      'Pengerjaan sangat sistematis dan benar semua. Pertahankan!',
      'Dinilai',
      now
    ]
  ];

  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);

  formatHeaderSheet(sheet, headers.length, '#10B981'); // Emerald Green
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Membuat dan memformat sheet Log Aktivitas
 */
function setupLogSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.LOGS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.LOGS);
  }

  const headers = ['Timestamp', 'Pelaku', 'Role', 'Aksi', 'Detail'];
  const now = new Date();
  const sampleData = [
    [now, 'SYSTEM', 'SYSTEM', 'SETUP_DATABASE', 'Inisialisasi tabel awal LMS EduCloud']
  ];

  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);

  formatHeaderSheet(sheet, headers.length, '#64748B'); // Slate
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Helper untuk memberikan styling header tabel yang profesional
 */
function formatHeaderSheet(sheet, totalKolom, backgroundColor) {
  const headerRange = sheet.getRange(1, 1, 1, totalKolom);
  headerRange
    .setBackground(backgroundColor)
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setFontFamily('Segoe UI')
    .setFontSize(10)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 35);
  sheet.setFrozenRows(1);
}

/**
 * Helper menghapus sheet default "Sheet1" jika ada
 */
function hapusSheetBawaan(ss) {
  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Sheet 1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch (e) {
      Logger.log("Info: Tidak dapat menghapus sheet default: " + e.message);
    }
  }
}

/**
 * Memasang Time-Driven Trigger Otomatis
 * Menjalankan fungsi maintenance atau backup log setiap malam (pukul 01:00 - 02:00)
 */
function pasangTriggerOtomatis() {
  // Hapus trigger lama jika sudah ada untuk fungsi ini agar tidak duplikat
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'triggerDailyMaintenance') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // Buat trigger harian baru
  ScriptApp.newTrigger('triggerDailyMaintenance')
    .timeBased()
    .everyDays(1)
    .atHour(1)
    .create();

  Logger.log("Trigger harian 'triggerDailyMaintenance' berhasil dipasang.");
}

/**
 * Fungsi yang dipanggil oleh Trigger Harian
 * Melakukan perapian log dan pengecekan konsistensi data
 */
function triggerDailyMaintenance() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = ss.getSheetByName(SHEET_NAMES.LOGS);
  if (!logSheet) return;

  const lastRow = logSheet.getLastRow();
  // Jika log melebihi 2000 baris, simpan 500 baris terbaru untuk menjaga performa
  if (lastRow > 2000) {
    const rowsToDelete = lastRow - 501;
    logSheet.deleteRows(2, rowsToDelete);
  }

  // Catat event maintenance
  logSheet.appendRow([new Date(), 'SYSTEM', 'TRIGGER', 'DAILY_MAINTENANCE', 'Pembersihan log berkala berhasil dilakukan.']);
}
