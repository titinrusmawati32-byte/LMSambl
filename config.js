/**
 * ============================================================================
 * LMS EDUCLOUD - KONFIGURASI DATABASE & BACKEND (config.js)
 * ============================================================================
 * File ini adalah satu-satunya sumber konfigurasi database untuk frontend.
 * Ketika repositori ini di-deploy di Vercel, frontend akan otomatis tersambung
 * ke Google Sheets melalui URL Google Apps Script Web App di bawah ini.
 *
 * PANDUAN:
 * 1. Deploy Google Apps Script Anda sebagai Web App (Who has access: Anyone).
 * 2. Salin URL Web App yang berakhiran /exec.
 * 3. Tempelkan URL tersebut ke variabel API_URL di bawah ini.
 * ============================================================================
 */

const CONFIG = {
  // Tempelkan URL Web App Google Apps Script Anda di sini:
  API_URL: "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",

  // Nama Platform Pembelajaran
  APP_NAME: "LMS EduCloud",

  // Versi Aplikasi
  VERSION: "1.0.0",

  // Default Password Siswa Baru
  DEFAULT_STUDENT_PASSWORD: "siswa123",

  // Kunci Penyimpanan Sesi Login
  STORAGE_KEYS: {
    AUTH_USER: "lms_educloud_user",
    THEME: "lms_educloud_theme"
  }
};
