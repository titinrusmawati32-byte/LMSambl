import { APP_CONFIG } from '../config/config.js';

/**
 * Core API Communication Service
 * Menyediakan abstraksi fetch ke Google Apps Script Web App dengan:
 * - Request timeout handling
 * - Deteksi URL default (URL_WEB_APP_GAS) vs URL aktif
 * - Structured error handling
 * - Status sesi & autentikasi
 */

const DEFAULT_TIMEOUT = 12000; // 12 detik

export class ApiError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Cek apakah backend GAS sudah dikonfigurasi dengan URL produksi
 */
export function isBackendConfigured() {
  const url = APP_CONFIG.DATABASE.API_URL;
  return Boolean(
    url &&
    url !== 'URL_WEB_APP_GAS' &&
    url.startsWith('https://script.google.com/macros/s/')
  );
}

/**
 * Eksekutor pemanggilan API utama
 * @param {string} action - Nama aksi / endpoint API (misal: 'getStudents', 'recordAttendance')
 * @param {object} payload - Data parameter yang dikirim
 * @param {string} [method='POST'] - Metode HTTP
 * @returns {Promise<{success: boolean, data?: any, error?: string, isSimulated?: boolean}>}
 */
export async function apiRequest(action, payload = {}, method = 'POST') {
  // Jika URL masih default 'URL_WEB_APP_GAS', kita tandai sebagai unconfigured
  if (!isBackendConfigured()) {
    return {
      success: false,
      isSimulated: true,
      error: 'Backend Google Apps Script belum dikonfigurasi di src/config/config.js (API_URL masih bernilai default).',
      code: 'BACKEND_NOT_CONFIGURED'
    };
  }

  const endpointUrl = APP_CONFIG.DATABASE.API_URL;
  const token = localStorage.getItem('auth_token') || '';

  const bodyData = {
    action,
    payload,
    token,
    schoolId: payload.schoolId || APP_CONFIG.DEFAULT_SCHOOL.id,
    timestamp: new Date().toISOString()
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    let response;
    if (method === 'GET') {
      const queryParams = new URLSearchParams({
        action,
        schoolId: bodyData.schoolId,
        token,
        ...payload
      });
      response = await fetch(`${endpointUrl}?${queryParams.toString()}`, {
        method: 'GET',
        signal: controller.signal
      });
    } else {
      // POST ke GAS Web App (biasanya menggunakan text/plain agar menghindari preflight CORS error di browser)
      response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(bodyData),
        signal: controller.signal
      });
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(`Koneksi HTTP Gagal: ${response.status} ${response.statusText}`, response.status);
    }

    const json = await response.json();

    // Verifikasi sesi kedaluwarsa dari respons backend
    if (json.status === 401 || json.code === 'SESSION_EXPIRED') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      window.dispatchEvent(new CustomEvent('auth:session_expired'));
      throw new ApiError('Sesi telah kedaluwarsa. Silakan login kembali.', 401);
    }

    return json;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new ApiError('Permintaan timeout: Server Google Apps Script tidak merespons dalam 12 detik.', 408);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Gagal menghubungi server Google Apps Script: ${error.message}`, 500, error);
  }
}
