/**
 * ============================================================================
 * KONFIGURASI PUSAT SISTEM (PRD v1.2)
 * ============================================================================
 * File konfigurasi tunggal aplikasi Portal Administrasi Guru.
 * Seluruh modul membaca konfigurasi dari berkas ini.
 * DILARANG menyimpan kredensial sensitif atau password administrator di sini.
 */

export const APP_CONFIG = {
  APP_NAME: "Portal Administrasi Guru",

  DATABASE: {
    PROVIDER: "GOOGLE_APPS_SCRIPT",
    API_URL: "URL_WEB_APP_GAS" // Ganti dengan URL deployment Web App GAS (/exec)
  },

  STORAGE: {
    PROVIDER: "GOOGLE_DRIVE"
  },

  HOSTING: {
    PROVIDER: "VERCEL"
  },

  MULTI_TENANT: true,

  DEMO_MODE: false,

  // Metadata Instansi Default (Multi-tenant context)
  DEFAULT_SCHOOL: {
    id: "sdn-sumberejo-04",
    name: "SDN SUMBEREJO 04",
    subdistrict: "Kec. Ambulu - Jember",
    motto: "Berprestasi • Berkarakter • Berakhlak Mulia",
    academicYear: "2026/2027",
    semester: "Ganjil"
  }
};
