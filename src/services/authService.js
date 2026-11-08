import { apiRequest, isBackendConfigured } from './api.js';
import { mockUsers } from './mockData.ts';

const TOKEN_KEY = 'portal_auth_token';
const USER_KEY = 'portal_current_user';

export const authService = {
  /**
   * Login user dengan username dan password
   */
  async login(username, password) {
    if (!isBackendConfigured()) {
      // Mode Simulasi dengan data uji
      const user = mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
      if (user) {
        const dummyToken = `sim_token_${user.id}_${Date.now()}`;
        localStorage.setItem(TOKEN_KEY, dummyToken);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return {
          success: true,
          data: { user, token: dummyToken },
          isSimulated: true,
          message: 'Login berhasil (Mode Simulasi)'
        };
      }
      return {
        success: false,
        error: 'Username atau password simulasi salah. Coba: reza.fahlevi / admin.sekolah',
        isSimulated: true
      };
    }

    try {
      const res = await apiRequest('login', { username, password });
      if (res.success && res.data?.token) {
        localStorage.setItem(TOKEN_KEY, res.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
      }
      return res;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Ambil data sesi pengguna aktif saat ini
   */
  getCurrentUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Cek apakah token masih tersimpan
   */
  isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },

  /**
   * Logout dan hapus sesi
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { success: true };
  }
};
