/**
 * ============================================================================
 * LMS EDUCLOUD - KONFIGURASI FRONTEND (config.js)
 * ============================================================================
 * File ini menghubungkan antarmuka frontend (GitHub / Vercel) ke database
 * Google Apps Script Web App.
 *
 * PANDUAN PENGISIAN:
 * 1. Buka Google Apps Script project Anda.
 * 2. Klik tombol "Deploy" (Terapkan) -> "New deployment" (Penerapan baru).
 * 3. Pilih tipe "Web app".
 * 4. Atur:
 *    - Execute as : "Me" (Email Google Anda)
 *    - Who has access : "Anyone" (Siapa saja, termasuk anonim)
 * 5. Salin URL Web App yang dihasilkan (berakhiran /exec) dan tempelkan
 *    pada variabel API_URL di bawah ini.
 * ============================================================================
 */

const CONFIG = {
  // Ganti URL di bawah dengan URL Google Apps Script Web App Anda
  API_URL: "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",

  // Nama Platform Pembelajaran
  APP_NAME: "LMS EduCloud",

  // Versi Aplikasi
  VERSION: "1.0.0",

  // Default Password Siswa Baru
  DEFAULT_STUDENT_PASSWORD: "siswa123",

  // Kunci Penyimpanan Lokal (Local Storage Keys)
  STORAGE_KEYS: {
    AUTH_USER: "lms_educloud_user",
    API_URL_OVERRIDE: "lms_educloud_custom_api_url",
    THEME: "lms_educloud_theme"
  }
};

// Ambil URL override dari LocalStorage jika pengguna pernah memasukkan URL langsung di UI
(function initConfig() {
  try {
    const savedCustomUrl = localStorage.getItem(CONFIG.STORAGE_KEYS.API_URL_OVERRIDE);
    if (savedCustomUrl && savedCustomUrl.startsWith("https://script.google.com")) {
      CONFIG.API_URL = savedCustomUrl;
    }
  } catch (e) {
    console.warn("Storage access not available:", e);
  }
})();
