/**
 * ============================================================================
 * LMS EDUCLOUD - BACKEND UTAMA & REST API (Code.gs)
 * ============================================================================
 * Deskripsi : Logika backend Google Apps Script untuk melayani Web App dan
 *             REST API untuk frontend (GitHub / Vercel).
 *             Mendukung operasi CRUD, autentikasi Admin & Siswa, serta batch processing.
 * Penulis   : Google Apps Script Developer
 * ============================================================================
 */

// Referensi Nama Sheet Database
const DB_SHEETS = {
  CONFIG: 'Config',
  KELAS: 'Kelas',
  SISWA: 'Siswa',
  MATERI: 'Materi',
  TUGAS: 'Tugas',
  PENGUMPULAN: 'Pengumpulan',
  LOGS: 'Aktivitas_Log'
};

/**
 * Endpoint Utama HTTP GET
 * Melayani Web App HTML Service atau permintaan REST API via GET
 */
function doGet(e) {
  // Jika terdapat parameter 'action', proses sebagai permintaan REST API JSON
  if (e && e.parameter && e.parameter.action) {
    return tanganiPermintaanAPI(e.parameter.action, e.parameter);
  }

  // Jika diakses langsung via browser tanpa action, tampilkan Web App
  try {
    return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('LMS EduCloud - Smart Learning Platform')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  } catch (err) {
    // Fallback jika Index.html tidak ada dalam Apps Script project
    return ContentService.createTextOutput(JSON.stringify({
      status: 'online',
      message: 'LMS EduCloud API Backend aktif dan siap menerima permintaan.',
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Endpoint Utama HTTP POST
 * Melayani seluruh request mutasi data dari Frontend Vercel / Web App
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseError) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action || (e && e.parameter ? e.parameter.action : '');
    return tanganiPermintaanAPI(action, payload);
  } catch (error) {
    return buatResponJSON({
      success: false,
      message: 'Terjadi kesalahan pada server: ' + error.message
    });
  }
}

/**
 * Router Pusat Permintaan API
 * Mengarahkan setiap 'action' ke fungsi handler yang sesuai
 */
function tanganiPermintaanAPI(action, params) {
  try {
    let hasil = null;

    switch (action) {
      // --- AUTENTIKASI ---
      case 'loginAdmin':
        hasil = prosesLoginAdmin(params.username, params.password);
        break;

      case 'gantiKredensialAdmin':
        hasil = prosesGantiKredensialAdmin(
          params.usernameLama,
          params.passwordLama,
          params.usernameBaru,
          params.passwordBaru
        );
        break;

      case 'loginSiswa':
        hasil = prosesLoginSiswa(params.username, params.password);
        break;

      // --- DASHBOARD & STATISTIK ---
      case 'getDashboardStats':
        hasil = ambilStatistikDashboard();
        break;

      // --- KELAS ---
      case 'getKelas':
        hasil = ambilDaftarKelas();
        break;

      case 'tambahKelas':
        hasil = simpanKelasSatuan(params.namaKelas, params.tingkat, params.deskripsi);
        break;

      case 'bulkTambahKelas':
        hasil = simpanKelasMasal(params.daftarKelas);
        break;

      case 'hapusKelas':
        hasil = hapusDataKelas(params.idKelas);
        break;

      // --- SISWA ---
      case 'getSiswa':
        hasil = ambilDaftarSiswa(params.idKelas);
        break;

      case 'bulkTambahSiswa':
        hasil = simpanSiswaMasal(params.daftarNama, params.idKelas, params.namaKelas);
        break;

      case 'hapusSiswa':
        hasil = hapusDataSiswa(params.idSiswa);
        break;

      case 'resetPasswordSiswa':
        hasil = resetPasswordSiswaKeDefault(params.idSiswa);
        break;

      // --- MATERI ---
      case 'getMateri':
        hasil = ambilDaftarMateri(params.idKelas);
        break;

      case 'tambahMateri':
        hasil = simpanMateri(
          params.judul,
          params.idKelas,
          params.namaKelas,
          params.tipeMateri,
          params.linkResource,
          params.deskripsi
        );
        break;

      case 'hapusMateri':
        hasil = hapusDataMateri(params.idMateri);
        break;

      // --- TUGAS & SOAL ---
      case 'getTugas':
        hasil = ambilDaftarTugas(params.idKelas, params.idSiswa);
        break;

      case 'tambahTugas':
        hasil = simpanTugas(
          params.judul,
          params.idKelas,
          params.namaKelas,
          params.deskripsi,
          params.deadline
        );
        break;

      case 'hapusTugas':
        hasil = hapusDataTugas(params.idTugas);
        break;

      // --- PENGUMPULAN & PENILAIAN ---
      case 'submitTugas':
        hasil = simpanPengumpulanTugas(
          params.idTugas,
          params.idSiswa,
          params.namaSiswa,
          params.namaKelas,
          params.jawabanTeks,
          params.linkLampiran
        );
        break;

      case 'getPengumpulanByTugas':
        hasil = ambilPengumpulanBerdasarkanTugas(params.idTugas);
        break;

      case 'nilaiPengumpulan':
        hasil = simpanPenilaianSiswa(params.idPengumpulan, params.nilai, params.catatanGuru);
        break;

      default:
        hasil = {
          success: false,
          message: 'Aksi API tidak dikenali: ' + action
        };
        break;
    }

    return buatResponJSON(hasil);
  } catch (err) {
    return buatResponJSON({
      success: false,
      message: 'Gagal memproses aksi ' + action + ': ' + err.message
    });
  }
}

/**
 * Format respon JSON standar untuk CORS & Web App
 */
function buatResponJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// 1. MODUL AUTENTIKASI (ADMIN & SISWA)
// ============================================================================

/**
 * Verifikasi Login Akun Admin
 */
function prosesLoginAdmin(username, password) {
  if (!username || !password) {
    return { success: false, message: 'Username dan password wajib diisi.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName(DB_SHEETS.CONFIG);
  if (!configSheet) {
    return { success: false, message: 'Sheet konfigurasi database belum diinisialisasi.' };
  }

  // Gunakan getValues() sekali (hindari pembacaan per baris di dalam loop)
  const data = configSheet.getDataRange().getValues();
  let dbUsername = '';
  let dbPassword = '';

  for (let i = 1; i < data.length; i++) {
    const key = String(data[i][0]).trim();
    const val = String(data[i][1]).trim();
    if (key === 'ADMIN_USERNAME') dbUsername = val;
    if (key === 'ADMIN_PASSWORD') dbPassword = val;
  }

  if (username.trim() === dbUsername && password.trim() === dbPassword) {
    catatLogAktivitas(username, 'ADMIN', 'LOGIN', 'Admin berhasil login ke sistem');
    return {
      success: true,
      message: 'Login Admin berhasil!',
      user: {
        role: 'admin',
        username: dbUsername,
        nama: 'Administrator LMS'
      }
    };
  }

  return { success: false, message: 'Username atau password Admin salah.' };
}

/**
 * Admin Mengubah Username dan Password Akunnya Sendiri
 */
function prosesGantiKredensialAdmin(usernameLama, passwordLama, usernameBaru, passwordBaru) {
  if (!usernameLama || !passwordLama || !usernameBaru || !passwordBaru) {
    return { success: false, message: 'Semua kolom username dan password wajib diisi.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName(DB_SHEETS.CONFIG);
  if (!configSheet) return { success: false, message: 'Sheet konfigurasi tidak ditemukan.' };

  const data = configSheet.getDataRange().getValues();
  let rowUserIdx = -1;
  let rowPassIdx = -1;
  let currentUsername = '';
  let currentPassword = '';

  for (let i = 1; i < data.length; i++) {
    const key = String(data[i][0]).trim();
    if (key === 'ADMIN_USERNAME') {
      rowUserIdx = i + 1;
      currentUsername = String(data[i][1]).trim();
    }
    if (key === 'ADMIN_PASSWORD') {
      rowPassIdx = i + 1;
      currentPassword = String(data[i][1]).trim();
    }
  }

  // Verifikasi keabsahan kredensial lama
  if (usernameLama.trim() !== currentUsername || passwordLama.trim() !== currentPassword) {
    return { success: false, message: 'Kredensial lama tidak cocok.' };
  }

  const now = new Date();
  if (rowUserIdx !== -1) {
    configSheet.getRange(rowUserIdx, 2).setValue(usernameBaru.trim());
    configSheet.getRange(rowUserIdx, 4).setValue(now);
  }
  if (rowPassIdx !== -1) {
    configSheet.getRange(rowPassIdx, 2).setValue(passwordBaru.trim());
    configSheet.getRange(rowPassIdx, 4).setValue(now);
  }

  catatLogAktivitas(usernameBaru, 'ADMIN', 'GANTI_KREDENSIAL', 'Username/Password Admin berhasil diubah');

  return {
    success: true,
    message: 'Kredensial Admin berhasil diperbarui. Silakan gunakan kredensial baru untuk login selanjutnya.',
    usernameBaru: usernameBaru.trim()
  };
}

/**
 * Verifikasi Login Siswa Menggunakan Username & Password
 */
function prosesLoginSiswa(username, password) {
  if (!username || !password) {
    return { success: false, message: 'Username dan password siswa wajib diisi.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const siswaSheet = ss.getSheetByName(DB_SHEETS.SISWA);
  if (!siswaSheet) return { success: false, message: 'Sheet Siswa belum tersedia.' };

  const values = siswaSheet.getDataRange().getValues();
  // Header: ['ID_Siswa', 'Nama_Lengkap', 'ID_Kelas', 'Nama_Kelas', 'Username', 'Password', 'CreatedAt']
  const cleanUser = String(username).trim().toLowerCase();
  const cleanPass = String(password).trim();

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const dbUser = String(row[4]).trim().toLowerCase();
    const dbPass = String(row[5]).trim();

    if (dbUser === cleanUser && dbPass === cleanPass) {
      const studentData = {
        role: 'siswa',
        idSiswa: row[0],
        nama: row[1],
        idKelas: row[2],
        namaKelas: row[3],
        username: row[4]
      };

      catatLogAktivitas(row[1], 'SISWA', 'LOGIN', 'Siswa masuk ke portal kelas: ' + row[3]);

      return {
        success: true,
        message: 'Login siswa berhasil! Selamat datang, ' + row[1],
        student: studentData
      };
    }
  }

  return { success: false, message: 'Username atau password siswa salah.' };
}

// ============================================================================
// 2. MODUL STATISTIK DASHBOARD INTERAKTIF
// ============================================================================

/**
 * Mengumpulkan statistik lengkap untuk dashboard interaktif admin
 */
function ambilStatistikDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const kelasValues = ambilSemuaBarisData(ss, DB_SHEETS.KELAS);
  const siswaValues = ambilSemuaBarisData(ss, DB_SHEETS.SISWA);
  const materiValues = ambilSemuaBarisData(ss, DB_SHEETS.MATERI);
  const tugasValues = ambilSemuaBarisData(ss, DB_SHEETS.TUGAS);
  const pengumpulanValues = ambilSemuaBarisData(ss, DB_SHEETS.PENGUMPULAN);
  const logValues = ambilSemuaBarisData(ss, DB_SHEETS.LOGS);

  // Hitung jumlah materi per tipe
  let totalYoutube = 0;
  let totalGDrive = 0;
  let totalWebsite = 0;

  materiValues.forEach(row => {
    const tipe = String(row[4]).toLowerCase();
    if (tipe === 'youtube') totalYoutube++;
    else if (tipe === 'gdrive') totalGDrive++;
    else if (tipe === 'website') totalWebsite++;
  });

  // Hitung status pengumpulan tugas
  let tugasDinilai = 0;
  let tugasMenungguPenilaian = 0;

  pengumpulanValues.forEach(row => {
    const status = String(row[9]);
    if (status === 'Dinilai') tugasDinilai++;
    else tugasMenungguPenilaian++;
  });

  // Ambil 8 log aktivitas terakhir
  const recentLogs = logValues.slice(-8).reverse().map(r => ({
    timestamp: r[0],
    pelaku: r[1],
    role: r[2],
    aksi: r[3],
    detail: r[4]
  }));

  return {
    success: true,
    stats: {
      totalKelas: kelasValues.length,
      totalSiswa: siswaValues.length,
      totalMateri: materiValues.length,
      totalTugas: tugasValues.length,
      totalPengumpulan: pengumpulanValues.length,
      tugasDinilai: tugasDinilai,
      tugasMenungguPenilaian: tugasMenungguPenilaian,
      materiByType: {
        youtube: totalYoutube,
        gdrive: totalGDrive,
        website: totalWebsite
      }
    },
    recentLogs: recentLogs
  };
}

// ============================================================================
// 3. MODUL KELAS (MANAJEMEN KELAS & INPUT MASAL)
// ============================================================================

/**
 * Mengambil seluruh data kelas beserta jumlah siswa di masing-masing kelas
 */
function ambilDaftarKelas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const kelasRows = ambilSemuaBarisData(ss, DB_SHEETS.KELAS);
  const siswaRows = ambilSemuaBarisData(ss, DB_SHEETS.SISWA);

  // Hitung jumlah siswa per ID Kelas menggunakan Map di memori (bebas loop Google API)
  const siswaCountMap = {};
  siswaRows.forEach(row => {
    const idKelas = String(row[2]);
    siswaCountMap[idKelas] = (siswaCountMap[idKelas] || 0) + 1;
  });

  const daftarKelas = kelasRows.map(row => ({
    id: row[0],
    nama: row[1],
    tingkat: row[2],
    deskripsi: row[3],
    createdAt: row[4],
    jumlahSiswa: siswaCountMap[String(row[0])] || 0
  }));

  return { success: true, data: daftarKelas };
}

/**
 * Menyimpan satu kelas baru
 */
function simpanKelasSatuan(namaKelas, tingkat, deskripsi) {
  if (!namaKelas) return { success: false, message: 'Nama kelas tidak boleh kosong.' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DB_SHEETS.KELAS);
  if (!sheet) return { success: false, message: 'Sheet Kelas belum dibuat.' };

  const idKelas = 'KLS-' + Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const rowData = [idKelas, String(namaKelas).trim(), tingkat || 'Umum', deskripsi || '', now];

  sheet.appendRow(rowData);
  catatLogAktivitas('ADMIN', 'ADMIN', 'TAMBAH_KELAS', 'Menambahkan kelas: ' + namaKelas);

  return { success: true, message: 'Kelas berhasil ditambahkan.', idKelas: idKelas };
}

/**
 * Menyimpan banyak kelas sekaligus (Input Masal)
 * Mendukung format string multiline (dipisahkan baris baru) atau Array
 * Menggunakan batch setValues() untuk performa tinggi
 */
function simpanKelasMasal(daftarKelasInput) {
  if (!daftarKelasInput) {
    return { success: false, message: 'Daftar kelas tidak boleh kosong.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DB_SHEETS.KELAS);
  if (!sheet) return { success: false, message: 'Sheet Kelas belum dibuat.' };

  // Normalisasi input ke bentuk array
  let barisItem = [];
  if (Array.isArray(daftarKelasInput)) {
    barisItem = daftarKelasInput;
  } else if (typeof daftarKelasInput === 'string') {
    barisItem = daftarKelasInput.split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0);
  }

  if (barisItem.length === 0) {
    return { success: false, message: 'Tidak ada data kelas valid yang ditemukan.' };
  }

  const now = new Date();
  const rowsToInsert = [];

  for (let i = 0; i < barisItem.length; i++) {
    const item = barisItem[i];
    let nama = typeof item === 'object' ? item.nama : item;
    let tingkat = typeof item === 'object' ? (item.tingkat || 'Umum') : 'Umum';
    let deskripsi = typeof item === 'object' ? (item.deskripsi || '') : '';

    if (!nama || String(nama).trim() === '') continue;

    const idKelas = 'KLS-' + Math.floor(1000 + Math.random() * 9000) + '-' + (i + 1);
    rowsToInsert.push([idKelas, String(nama).trim(), tingkat, deskripsi, now]);
  }

  if (rowsToInsert.length === 0) {
    return { success: false, message: 'Tidak ada baris kelas yang valid untuk disimpan.' };
  }

  // Operasi Batch Tunggal menggunakan setValues (Optimasi GAS)
  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rowsToInsert.length, rowsToInsert[0].length).setValues(rowsToInsert);

  catatLogAktivitas('ADMIN', 'ADMIN', 'BULK_TAMBAH_KELAS', 'Berhasil menambahkan ' + rowsToInsert.length + ' kelas secara masal.');

  return {
    success: true,
    message: 'Berhasil menambahkan ' + rowsToInsert.length + ' kelas secara masal!',
    totalDitambahkan: rowsToInsert.length
  };
}

/**
 * Menghapus kelas berdasarkan ID Kelas
 */
function hapusDataKelas(idKelas) {
  if (!idKelas) return { success: false, message: 'ID Kelas wajib diisi.' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DB_SHEETS.KELAS);
  if (!sheet) return { success: false, message: 'Sheet Kelas tidak ditemukan.' };

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).trim() === String(idKelas).trim()) {
      sheet.deleteRow(i + 1);
      catatLogAktivitas('ADMIN', 'ADMIN', 'HAPUS_KELAS', 'Menghapus kelas dengan ID: ' + idKelas);
      return { success: true, message: 'Kelas berhasil dihapus.' };
    }
  }

  return { success: false, message: 'Kelas tidak ditemukan.' };
}

// ============================================================================
// 4. MODUL SISWA (INPUT SISWA MASAL & GENERATOR USERNAME OTOMATIS)
// ============================================================================

/**
 * Mengambil daftar siswa (opsional filter berdasarkan ID Kelas)
 */
function ambilDaftarSiswa(idKelasFilter) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rows = ambilSemuaBarisData(ss, DB_SHEETS.SISWA);

  let hasil = rows.map(r => ({
    id: r[0],
    nama: r[1],
    idKelas: r[2],
    namaKelas: r[3],
    username: r[4],
    password: r[5],
    createdAt: r[6]
  }));

  if (idKelasFilter && idKelasFilter !== 'ALL') {
    hasil = hasil.filter(s => String(s.idKelas) === String(idKelasFilter));
  }

  return { success: true, data: hasil };
}

/**
 * Input Siswa Masal (Hanya Nama).
 * Otomatis dibuatkan username ramah-sistem dan password default 'siswa123'.
 * Menggunakan batch insert setValues() untuk efisiensi maksimum.
 */
function simpanSiswaMasal(daftarNamaInput, idKelas, namaKelas) {
  if (!daftarNamaInput || !idKelas || !namaKelas) {
    return { success: false, message: 'Nama siswa, ID Kelas, dan Nama Kelas wajib diisi.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DB_SHEETS.SISWA);
  if (!sheet) return { success: false, message: 'Sheet Siswa belum tersedia.' };

  // Normalisasi daftar nama dari string multiline atau array
  let barisNama = [];
  if (Array.isArray(daftarNamaInput)) {
    barisNama = daftarNamaInput;
  } else if (typeof daftarNamaInput === 'string') {
    barisNama = daftarNamaInput.split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);
  }

  if (barisNama.length === 0) {
    return { success: false, message: 'Tidak ada nama siswa yang diberikan.' };
  }

  // Ambil seluruh username yang sudah ada untuk mencegah duplikasi (kollisi)
  const existingRows = ambilSemuaBarisData(ss, DB_SHEETS.SISWA);
  const existingUsernames = new Set();
  existingRows.forEach(r => {
    if (r[4]) existingUsernames.add(String(r[4]).trim().toLowerCase());
  });

  const defaultPassword = 'siswa123';
  const now = new Date();
  const rowsToInsert = [];
  const createdStudents = [];

  for (let i = 0; i < barisNama.length; i++) {
    const rawName = String(barisNama[i]).trim();
    if (!rawName) continue;

    // Bersihkan karakter khusus untuk format username
    let baseUsername = rawName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '.');

    if (!baseUsername) {
      baseUsername = 'siswa';
    }

    // Resolusi duplikasi username jika sudah dipakai siswa lain
    let generatedUsername = baseUsername;
    let counter = 1;
    while (existingUsernames.has(generatedUsername)) {
      counter++;
      generatedUsername = baseUsername + counter;
    }
    existingUsernames.add(generatedUsername);

    const idSiswa = 'SIS-' + Math.floor(1000 + Math.random() * 9000) + '-' + (i + 1);

    const newRow = [
      idSiswa,
      rawName,
      idKelas,
      namaKelas,
      generatedUsername,
      defaultPassword,
      now
    ];

    rowsToInsert.push(newRow);
    createdStudents.push({
      id: idSiswa,
      nama: rawName,
      username: generatedUsername,
      password: defaultPassword,
      kelas: namaKelas
    });
  }

  if (rowsToInsert.length === 0) {
    return { success: false, message: 'Tidak ada data siswa yang valid untuk dimasukkan.' };
  }

  // Operasi Batch Tunggal Menggunakan setValues() (Mencegah Google API Quota Limit)
  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rowsToInsert.length, rowsToInsert[0].length).setValues(rowsToInsert);

  catatLogAktivitas(
    'ADMIN',
    'ADMIN',
    'BULK_TAMBAH_SISWA',
    'Menambahkan ' + rowsToInsert.length + ' siswa ke kelas ' + namaKelas
  );

  return {
    success: true,
    message: 'Berhasil mendaftarkan ' + rowsToInsert.length + ' siswa secara masal!',
    totalDitambahkan: rowsToInsert.length,
    daftarAkun: createdStudents
  };
}

/**
 * Menghapus akun siswa berdasarkan ID
 */
function hapusDataSiswa(idSiswa) {
  if (!idSiswa) return { success: false, message: 'ID Siswa wajib diisi.' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DB_SHEETS.SISWA);
  if (!sheet) return { success: false, message: 'Sheet Siswa tidak ditemukan.' };

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).trim() === String(idSiswa).trim()) {
      sheet.deleteRow(i + 1);
      catatLogAktivitas('ADMIN', 'ADMIN', 'HAPUS_SISWA', 'Menghapus data siswa ID: ' + idSiswa);
      return { success: true, message: 'Data siswa berhasil dihapus.' };
    }
  }

  return { success: false, message: 'Siswa tidak ditemukan.' };
}

/**
 * Reset password akun siswa kembali ke default (siswa123)
 */
function resetPasswordSiswaKeDefault(idSiswa) {
  if (!idSiswa) return { success: false, message: 'ID Siswa wajib diisi.' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DB_SHEETS.SISWA);
  if (!sheet) return { success: false, message: 'Sheet Siswa tidak ditemukan.' };

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).trim() === String(idSiswa).trim()) {
      sheet.getRange(i + 1, 6).setValue('siswa123');
      catatLogAktivitas('ADMIN', 'ADMIN', 'RESET_PASSWORD', 'Reset password siswa ID: ' + idSiswa);
      return { success: true, message: 'Password siswa berhasil direset menjadi: siswa123' };
    }
  }

  return { success: false, message: 'Siswa tidak ditemukan.' };
}

// ============================================================================
// 5. MODUL MATERI (YOUTUBE, GOOGLE DRIVE, WEBSITE)
// ============================================================================

/**
 * Mengambil daftar materi pembelajaran
 */
function ambilDaftarMateri(idKelasFilter) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rows = ambilSemuaBarisData(ss, DB_SHEETS.MATERI);

  let hasil = rows.map(r => ({
    id: r[0],
    judul: r[1],
    idKelas: r[2],
    namaKelas: r[3],
    tipe: r[4], // youtube, gdrive, website
    link: r[5],
    deskripsi: r[6],
    createdAt: r[7]
  }));

  if (idKelasFilter && idKelasFilter !== 'ALL') {
    hasil = hasil.filter(m => String(m.idKelas) === String(idKelasFilter));
  }

  // Urutkan materi terbaru di atas
  hasil.reverse();

  return { success: true, data: hasil };
}

/**
 * Menyimpan materi pembelajaran baru
 */
function simpanMateri(judul, idKelas, namaKelas, tipeMateri, linkResource, deskripsi) {
  if (!judul || !idKelas || !tipeMateri || !linkResource) {
    return { success: false, message: 'Judul, Kelas, Tipe Materi, dan Link wajib diisi.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DB_SHEETS.MATERI);
  if (!sheet) return { success: false, message: 'Sheet Materi belum tersedia.' };

  const idMateri = 'MAT-' + Math.floor(1000 + Math.random() * 9000);
  const now = new Date();

  const rowData = [
    idMateri,
    judul.trim(),
    idKelas,
    namaKelas,
    String(tipeMateri).trim().toLowerCase(),
    linkResource.trim(),
    deskripsi ? deskripsi.trim() : '',
    now
  ];

  sheet.appendRow(rowData);
  catatLogAktivitas('ADMIN', 'ADMIN', 'TAMBAH_MATERI', 'Materi ditambahkan: ' + judul + ' (' + tipeMateri + ')');

  return { success: true, message: 'Materi pembelajaran berhasil dipublikasikan!', idMateri: idMateri };
}

/**
 * Menghapus materi pembelajaran
 */
function hapusDataMateri(idMateri) {
  if (!idMateri) return { success: false, message: 'ID Materi wajib diisi.' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DB_SHEETS.MATERI);
  if (!sheet) return { success: false, message: 'Sheet Materi tidak ditemukan.' };

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).trim() === String(idMateri).trim()) {
      sheet.deleteRow(i + 1);
      catatLogAktivitas('ADMIN', 'ADMIN', 'HAPUS_MATERI', 'Menghapus materi ID: ' + idMateri);
      return { success: true, message: 'Materi berhasil dihapus.' };
    }
  }

  return { success: false, message: 'Materi tidak ditemukan.' };
}

// ============================================================================
// 6. MODUL TUGAS & SOAL
// ============================================================================

/**
 * Mengambil daftar tugas (jika dipanggil siswa, lengkapi status pengerjaannya)
 */
function ambilDaftarTugas(idKelasFilter, idSiswa) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tugasRows = ambilSemuaBarisData(ss, DB_SHEETS.TUGAS);
  const submissionRows = ambilSemuaBarisData(ss, DB_SHEETS.PENGUMPULAN);

  // Buat map pengerjaan siswa jika ada idSiswa
  const statusSiswaMap = {};
  if (idSiswa) {
    submissionRows.forEach(sub => {
      if (String(sub[2]) === String(idSiswa)) {
        statusSiswaMap[String(sub[1])] = {
          idPengumpulan: sub[0],
          status: sub[9],
          nilai: sub[7],
          catatanGuru: sub[8],
          jawabanTeks: sub[5],
          linkLampiran: sub[6],
          submittedAt: sub[10]
        };
      }
    });
  }

  // Hitung total pengumpulan per tugas untuk tampilan admin
  const countSubmissionMap = {};
  submissionRows.forEach(sub => {
    const tgsId = String(sub[1]);
    countSubmissionMap[tgsId] = (countSubmissionMap[tgsId] || 0) + 1;
  });

  let hasil = tugasRows.map(r => {
    const idTugas = r[0];
    const dataTugas = {
      id: idTugas,
      judul: r[1],
      idKelas: r[2],
      namaKelas: r[3],
      deskripsi: r[4],
      deadline: r[5],
      createdAt: r[6],
      totalSubmissions: countSubmissionMap[String(idTugas)] || 0
    };

    if (idSiswa) {
      dataTugas.submission = statusSiswaMap[String(idTugas)] || null;
      dataTugas.isSubmitted = !!statusSiswaMap[String(idTugas)];
    }

    return dataTugas;
  });

  if (idKelasFilter && idKelasFilter !== 'ALL') {
    hasil = hasil.filter(t => String(t.idKelas) === String(idKelasFilter));
  }

  hasil.reverse();
  return { success: true, data: hasil };
}

/**
 * Menyimpan tugas baru dari Admin
 */
function simpanTugas(judul, idKelas, namaKelas, deskripsi, deadline) {
  if (!judul || !idKelas) {
    return { success: false, message: 'Judul tugas dan Kelas wajib diisi.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DB_SHEETS.TUGAS);
  if (!sheet) return { success: false, message: 'Sheet Tugas belum tersedia.' };

  const idTugas = 'TGS-' + Math.floor(1000 + Math.random() * 9000);
  const now = new Date();

  const rowData = [
    idTugas,
    judul.trim(),
    idKelas,
    namaKelas,
    deskripsi ? deskripsi.trim() : '',
    deadline || '',
    now
  ];

  sheet.appendRow(rowData);
  catatLogAktivitas('ADMIN', 'ADMIN', 'TAMBAH_TUGAS', 'Tugas baru dibuat: ' + judul + ' (' + namaKelas + ')');

  return { success: true, message: 'Tugas berhasil dipublikasikan!', idTugas: idTugas };
}

/**
 * Menghapus tugas
 */
function hapusDataTugas(idTugas) {
  if (!idTugas) return { success: false, message: 'ID Tugas wajib diisi.' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DB_SHEETS.TUGAS);
  if (!sheet) return { success: false, message: 'Sheet Tugas tidak ditemukan.' };

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).trim() === String(idTugas).trim()) {
      sheet.deleteRow(i + 1);
      catatLogAktivitas('ADMIN', 'ADMIN', 'HAPUS_TUGAS', 'Menghapus tugas ID: ' + idTugas);
      return { success: true, message: 'Tugas berhasil dihapus.' };
    }
  }

  return { success: false, message: 'Tugas tidak ditemukan.' };
}

// ============================================================================
// 7. MODUL PENGUMPULAN & PENILAIAN TUGAS
// ============================================================================

/**
 * Siswa Mengumpulkan Jawaban Tugas / Soal
 * Jika siswa sebelumnya sudah mengumpulkan, sistem memperbarui jawaban tanpa membuat baris ganda
 */
function simpanPengumpulanTugas(idTugas, idSiswa, namaSiswa, namaKelas, jawabanTeks, linkLampiran) {
  if (!idTugas || !idSiswa) {
    return { success: false, message: 'Data tugas dan identitas siswa tidak lengkap.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DB_SHEETS.PENGUMPULAN);
  if (!sheet) return { success: false, message: 'Sheet Pengumpulan belum tersedia.' };

  const values = sheet.getDataRange().getValues();
  const now = new Date();
  let existingRowIndex = -1;

  for (let i = 1; i < values.length; i++) {
    const rowTugasId = String(values[i][1]).trim();
    const rowSiswaId = String(values[i][2]).trim();

    if (rowTugasId === String(idTugas).trim() && rowSiswaId === String(idSiswa).trim()) {
      existingRowIndex = i + 1;
      break;
    }
  }

  if (existingRowIndex !== -1) {
    // Perbarui pengumpulan yang sudah ada
    sheet.getRange(existingRowIndex, 6).setValue(jawabanTeks || '');
    sheet.getRange(existingRowIndex, 7).setValue(linkLampiran || '');
    sheet.getRange(existingRowIndex, 10).setValue('Sudah Dikumpulkan');
    sheet.getRange(existingRowIndex, 11).setValue(now);

    catatLogAktivitas(namaSiswa, 'SISWA', 'UPDATE_TUGAS', 'Memperbarui pengumpulan tugas ID: ' + idTugas);
    return { success: true, message: 'Pengumpulan tugas berhasil diperbarui!' };
  }

  // Baris baru
  const idPengumpulan = 'SUB-' + Math.floor(1000 + Math.random() * 9000);
  const newRow = [
    idPengumpulan,
    idTugas,
    idSiswa,
    namaSiswa,
    namaKelas,
    jawabanTeks || '',
    linkLampiran || '',
    '', // Nilai belum ada
    '', // Catatan guru
    'Sudah Dikumpulkan',
    now
  ];

  sheet.appendRow(newRow);
  catatLogAktivitas(namaSiswa, 'SISWA', 'SUBMIT_TUGAS', 'Siswa mengumpulkan tugas ID: ' + idTugas);

  return { success: true, message: 'Tugas berhasil dikumpulkan!', idPengumpulan: idPengumpulan };
}

/**
 * Mengambil daftar pengumpulan berdasarkan ID Tugas (Untuk Evaluasi oleh Admin)
 */
function ambilPengumpulanBerdasarkanTugas(idTugas) {
  if (!idTugas) return { success: false, message: 'ID Tugas wajib diisi.' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rows = ambilSemuaBarisData(ss, DB_SHEETS.PENGUMPULAN);

  const filtered = rows
    .filter(r => String(r[1]).trim() === String(idTugas).trim())
    .map(r => ({
      id: r[0],
      idTugas: r[1],
      idSiswa: r[2],
      namaSiswa: r[3],
      namaKelas: r[4],
      jawabanTeks: r[5],
      linkLampiran: r[6],
      nilai: r[7],
      catatanGuru: r[8],
      status: r[9],
      submittedAt: r[10]
    }));

  return { success: true, data: filtered };
}

/**
 * Admin memberikan nilai dan umpan balik pada pengumpulan tugas siswa
 */
function simpanPenilaianSiswa(idPengumpulan, nilai, catatanGuru) {
  if (!idPengumpulan) return { success: false, message: 'ID Pengumpulan wajib diisi.' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DB_SHEETS.PENGUMPULAN);
  if (!sheet) return { success: false, message: 'Sheet Pengumpulan tidak ditemukan.' };

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).trim() === String(idPengumpulan).trim()) {
      sheet.getRange(i + 1, 8).setValue(nilai || 0);
      sheet.getRange(i + 1, 9).setValue(catatanGuru || '');
      sheet.getRange(i + 1, 10).setValue('Dinilai');

      catatLogAktivitas('ADMIN', 'ADMIN', 'NILAI_TUGAS', 'Memberi nilai ' + nilai + ' untuk pengumpulan: ' + idPengumpulan);

      return { success: true, message: 'Nilai dan catatan berhasil disimpan!' };
    }
  }

  return { success: false, message: 'Data pengumpulan tugas tidak ditemukan.' };
}

// ============================================================================
// 8. LOGGING & OPTIMASI OPERASI DATA
// ============================================================================

/**
 * Mengambil seluruh baris data dari sheet tertentu (melewati baris header)
 * Aman dan menghindari Null Pointer Exception
 */
function ambilSemuaBarisData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow <= 1 || lastCol === 0) return [];

  return sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
}

/**
 * Mencatat log aktivitas ke sheet Aktivitas_Log
 */
function catatLogAktivitas(pelaku, role, aksi, detail) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const logSheet = ss.getSheetByName(DB_SHEETS.LOGS);
    if (!logSheet) return;

    logSheet.appendRow([new Date(), pelaku || 'ANONIM', role || 'USER', aksi || 'AKSI', detail || '']);
  } catch (e) {
    Logger.log("Gagal mencatat log: " + e.message);
  }
}
