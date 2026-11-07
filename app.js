/**
 * ============================================================================
 * LMS EDUCLOUD - FRONTEND APPLICATION LOGIC (app.js)
 * ============================================================================
 * Menghubungkan UI dengan Google Apps Script Web App Backend, mengelola
 * autentikasi Admin & Siswa, input masal, materi, tugas, dan penilaian.
 * ============================================================================
 */

// State Aplikasi
const AppState = {
  currentUser: null, // { role: 'admin'|'siswa', nama, username, idKelas, namaKelas, idSiswa }
  currentTab: 'dashboard', // admin: dashboard, kelas, siswa, materi, tugas | siswa: materi, tugas
  classes: [],
  students: [],
  materials: [],
  assignments: [],
  dashboardStats: null,
  activeVideoId: null
};

// ============================================================================
// 1. KOMUNIKASI API (FETCH & DEMO MOCK FALLBACK)
// ============================================================================

/**
 * Melakukan panggilan API ke Google Apps Script Web App
 * Menggunakan mode text/plain untuk menghindari CORS Preflight (OPTIONS)
 */
async function apiRequest(action, payload = {}) {
  const isApiConfigured = CONFIG.API_URL &&
    CONFIG.API_URL.startsWith("https://script.google.com") &&
    !CONFIG.API_URL.includes("YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE");

  // Jika URL Apps Script belum diisi, gunakan Demo Mock Engine agar aplikasi tetap dapat diuji
  if (!isApiConfigured) {
    return handleMockApiRequest(action, payload);
  }

  try {
    const postData = { action, ...payload };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(postData)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API Request Error:", error);
    // Jika fetch gagal (misal koneksi terputus), coba berikan fallback
    return {
      success: false,
      message: 'Gagal terhubung ke Google Apps Script: ' + error.message
    };
  }
}

// ============================================================================
// 2. INISIALISASI APLIKASI & EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  pulihkanSesiLogin();
  pasangEventListeners();
});

/**
 * Pasang seluruh event listener UI
 */
function pasangEventListeners() {
  // Toggle Tab Login (Admin vs Siswa)
  const btnTabLoginAdmin = document.getElementById('tabBtnLoginAdmin');
  const btnTabLoginSiswa = document.getElementById('tabBtnLoginSiswa');
  if (btnTabLoginAdmin && btnTabLoginSiswa) {
    btnTabLoginAdmin.addEventListener('click', () => alihkanTabLogin('admin'));
    btnTabLoginSiswa.addEventListener('click', () => alihkanTabLogin('siswa'));
  }

  // Form Submit Login Admin
  const formLoginAdmin = document.getElementById('formLoginAdmin');
  if (formLoginAdmin) {
    formLoginAdmin.addEventListener('submit', handleLoginAdmin);
  }

  // Form Submit Login Siswa
  const formLoginSiswa = document.getElementById('formLoginSiswa');
  if (formLoginSiswa) {
    formLoginSiswa.addEventListener('submit', handleLoginSiswa);
  }

  // Tombol Logout
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', handleLogout);
  }

  // Tombol Ganti Password Admin
  const btnChangePass = document.getElementById('btnOpenChangePass');
  if (btnChangePass) {
    btnChangePass.addEventListener('click', () => bukaModal('modalChangePassword'));
  }

  // Form Ganti Password Admin
  const formChangePass = document.getElementById('formChangePassword');
  if (formChangePass) {
    formChangePass.addEventListener('submit', handleChangePasswordAdmin);
  }

  // Tutup Modal ketika tombol close diklik atau overlay diklik
  document.querySelectorAll('.modal-close-btn, .btn-modal-cancel').forEach(btn => {
    btn.addEventListener('click', e => {
      const modal = e.target.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });

  // Tombol Cepat Dashboard
  const quickClassBtn = document.getElementById('quickAddClassBtn');
  if (quickClassBtn) quickClassBtn.addEventListener('click', () => bukaModal('modalBulkAddClass'));

  const quickStudentBtn = document.getElementById('quickAddStudentBtn');
  if (quickStudentBtn) quickStudentBtn.addEventListener('click', () => bukaModalBulkSiswa());

  const quickMaterialBtn = document.getElementById('quickAddMaterialBtn');
  if (quickMaterialBtn) quickMaterialBtn.addEventListener('click', () => bukaModalTambahMateri());

  const quickAssignmentBtn = document.getElementById('quickAddAssignmentBtn');
  if (quickAssignmentBtn) quickAssignmentBtn.addEventListener('click', () => bukaModalTambahTugas());
}

/**
 * Pulihkan sesi login jika sebelumnya pengguna sudah pernah login
 */
function pulihkanSesiLogin() {
  try {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_USER);
    if (saved) {
      AppState.currentUser = JSON.parse(saved);
      tampilkanHalamanSesuaiRole();
    } else {
      tampilkanHalamanLogin();
    }
  } catch (e) {
    tampilkanHalamanLogin();
  }
}

// ============================================================================
// 3. LOGIKA AUTENTIKASI (LOGIN & LOGOUT)
// ============================================================================

function alihkanTabLogin(role) {
  const formAdmin = document.getElementById('formLoginAdmin');
  const formSiswa = document.getElementById('formLoginSiswa');
  const tabAdmin = document.getElementById('tabBtnLoginAdmin');
  const tabSiswa = document.getElementById('tabBtnLoginSiswa');

  if (role === 'admin') {
    tabAdmin.classList.add('active');
    tabSiswa.classList.remove('active');
    formAdmin.style.display = 'block';
    formSiswa.style.display = 'none';
  } else {
    tabSiswa.classList.add('active');
    tabAdmin.classList.remove('active');
    formSiswa.style.display = 'block';
    formAdmin.style.display = 'none';
  }
}

async function handleLoginAdmin(e) {
  e.preventDefault();
  const username = document.getElementById('adminUsernameInput').value.trim();
  const password = document.getElementById('adminPasswordInput').value.trim();

  if (!username || !password) {
    tampilkanToast('Harap masukkan username dan password Admin.', 'error');
    return;
  }

  tampilkanLoading(true, 'Memverifikasi kredensial Admin...');
  const res = await apiRequest('loginAdmin', { username, password });
  tampilkanLoading(false);

  if (res.success) {
    AppState.currentUser = res.user;
    localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(AppState.currentUser));
    tampilkanToast('Selamat datang, Administrator!', 'success');
    tampilkanHalamanSesuaiRole();
  } else {
    tampilkanToast(res.message || 'Login gagal, periksa kredensial Anda.', 'error');
  }
}

async function handleLoginSiswa(e) {
  e.preventDefault();
  const username = document.getElementById('siswaUsernameInput').value.trim();
  const password = document.getElementById('siswaPasswordInput').value.trim();

  if (!username || !password) {
    tampilkanToast('Harap masukkan username dan password siswa.', 'error');
    return;
  }

  tampilkanLoading(true, 'Sedang masuk ke portal siswa...');
  const res = await apiRequest('loginSiswa', { username, password });
  tampilkanLoading(false);

  if (res.success) {
    AppState.currentUser = res.student;
    localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(AppState.currentUser));
    tampilkanToast(res.message || 'Login siswa berhasil!', 'success');
    tampilkanHalamanSesuaiRole();
  } else {
    tampilkanToast(res.message || 'Username atau password siswa salah.', 'error');
  }
}

function handleLogout() {
  AppState.currentUser = null;
  localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_USER);
  tampilkanToast('Anda telah berhasil keluar (logout).', 'info');
  tampilkanHalamanLogin();
}

async function handleChangePasswordAdmin(e) {
  e.preventDefault();
  const usernameLama = document.getElementById('cpOldUsername').value.trim();
  const passwordLama = document.getElementById('cpOldPassword').value.trim();
  const usernameBaru = document.getElementById('cpNewUsername').value.trim();
  const passwordBaru = document.getElementById('cpNewPassword').value.trim();

  if (!usernameLama || !passwordLama || !usernameBaru || !passwordBaru) {
    tampilkanToast('Seluruh kolom wajib diisi.', 'error');
    return;
  }

  tampilkanLoading(true, 'Memperbarui kredensial...');
  const res = await apiRequest('gantiKredensialAdmin', {
    usernameLama,
    passwordLama,
    usernameBaru,
    passwordBaru
  });
  tampilkanLoading(false);

  if (res.success) {
    tampilkanToast(res.message, 'success');
    tutupModal('modalChangePassword');
    document.getElementById('formChangePassword').reset();
    if (AppState.currentUser) {
      AppState.currentUser.username = usernameBaru;
      localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(AppState.currentUser));
    }
  } else {
    tampilkanToast(res.message, 'error');
  }
}

// ============================================================================
// 4. NAVIGASI HALAMAN (ROUTING VIEW)
// ============================================================================

function tampilkanHalamanLogin() {
  document.getElementById('loginView').style.display = 'block';
  document.getElementById('adminAppView').style.display = 'none';
  document.getElementById('studentAppView').style.display = 'none';
  document.getElementById('userProfileBadge').style.display = 'none';
  document.getElementById('btnLogout').style.display = 'none';
}

function tampilkanHalamanSesuaiRole() {
  if (!AppState.currentUser) {
    tampilkanHalamanLogin();
    return;
  }

  document.getElementById('loginView').style.display = 'none';
  document.getElementById('userProfileBadge').style.display = 'flex';
  document.getElementById('btnLogout').style.display = 'inline-flex';

  // Render identitas di Navbar
  document.getElementById('navUserName').textContent = AppState.currentUser.nama || AppState.currentUser.username;
  document.getElementById('navUserRole').textContent = AppState.currentUser.role.toUpperCase();
  document.getElementById('navUserAvatar').textContent = (AppState.currentUser.nama || 'U').charAt(0).toUpperCase();

  if (AppState.currentUser.role === 'admin') {
    document.getElementById('adminAppView').style.display = 'block';
    document.getElementById('studentAppView').style.display = 'none';
    muatDataAdmin();
  } else {
    document.getElementById('adminAppView').style.display = 'none';
    document.getElementById('studentAppView').style.display = 'block';
    muatDataSiswa();
  }
}

// ============================================================================
// 5. FITUR ADMIN (DASHBOARD, KELAS, SISWA, MATERI, TUGAS)
// ============================================================================

async function muatDataAdmin() {
  tampilkanLoading(true, 'Mengambil data LMS...');
  await Promise.all([
    muatStatistikDashboard(),
    muatDaftarKelas(),
    muatDaftarSiswa(),
    muatDaftarMateri(),
    muatDaftarTugas()
  ]);
  tampilkanLoading(false);
  navigasiTabAdmin(AppState.currentTab || 'dashboard');
}

function navigasiTabAdmin(tabName) {
  AppState.currentTab = tabName;

  // Update styling tombol tab
  document.querySelectorAll('.admin-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Tampilkan panel yang bersangkutan
  document.querySelectorAll('.admin-section').forEach(sec => {
    sec.style.display = 'none';
  });

  const targetSec = document.getElementById('secAdmin_' + tabName);
  if (targetSec) targetSec.style.display = 'block';
}

/**
 * 5.1 Dashboard Interaktif
 */
async function muatStatistikDashboard() {
  const res = await apiRequest('getDashboardStats');
  if (res.success && res.stats) {
    AppState.dashboardStats = res.stats;

    // Render angka statistik
    document.getElementById('dashTotalKelas').textContent = res.stats.totalKelas;
    document.getElementById('dashTotalSiswa').textContent = res.stats.totalSiswa;
    document.getElementById('dashTotalMateri').textContent = res.stats.totalMateri;
    document.getElementById('dashTotalTugas').textContent = res.stats.totalTugas;

    // Render statistik materi
    const ytCount = res.stats.materiByType ? res.stats.materiByType.youtube : 0;
    const gdCount = res.stats.materiByType ? res.stats.materiByType.gdrive : 0;
    const wsCount = res.stats.materiByType ? res.stats.materiByType.website : 0;
    const totalMat = res.stats.totalMateri || 1;

    document.getElementById('dashYtCount').textContent = ytCount;
    document.getElementById('dashGdCount').textContent = gdCount;
    document.getElementById('dashWsCount').textContent = wsCount;

    // Progress fill bar
    const progressFill = document.getElementById('heroProgressFill');
    if (progressFill) {
      const percentage = Math.min(100, Math.round((res.stats.tugasDinilai / (res.stats.totalPengumpulan || 1)) * 100));
      progressFill.style.width = percentage + '%';
      document.getElementById('heroProgressLabel').textContent = percentage + '% Tugas Selesai Dinilai';
    }

    // Render riwayat log
    renderAktivitasTerbaru(res.recentLogs || []);
  }
}

function renderAktivitasTerbaru(logs) {
  const container = document.getElementById('dashRecentLogsList');
  if (!container) return;

  if (logs.length === 0) {
    container.innerHTML = '<p class="text-muted" style="padding: 1rem 0;">Belum ada aktivitas tercatat.</p>';
    return;
  }

  container.innerHTML = logs.map(log => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--primary);"></span>
        <div>
          <strong style="font-size: 0.88rem; color: var(--text-main);">${escapeHtml(log.pelaku)}</strong>
          <span style="font-size: 0.78rem; color: var(--text-muted); margin-left: 0.35rem;">(${log.role})</span>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem;">${escapeHtml(log.detail)}</p>
        </div>
      </div>
      <small style="font-size: 0.72rem; color: var(--text-subtle);">${formatWaktu(log.timestamp)}</small>
    </div>
  `).join('');
}

/**
 * 5.2 Manajemen Kelas (Input Masal & CRUD)
 */
async function muatDaftarKelas() {
  const res = await apiRequest('getKelas');
  if (res.success && Array.isArray(res.data)) {
    AppState.classes = res.data;
    renderKartuKelas();
    perbaruiDropdownKelas();
  }
}

function renderKartuKelas() {
  const container = document.getElementById('classListContainer');
  if (!container) return;

  if (AppState.classes.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🏫</div>
        <h4 class="empty-state-title">Belum Ada Kelas</h4>
        <p class="empty-state-desc">Tambahkan kelas satuan atau gunakan tombol Input Masal untuk menambahkan banyak kelas sekaligus.</p>
        <button class="btn btn-primary" onclick="bukaModal('modalBulkAddClass')">+ Input Kelas Masal</button>
      </div>`;
    return;
  }

  container.innerHTML = AppState.classes.map(k => `
    <div class="item-card">
      <div class="item-card-header">
        <span class="badge-class">${escapeHtml(k.tingkat || 'Umum')}</span>
        <button class="btn btn-icon btn-secondary" onclick="hapusKelas('${k.id}')" title="Hapus Kelas" style="color: #ef4444;">
          🗑️
        </button>
      </div>
      <h3 class="item-title">${escapeHtml(k.nama)}</h3>
      <p class="item-desc">${escapeHtml(k.deskripsi || 'Tidak ada deskripsi.')}</p>
      <div class="item-card-footer">
        <span>👥 <strong>${k.jumlahSiswa || 0}</strong> Siswa Terdaftar</span>
        <small style="color: var(--text-subtle);">${k.id}</small>
      </div>
    </div>
  `).join('');
}

async function handleBulkAddClass(e) {
  e.preventDefault();
  const inputVal = document.getElementById('bulkClassInput').value.trim();
  if (!inputVal) {
    tampilkanToast('Harap masukkan setidaknya satu nama kelas.', 'error');
    return;
  }

  tampilkanLoading(true, 'Menyimpan kelas masal...');
  const res = await apiRequest('bulkTambahKelas', { daftarKelas: inputVal });
  tampilkanLoading(false);

  if (res.success) {
    tampilkanToast(res.message, 'success');
    tutupModal('modalBulkAddClass');
    document.getElementById('bulkClassInput').value = '';
    await muatDaftarKelas();
    await muatStatistikDashboard();
  } else {
    tampilkanToast(res.message, 'error');
  }
}

async function hapusKelas(idKelas) {
  if (!confirm('Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini tidak dapat dibatalkan.')) return;

  tampilkanLoading(true, 'Menghapus kelas...');
  const res = await apiRequest('hapusKelas', { idKelas });
  tampilkanLoading(false);

  if (res.success) {
    tampilkanToast(res.message, 'success');
    await muatDaftarKelas();
    await muatStatistikDashboard();
  } else {
    tampilkanToast(res.message, 'error');
  }
}

/**
 * 5.3 Manajemen Siswa (Input Masal Nama & Generator Akun)
 */
async function muatDaftarSiswa(filterKelasId = 'ALL') {
  const res = await apiRequest('getSiswa', { idKelas: filterKelasId });
  if (res.success && Array.isArray(res.data)) {
    AppState.students = res.data;
    renderTabelSiswa();
  }
}

function renderTabelSiswa() {
  const tbody = document.getElementById('studentTableBody');
  if (!tbody) return;

  if (AppState.students.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2.5rem 1rem;">
          <div class="empty-state-icon" style="font-size: 2.5rem;">👨‍🎓</div>
          <p style="color: var(--text-muted); font-weight: 600;">Belum ada siswa di kelas ini.</p>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = AppState.students.map((s, idx) => `
    <tr>
      <td style="font-weight: 600; color: var(--text-muted);">${idx + 1}</td>
      <td>
        <strong style="color: var(--text-main);">${escapeHtml(s.nama)}</strong>
        <div style="font-size: 0.72rem; color: var(--text-subtle);">${s.id}</div>
      </td>
      <td><span class="badge-class">${escapeHtml(s.namaKelas)}</span></td>
      <td>
        <code style="background: #f3f4f6; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 600; color: var(--primary-dark);">
          ${escapeHtml(s.username)}
        </code>
      </td>
      <td>
        <code style="background: #ede9fe; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 600; color: #6d28d9;">
          ${escapeHtml(s.password)}
        </code>
      </td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="resetPasswordSiswa('${s.id}')" title="Reset Password ke siswa123">
          🔄 Reset
        </button>
        <button class="btn btn-sm btn-secondary" onclick="hapusSiswa('${s.id}')" title="Hapus Siswa" style="color: #ef4444; margin-left: 0.25rem;">
          🗑️
        </button>
      </td>
    </tr>
  `).join('');
}

function bukaModalBulkSiswa() {
  if (AppState.classes.length === 0) {
    tampilkanToast('Harap buat kelas terlebih dahulu sebelum mendaftarkan siswa.', 'error');
    bukaModal('modalBulkAddClass');
    return;
  }
  bukaModal('modalBulkAddStudent');
}

// Preview Generator Username Siswa Otomatis saat mengetik
function updatePreviewUsernameSiswa() {
  const rawInput = document.getElementById('bulkStudentNamesInput').value;
  const previewBox = document.getElementById('studentPreviewArea');
  const previewCount = document.getElementById('studentPreviewCount');

  const names = rawInput.split('\n').map(n => n.trim()).filter(n => n.length > 0);
  previewCount.textContent = names.length;

  if (names.length === 0) {
    previewBox.innerHTML = '<span style="color: var(--text-muted); font-size: 0.8rem;">Ketik atau tempel nama siswa di atas untuk melihat preview username...</span>';
    return;
  }

  previewBox.innerHTML = names.slice(0, 5).map(name => {
    const cleanUser = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '.');
    return `
      <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
        <span><strong>${escapeHtml(name)}</strong></span>
        <span>Username: <code>${escapeHtml(cleanUser)}</code> | Pass: <code>siswa123</code></span>
      </div>`;
  }).join('') + (names.length > 5 ? `<div style="font-size: 0.75rem; color: var(--primary); font-weight: 700;">+ ${names.length - 5} siswa lainnya...</div>` : '');
}

async function handleBulkAddStudent(e) {
  e.preventDefault();
  const selectKelas = document.getElementById('bulkStudentClassSelect');
  const idKelas = selectKelas.value;
  const namaKelas = selectKelas.options[selectKelas.selectedIndex].text;
  const namesInput = document.getElementById('bulkStudentNamesInput').value.trim();

  if (!idKelas || !namesInput) {
    tampilkanToast('Harap pilih kelas dan masukkan setidaknya satu nama siswa.', 'error');
    return;
  }

  tampilkanLoading(true, 'Mendaftarkan siswa dan membuat akun otomatis...');
  const res = await apiRequest('bulkTambahSiswa', {
    daftarNama: namesInput,
    idKelas: idKelas,
    namaKelas: namaKelas
  });
  tampilkanLoading(false);

  if (res.success) {
    tampilkanToast(res.message, 'success');
    tutupModal('modalBulkAddStudent');
    document.getElementById('bulkStudentNamesInput').value = '';
    document.getElementById('studentPreviewArea').innerHTML = '';
    await muatDaftarSiswa();
    await muatDaftarKelas();
    await muatStatistikDashboard();
  } else {
    tampilkanToast(res.message, 'error');
  }
}

async function hapusSiswa(idSiswa) {
  if (!confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) return;

  tampilkanLoading(true, 'Menghapus siswa...');
  const res = await apiRequest('hapusSiswa', { idSiswa });
  tampilkanLoading(false);

  if (res.success) {
    tampilkanToast(res.message, 'success');
    await muatDaftarSiswa();
    await muatDaftarKelas();
    await muatStatistikDashboard();
  } else {
    tampilkanToast(res.message, 'error');
  }
}

async function resetPasswordSiswa(idSiswa) {
  tampilkanLoading(true, 'Mereset password...');
  const res = await apiRequest('resetPasswordSiswa', { idSiswa });
  tampilkanLoading(false);

  if (res.success) {
    tampilkanToast(res.message, 'success');
    await muatDaftarSiswa();
  } else {
    tampilkanToast(res.message, 'error');
  }
}

/**
 * 5.4 Manajemen Materi Pembelajaran
 */
async function muatDaftarMateri(idKelasFilter = 'ALL') {
  const res = await apiRequest('getMateri', { idKelas: idKelasFilter });
  if (res.success && Array.isArray(res.data)) {
    AppState.materials = res.data;
    renderKartuMateriAdmin();
  }
}

function renderKartuMateriAdmin() {
  const container = document.getElementById('adminMaterialGrid');
  if (!container) return;

  if (AppState.materials.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">📚</div>
        <h4 class="empty-state-title">Belum Ada Materi</h4>
        <p class="empty-state-desc">Unggah materi pertama Anda dalam bentuk Link YouTube, Google Drive, atau Website edukasi.</p>
        <button class="btn btn-primary" onclick="bukaModalTambahMateri()">+ Tambah Materi</button>
      </div>`;
    return;
  }

  container.innerHTML = AppState.materials.map(m => {
    const badgeClass = m.tipe === 'youtube' ? 'badge-youtube' : m.tipe === 'gdrive' ? 'badge-gdrive' : 'badge-website';
    const iconType = m.tipe === 'youtube' ? '▶️ YouTube' : m.tipe === 'gdrive' ? '📁 Google Drive' : '🌐 Website';

    return `
      <div class="item-card">
        <div class="item-card-header">
          <span class="item-type-badge ${badgeClass}">${iconType}</span>
          <button class="btn btn-icon btn-secondary" onclick="hapusMateri('${m.id}')" title="Hapus Materi" style="color: #ef4444;">
            🗑️
          </button>
        </div>
        <h3 class="item-title">${escapeHtml(m.judul)}</h3>
        <p class="item-desc">${escapeHtml(m.deskripsi || 'Tidak ada deskripsi ringkas.')}</p>
        <div style="margin-bottom: 1rem;">
          <a href="${escapeHtml(m.link)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary" style="width: 100%;">
            🔗 Buka Sumber Materi
          </a>
        </div>
        <div class="item-card-footer">
          <span class="badge-class">${escapeHtml(m.namaKelas)}</span>
          <small>${formatWaktu(m.createdAt)}</small>
        </div>
      </div>
    `;
  }).join('');
}

function bukaModalTambahMateri() {
  if (AppState.classes.length === 0) {
    tampilkanToast('Harap buat kelas terlebih dahulu.', 'error');
    bukaModal('modalBulkAddClass');
    return;
  }
  bukaModal('modalAddMaterial');
}

async function handleAddMaterial(e) {
  e.preventDefault();
  const judul = document.getElementById('matJudulInput').value.trim();
  const selectKelas = document.getElementById('matClassSelect');
  const idKelas = selectKelas.value;
  const namaKelas = selectKelas.options[selectKelas.selectedIndex].text;
  const tipeMateri = document.getElementById('matTypeSelect').value;
  const linkResource = document.getElementById('matLinkInput').value.trim();
  const deskripsi = document.getElementById('matDescInput').value.trim();

  if (!judul || !idKelas || !tipeMateri || !linkResource) {
    tampilkanToast('Harap isi seluruh kolom wajib.', 'error');
    return;
  }

  tampilkanLoading(true, 'Menyimpan materi pembelajaran...');
  const res = await apiRequest('tambahMateri', {
    judul,
    idKelas,
    namaKelas,
    tipeMateri,
    linkResource,
    deskripsi
  });
  tampilkanLoading(false);

  if (res.success) {
    tampilkanToast(res.message, 'success');
    tutupModal('modalAddMaterial');
    document.getElementById('formAddMaterial').reset();
    await muatDaftarMateri();
    await muatStatistikDashboard();
  } else {
    tampilkanToast(res.message, 'error');
  }
}

async function hapusMateri(idMateri) {
  if (!confirm('Apakah Anda yakin ingin menghapus materi ini?')) return;

  tampilkanLoading(true, 'Menghapus materi...');
  const res = await apiRequest('hapusMateri', { idMateri });
  tampilkanLoading(false);

  if (res.success) {
    tampilkanToast(res.message, 'success');
    await muatDaftarMateri();
    await muatStatistikDashboard();
  } else {
    tampilkanToast(res.message, 'error');
  }
}

/**
 * 5.5 Manajemen Tugas & Penilaian Siswa
 */
async function muatDaftarTugas(idKelasFilter = 'ALL') {
  const res = await apiRequest('getTugas', { idKelas: idKelasFilter });
  if (res.success && Array.isArray(res.data)) {
    AppState.assignments = res.data;
    renderKartuTugasAdmin();
  }
}

function renderKartuTugasAdmin() {
  const container = document.getElementById('adminAssignmentGrid');
  if (!container) return;

  if (AppState.assignments.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">📝</div>
        <h4 class="empty-state-title">Belum Ada Tugas</h4>
        <p class="empty-state-desc">Buat tugas atau soal baru dengan batas waktu pengumpulan untuk siswa Anda.</p>
        <button class="btn btn-primary" onclick="bukaModalTambahTugas()">+ Buat Tugas Baru</button>
      </div>`;
    return;
  }

  container.innerHTML = AppState.assignments.map(t => `
    <div class="item-card">
      <div class="item-card-header">
        <span class="badge-class">${escapeHtml(t.namaKelas)}</span>
        <button class="btn btn-icon btn-secondary" onclick="hapusTugas('${t.id}')" title="Hapus Tugas" style="color: #ef4444;">
          🗑️
        </button>
      </div>
      <h3 class="item-title">${escapeHtml(t.judul)}</h3>
      <p class="item-desc">${escapeHtml(t.deskripsi || 'Tidak ada deskripsi detail.')}</p>
      <div style="background: #f5f3ff; padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); margin-bottom: 1rem; font-size: 0.82rem;">
        ⏰ <strong>Deadline:</strong> ${t.deadline ? escapeHtml(t.deadline) : 'Tidak ada batas waktu'}
      </div>
      <div style="margin-bottom: 1rem;">
        <button class="btn btn-sm btn-primary" onclick="bukaModalPenilaian('${t.id}', '${escapeHtml(t.judul)}')" style="width: 100%;">
          📋 Lihat Pengumpulan (${t.totalSubmissions || 0})
        </button>
      </div>
      <div class="item-card-footer">
        <small>${t.id}</small>
        <small>${formatWaktu(t.createdAt)}</small>
      </div>
    </div>
  `).join('');
}

function bukaModalTambahTugas() {
  if (AppState.classes.length === 0) {
    tampilkanToast('Harap buat kelas terlebih dahulu.', 'error');
    bukaModal('modalBulkAddClass');
    return;
  }
  bukaModal('modalAddAssignment');
}

async function handleAddAssignment(e) {
  e.preventDefault();
  const judul = document.getElementById('tgsJudulInput').value.trim();
  const selectKelas = document.getElementById('tgsClassSelect');
  const idKelas = selectKelas.value;
  const namaKelas = selectKelas.options[selectKelas.selectedIndex].text;
  const deskripsi = document.getElementById('tgsDescInput').value.trim();
  const deadline = document.getElementById('tgsDeadlineInput').value;

  if (!judul || !idKelas) {
    tampilkanToast('Judul tugas dan kelas wajib diisi.', 'error');
    return;
  }

  tampilkanLoading(true, 'Menyimpan tugas baru...');
  const res = await apiRequest('tambahTugas', {
    judul,
    idKelas,
    namaKelas,
    deskripsi,
    deadline
  });
  tampilkanLoading(false);

  if (res.success) {
    tampilkanToast(res.message, 'success');
    tutupModal('modalAddAssignment');
    document.getElementById('formAddAssignment').reset();
    await muatDaftarTugas();
    await muatStatistikDashboard();
  } else {
    tampilkanToast(res.message, 'error');
  }
}

async function hapusTugas(idTugas) {
  if (!confirm('Apakah Anda yakin ingin menghapus tugas ini?')) return;

  tampilkanLoading(true, 'Menghapus tugas...');
  const res = await apiRequest('hapusTugas', { idTugas });
  tampilkanLoading(false);

  if (res.success) {
    tampilkanToast(res.message, 'success');
    await muatDaftarTugas();
    await muatStatistikDashboard();
  } else {
    tampilkanToast(res.message, 'error');
  }
}

/**
 * 5.6 Evaluasi & Penilaian Pengumpulan Tugas Siswa
 */
async function bukaModalPenilaian(idTugas, judulTugas) {
  document.getElementById('modalGradeTaskTitle').textContent = judulTugas;
  const container = document.getElementById('modalSubmissionsContainer');
  container.innerHTML = '<p class="text-muted" style="text-align: center; padding: 2rem;">Memuat data pengumpulan...</p>';
  bukaModal('modalGradeSubmissions');

  const res = await apiRequest('getPengumpulanByTugas', { idTugas });
  if (res.success && Array.isArray(res.data)) {
    if (res.data.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 2rem 1rem;">
          <div class="empty-state-icon" style="font-size: 2.5rem;">📥</div>
          <p style="color: var(--text-muted);">Belum ada siswa yang mengumpulkan tugas ini.</p>
        </div>`;
      return;
    }

    container.innerHTML = res.data.map(sub => `
      <div style="border: 1px solid rgba(139, 92, 246, 0.2); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1rem; background: #faf5ff;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <div>
            <strong style="font-size: 1rem; color: var(--text-main);">${escapeHtml(sub.namaSiswa)}</strong>
            <span style="font-size: 0.78rem; color: var(--text-muted); margin-left: 0.5rem;">(${escapeHtml(sub.namaKelas)})</span>
          </div>
          <span class="status-pill ${sub.status === 'Dinilai' ? 'status-graded' : 'status-submitted'}">
            ${sub.status === 'Dinilai' ? '✅ Dinilai (' + sub.nilai + '/100)' : '⏳ Perlu Dinilai'}
          </span>
        </div>

        <div style="background: #ffffff; padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin-bottom: 0.75rem; font-size: 0.88rem; border: 1px solid #e5e7eb;">
          <div style="font-weight: 700; color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.25rem;">JAWABAN SISWA:</div>
          <div style="white-space: pre-wrap;">${escapeHtml(sub.jawabanTeks || 'Tidak ada teks jawaban.')}</div>
          ${sub.linkLampiran ? `
            <div style="margin-top: 0.5rem;">
              <a href="${escapeHtml(sub.linkLampiran)}" target="_blank" rel="noopener noreferrer" style="color: var(--primary); font-weight: 700; font-size: 0.82rem; text-decoration: underline;">
                🔗 Buka Lampiran Google Drive / File
              </a>
            </div>
          ` : ''}
        </div>

        <!-- Form Penilaian -->
        <div style="display: flex; gap: 0.75rem; align-items: flex-end; flex-wrap: wrap;">
          <div style="width: 90px;">
            <label class="form-label" style="font-size: 0.75rem;">Nilai (0-100)</label>
            <input type="number" id="gradeInput_${sub.id}" class="form-control" min="0" max="100" value="${sub.nilai || ''}" placeholder="0-100">
          </div>
          <div style="flex: 1; min-width: 180px;">
            <label class="form-label" style="font-size: 0.75rem;">Catatan Guru / Umpan Balik</label>
            <input type="text" id="feedbackInput_${sub.id}" class="form-control" value="${escapeHtml(sub.catatanGuru || '')}" placeholder="Catatan evaluasi...">
          </div>
          <button class="btn btn-sm btn-success" onclick="simpanNilai('${sub.id}')">
            💾 Simpan Nilai
          </button>
        </div>
      </div>
    `).join('');
  }
}

async function simpanNilai(idPengumpulan) {
  const inputNilai = document.getElementById('gradeInput_' + idPengumpulan);
  const inputFeedback = document.getElementById('feedbackInput_' + idPengumpulan);

  const nilai = inputNilai.value;
  const catatanGuru = inputFeedback.value;

  if (nilai === '') {
    tampilkanToast('Harap masukkan angka nilai.', 'error');
    return;
  }

  tampilkanLoading(true, 'Menyimpan nilai...');
  const res = await apiRequest('nilaiPengumpulan', {
    idPengumpulan,
    nilai: Number(nilai),
    catatanGuru
  });
  tampilkanLoading(false);

  if (res.success) {
    tampilkanToast(res.message, 'success');
    await muatStatistikDashboard();
  } else {
    tampilkanToast(res.message, 'error');
  }
}

// ============================================================================
// 6. FITUR SISWA (MATERI, TUGAS, SUBMISSION)
// ============================================================================

async function muatDataSiswa() {
  tampilkanLoading(true, 'Mengambil materi dan tugas kelas Anda...');
  const idKelas = AppState.currentUser.idKelas;
  const idSiswa = AppState.currentUser.idSiswa;

  // Banner identitas siswa
  document.getElementById('studentGreetingName').textContent = AppState.currentUser.nama;
  document.getElementById('studentClassBadge').textContent = AppState.currentUser.namaKelas;

  // Muat data materi dan tugas siswa
  const [resMat, resTugas] = await Promise.all([
    apiRequest('getMateri', { idKelas }),
    apiRequest('getTugas', { idKelas, idSiswa })
  ]);

  tampilkanLoading(false);

  if (resMat.success) {
    AppState.materials = resMat.data || [];
    renderMateriSiswa('ALL');
  }

  if (resTugas.success) {
    AppState.assignments = resTugas.data || [];
    renderTugasSiswa();
  }

  // Set default view siswa ke materi
  alihkanTabSiswa('materi');
}

function alihkanTabSiswa(tab) {
  const btnMat = document.getElementById('tabStudentMateri');
  const btnTgs = document.getElementById('tabStudentTugas');
  const secMat = document.getElementById('secStudentMateri');
  const secTgs = document.getElementById('secStudentTugas');

  if (tab === 'materi') {
    btnMat.classList.add('active');
    btnTgs.classList.remove('active');
    secMat.style.display = 'block';
    secTgs.style.display = 'none';
  } else {
    btnTgs.classList.add('active');
    btnMat.classList.remove('active');
    secTgs.style.display = 'block';
    secMat.style.display = 'none';
  }
}

function renderMateriSiswa(filterTipe = 'ALL') {
  const container = document.getElementById('studentMaterialGrid');
  if (!container) return;

  let filtered = AppState.materials;
  if (filterTipe !== 'ALL') {
    filtered = filtered.filter(m => m.tipe === filterTipe);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">📖</div>
        <h4 class="empty-state-title">Belum Ada Materi</h4>
        <p class="empty-state-desc">Belum ada materi pembelajaran yang dipublikasikan untuk kategori ini.</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(m => {
    const isYt = m.tipe === 'youtube';
    const isGd = m.tipe === 'gdrive';
    const badgeClass = isYt ? 'badge-youtube' : isGd ? 'badge-gdrive' : 'badge-website';
    const labelType = isYt ? '▶️ YouTube Video' : isGd ? '📁 Google Drive' : '🌐 Website Edukasi';

    return `
      <div class="item-card">
        <div>
          <div class="item-card-header">
            <span class="item-type-badge ${badgeClass}">${labelType}</span>
          </div>
          <h3 class="item-title">${escapeHtml(m.judul)}</h3>
          <p class="item-desc">${escapeHtml(m.deskripsi || 'Pelajari materi ini dengan cermat.')}</p>
        </div>
        <div>
          <div style="margin-bottom: 1rem;">
            ${isYt ? `
              <button class="btn btn-primary" onclick="putarVideoYoutube('${escapeHtml(m.link)}', '${escapeHtml(m.judul)}')" style="width: 100%;">
                ▶️ Putar Video Sekarang
              </button>
            ` : `
              <a href="${escapeHtml(m.link)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width: 100%;">
                ${isGd ? '📥 Buka di Google Drive' : '🌐 Buka Sumber Belajar'}
              </a>
            `}
          </div>
          <div class="item-card-footer">
            <span class="badge-class">${escapeHtml(m.namaKelas)}</span>
            <small>${formatWaktu(m.createdAt)}</small>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderTugasSiswa() {
  const container = document.getElementById('studentAssignmentGrid');
  if (!container) return;

  if (AppState.assignments.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🎉</div>
        <h4 class="empty-state-title">Tidak Ada Tugas Aktif</h4>
        <p class="empty-state-desc">Semua tugas telah diselesaikan atau guru belum memberikan tugas baru.</p>
      </div>`;
    return;
  }

  container.innerHTML = AppState.assignments.map(t => {
    const isSubmitted = t.isSubmitted;
    const submission = t.submission;
    const isGraded = submission && submission.status === 'Dinilai';

    return `
      <div class="item-card">
        <div>
          <div class="item-card-header">
            <span class="badge-class">${escapeHtml(t.namaKelas)}</span>
            ${isGraded ? `
              <span class="status-pill status-graded">🏆 Nilai: ${submission.nilai}/100</span>
            ` : isSubmitted ? `
              <span class="status-pill status-submitted">⏳ Sudah Dikumpulkan</span>
            ` : `
              <span class="status-pill status-pending">⚠️ Belum Dikerjakan</span>
            `}
          </div>
          <h3 class="item-title">${escapeHtml(t.judul)}</h3>
          <p class="item-desc">${escapeHtml(t.deskripsi || 'Silakan kerjakan soal di bawah ini.')}</p>
          <div style="background: #f5f3ff; padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); margin-bottom: 1rem; font-size: 0.82rem;">
            ⏰ <strong>Batas Waktu:</strong> ${t.deadline ? escapeHtml(t.deadline) : 'Tidak ada batas waktu'}
          </div>

          ${isGraded && submission.catatanGuru ? `
            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 1rem; font-size: 0.84rem;">
              <strong>💬 Catatan Guru:</strong><br>
              ${escapeHtml(submission.catatanGuru)}
            </div>
          ` : ''}
        </div>

        <div>
          <button class="btn ${isSubmitted ? 'btn-secondary' : 'btn-primary'}" onclick="bukaModalSubmitTugas('${t.id}')" style="width: 100%;">
            ${isSubmitted ? '✏️ Perbarui Jawaban' : '📝 Kerjakan Sekarang'}
          </button>
          <div class="item-card-footer" style="margin-top: 0.85rem;">
            <small>${t.id}</small>
            <small>${isSubmitted ? 'Terkirim: ' + formatWaktu(submission.submittedAt) : 'Belum selesai'}</small>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function bukaModalSubmitTugas(idTugas) {
  const tugas = AppState.assignments.find(t => t.id === idTugas);
  if (!tugas) return;

  document.getElementById('submitModalTaskId').value = tugas.id;
  document.getElementById('submitModalTaskTitle').textContent = tugas.judul;
  document.getElementById('submitModalTaskDesc').textContent = tugas.deskripsi || '-';

  const ansInput = document.getElementById('submitAnswerText');
  const linkInput = document.getElementById('submitAttachmentLink');

  if (tugas.submission) {
    ansInput.value = tugas.submission.jawabanTeks || '';
    linkInput.value = tugas.submission.linkLampiran || '';
  } else {
    ansInput.value = '';
    linkInput.value = '';
  }

  bukaModal('modalSubmitAssignment');
}

async function handleSubmitAssignment(e) {
  e.preventDefault();
  const idTugas = document.getElementById('submitModalTaskId').value;
  const jawabanTeks = document.getElementById('submitAnswerText').value.trim();
  const linkLampiran = document.getElementById('submitAttachmentLink').value.trim();

  if (!jawabanTeks && !linkLampiran) {
    tampilkanToast('Harap tuliskan teks jawaban atau lampirkan tautan Google Drive file tugas Anda.', 'error');
    return;
  }

  tampilkanLoading(true, 'Mengirimkan jawaban tugas...');
  const res = await apiRequest('submitTugas', {
    idTugas,
    idSiswa: AppState.currentUser.idSiswa,
    namaSiswa: AppState.currentUser.nama,
    namaKelas: AppState.currentUser.namaKelas,
    jawabanTeks,
    linkLampiran
  });
  tampilkanLoading(false);

  if (res.success) {
    tampilkanToast(res.message, 'success');
    tutupModal('modalSubmitAssignment');
    await muatDataSiswa();
  } else {
    tampilkanToast(res.message, 'error');
  }
}

// ============================================================================
// 7. VIDEO PLAYER MODAL & HELPERS
// ============================================================================

function putarVideoYoutube(url, judul) {
  const videoId = ekstraksiYoutubeId(url);
  if (!videoId) {
    window.open(url, '_blank');
    return;
  }

  document.getElementById('youtubeModalTitle').textContent = judul;
  const iframeContainer = document.getElementById('youtubeIframeWrapper');
  iframeContainer.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
      title="YouTube Video Player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;

  bukaModal('modalYoutubePlayer');
}

function stopVideoYoutube() {
  const iframeContainer = document.getElementById('youtubeIframeWrapper');
  if (iframeContainer) iframeContainer.innerHTML = '';
}

function ekstraksiYoutubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// ============================================================================
// 8. UI HELPERS (MODALS, TOASTS, LOADERS)
// ============================================================================

function bukaModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function tutupModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    if (modalId === 'modalYoutubePlayer') {
      stopVideoYoutube();
    }
  }
}

function tampilkanToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideUpToast 0.3s reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function tampilkanLoading(show, message = 'Memproses data...') {
  const overlay = document.getElementById('loadingOverlay');
  const text = document.getElementById('loadingText');
  if (!overlay) return;

  if (show) {
    if (text) text.textContent = message;
    overlay.classList.add('active');
  } else {
    overlay.classList.remove('active');
  }
}

function perbaruiDropdownKelas() {
  const selects = [
    document.getElementById('bulkStudentClassSelect'),
    document.getElementById('matClassSelect'),
    document.getElementById('tgsClassSelect'),
    document.getElementById('adminStudentFilterClass'),
    document.getElementById('adminMaterialFilterClass'),
    document.getElementById('adminAssignmentFilterClass')
  ];

  selects.forEach(sel => {
    if (!sel) return;
    const isFilter = sel.id.includes('Filter');
    const currentValue = sel.value;

    let optionsHtml = isFilter ? '<option value="ALL">Semua Kelas</option>' : '<option value="">-- Pilih Kelas --</option>';
    AppState.classes.forEach(k => {
      optionsHtml += `<option value="${k.id}">${escapeHtml(k.nama)}</option>`;
    });

    sel.innerHTML = optionsHtml;
    if (currentValue) sel.value = currentValue;
  });
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatWaktu(dateVal) {
  if (!dateVal) return '-';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return String(dateVal);
  }
}

// ============================================================================
// 9. ENGINE MOCK DEMO (OFFLINE / SEBELUM APPS SCRIPT DIHUBUNGKAN)
// ============================================================================
/**
 * Menyediakan simulasi data interaktif jika pengguna belum mengisi URL Web App.
 * Memastikan antarmuka dapat dicoba secara visual langsung!
 */
const MockDB = {
  classes: [
    { id: 'KLS-001', nama: '10 MIPA 1', tingkat: 'Kelas 10', deskripsi: 'Kelas Matematika & IPA 1', jumlahSiswa: 2, createdAt: new Date() },
    { id: 'KLS-002', nama: '10 MIPA 2', tingkat: 'Kelas 10', deskripsi: 'Kelas Matematika & IPA 2', jumlahSiswa: 1, createdAt: new Date() },
    { id: 'KLS-003', nama: '11 IPS 1', tingkat: 'Kelas 11', deskripsi: 'Kelas Ilmu Pengetahuan Sosial 1', jumlahSiswa: 1, createdAt: new Date() }
  ],
  students: [
    { id: 'SIS-001', nama: 'Ahmad Fauzi', idKelas: 'KLS-001', namaKelas: '10 MIPA 1', username: 'ahmad.fauzi', password: 'siswa123', createdAt: new Date() },
    { id: 'SIS-002', nama: 'Budi Pratama', idKelas: 'KLS-001', namaKelas: '10 MIPA 1', username: 'budi.pratama', password: 'siswa123', createdAt: new Date() },
    { id: 'SIS-003', nama: 'Citra Lestari', idKelas: 'KLS-002', namaKelas: '10 MIPA 2', username: 'citra.lestari', password: 'siswa123', createdAt: new Date() },
    { id: 'SIS-004', nama: 'Dewi Anggraini', idKelas: 'KLS-003', namaKelas: '11 IPS 1', username: 'dewi.anggraini', password: 'siswa123', createdAt: new Date() }
  ],
  materials: [
    {
      id: 'MAT-001',
      judul: 'Pengantar Aljabar Linear & Matriks',
      idKelas: 'KLS-001',
      namaKelas: '10 MIPA 1',
      tipe: 'youtube',
      link: 'https://www.youtube.com/watch?v=fNk_zzaMoSs',
      deskripsi: 'Video penjelasan konsep dasar vektor dan operasi perkalian matriks secara visual.',
      createdAt: new Date()
    },
    {
      id: 'MAT-002',
      judul: 'E-Book Rangkuman Fisika: Hukum Newton & Gravitasi',
      idKelas: 'KLS-001',
      namaKelas: '10 MIPA 1',
      tipe: 'gdrive',
      link: 'https://drive.google.com',
      deskripsi: 'Modul bacaan pegangan siswa bab dinamika gerak lurus dan rotasi.',
      createdAt: new Date()
    },
    {
      id: 'MAT-003',
      judul: 'Simulasi Interaktif Fenomena Geografi Dunia',
      idKelas: 'KLS-003',
      namaKelas: '11 IPS 1',
      tipe: 'website',
      link: 'https://earth.google.com/web/',
      deskripsi: 'Eksplorasi bentang alam bumi secara 3D langsung di browser web.',
      createdAt: new Date()
    }
  ],
  assignments: [
    {
      id: 'TGS-001',
      judul: 'Latihan 1: Operasi Perkalian Matriks',
      idKelas: 'KLS-001',
      namaKelas: '10 MIPA 1',
      deskripsi: 'Kerjakan soal latihan no 1 sampai 5 di lembar kerja atau lampirkan link Google Drive jawabanmu.',
      deadline: '2026-12-31 23:59',
      createdAt: new Date(),
      totalSubmissions: 1
    },
    {
      id: 'TGS-002',
      judul: 'Esai Singkat: Analisis Fenomena Urbanisasi',
      idKelas: 'KLS-003',
      namaKelas: '11 IPS 1',
      deskripsi: 'Tuliskan esai minimal 300 kata tentang faktor penarik dan pendorong urbanisasi.',
      deadline: '2026-12-31 23:59',
      createdAt: new Date(),
      totalSubmissions: 0
    }
  ],
  submissions: [
    {
      id: 'SUB-001',
      idTugas: 'TGS-001',
      idSiswa: 'SIS-001',
      namaSiswa: 'Ahmad Fauzi',
      namaKelas: '10 MIPA 1',
      jawabanTeks: 'Berikut penyelesaian matriks 2x2 dan determinannya telah saya kerjakan lengkap.',
      linkLampiran: 'https://drive.google.com',
      nilai: 95,
      catatanGuru: 'Sangat baik dan sistematis!',
      status: 'Dinilai',
      submittedAt: new Date()
    }
  ],
  adminUser: { username: 'admin', password: 'admin123' },
  logs: [
    { timestamp: new Date(), pelaku: 'SYSTEM', role: 'DEMO', aksi: 'DEMO_READY', detail: 'Aplikasi berjalan dalam mode simulasi interaktif.' }
  ]
};

async function handleMockApiRequest(action, payload) {
  // Simulasi latensi jaringan ringan
  await new Promise(r => setTimeout(r, 200));

  switch (action) {
    case 'loginAdmin':
      if (payload.username === MockDB.adminUser.username && payload.password === MockDB.adminUser.password) {
        return { success: true, user: { role: 'admin', username: MockDB.adminUser.username, nama: 'Administrator LMS' } };
      }
      return { success: false, message: 'Username atau password Admin salah (Gunakan: admin / admin123)' };

    case 'gantiKredensialAdmin':
      if (payload.usernameLama === MockDB.adminUser.username && payload.passwordLama === MockDB.adminUser.password) {
        MockDB.adminUser.username = payload.usernameBaru;
        MockDB.adminUser.password = payload.passwordBaru;
        return { success: true, message: 'Kredensial Admin berhasil diubah (Simulasi Demo).' };
      }
      return { success: false, message: 'Kredensial lama tidak cocok.' };

    case 'loginSiswa': {
      const student = MockDB.students.find(s => s.username === payload.username.trim() && s.password === payload.password.trim());
      if (student) {
        return {
          success: true,
          message: 'Login siswa berhasil! Selamat datang, ' + student.nama,
          student: {
            role: 'siswa',
            idSiswa: student.id,
            nama: student.nama,
            idKelas: student.idKelas,
            namaKelas: student.namaKelas,
            username: student.username
          }
        };
      }
      return { success: false, message: 'Username atau password siswa salah (Coba: ahmad.fauzi / siswa123)' };
    }

    case 'getDashboardStats':
      return {
        success: true,
        stats: {
          totalKelas: MockDB.classes.length,
          totalSiswa: MockDB.students.length,
          totalMateri: MockDB.materials.length,
          totalTugas: MockDB.assignments.length,
          totalPengumpulan: MockDB.submissions.length,
          tugasDinilai: MockDB.submissions.filter(s => s.status === 'Dinilai').length,
          materiByType: {
            youtube: MockDB.materials.filter(m => m.tipe === 'youtube').length,
            gdrive: MockDB.materials.filter(m => m.tipe === 'gdrive').length,
            website: MockDB.materials.filter(m => m.tipe === 'website').length
          }
        },
        recentLogs: MockDB.logs
      };

    case 'getKelas':
      return { success: true, data: MockDB.classes };

    case 'bulkTambahKelas': {
      const lines = payload.daftarKelas.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      lines.forEach((nama, i) => {
        MockDB.classes.push({
          id: 'KLS-' + Math.floor(1000 + Math.random() * 9000),
          nama,
          tingkat: 'Umum',
          deskripsi: 'Kelas baru dibuat masal',
          jumlahSiswa: 0,
          createdAt: new Date()
        });
      });
      return { success: true, message: `Berhasil menambahkan ${lines.length} kelas secara masal (Demo Mode).` };
    }

    case 'hapusKelas':
      MockDB.classes = MockDB.classes.filter(k => k.id !== payload.idKelas);
      return { success: true, message: 'Kelas berhasil dihapus (Demo Mode).' };

    case 'getSiswa': {
      let data = MockDB.students;
      if (payload.idKelas && payload.idKelas !== 'ALL') {
        data = data.filter(s => s.idKelas === payload.idKelas);
      }
      return { success: true, data };
    }

    case 'bulkTambahSiswa': {
      const names = payload.daftarNama.split('\n').map(n => n.trim()).filter(n => n.length > 0);
      const created = [];
      names.forEach((name, i) => {
        const cleanUser = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '.');
        const newStudent = {
          id: 'SIS-' + Math.floor(1000 + Math.random() * 9000),
          nama: name,
          idKelas: payload.idKelas,
          namaKelas: payload.namaKelas,
          username: cleanUser,
          password: 'siswa123',
          createdAt: new Date()
        };
        MockDB.students.push(newStudent);
        created.push(newStudent);
      });
      return { success: true, message: `Berhasil mendaftarkan ${names.length} siswa secara masal!`, daftarAkun: created };
    }

    case 'hapusSiswa':
      MockDB.students = MockDB.students.filter(s => s.id !== payload.idSiswa);
      return { success: true, message: 'Siswa berhasil dihapus (Demo Mode).' };

    case 'resetPasswordSiswa': {
      const s = MockDB.students.find(st => st.id === payload.idSiswa);
      if (s) s.password = 'siswa123';
      return { success: true, message: 'Password siswa direset ke: siswa123' };
    }

    case 'getMateri': {
      let data = MockDB.materials;
      if (payload.idKelas && payload.idKelas !== 'ALL') {
        data = data.filter(m => m.idKelas === payload.idKelas);
      }
      return { success: true, data };
    }

    case 'tambahMateri': {
      const newMat = {
        id: 'MAT-' + Math.floor(1000 + Math.random() * 9000),
        judul: payload.judul,
        idKelas: payload.idKelas,
        namaKelas: payload.namaKelas,
        tipe: payload.tipeMateri,
        link: payload.linkResource,
        deskripsi: payload.deskripsi,
        createdAt: new Date()
      };
      MockDB.materials.unshift(newMat);
      return { success: true, message: 'Materi berhasil dipublikasikan (Demo Mode)!' };
    }

    case 'hapusMateri':
      MockDB.materials = MockDB.materials.filter(m => m.id !== payload.idMateri);
      return { success: true, message: 'Materi berhasil dihapus (Demo Mode).' };

    case 'getTugas': {
      let data = MockDB.assignments.map(t => {
        const item = { ...t };
        if (payload.idSiswa) {
          const sub = MockDB.submissions.find(s => s.idTugas === t.id && s.idSiswa === payload.idSiswa);
          item.isSubmitted = !!sub;
          item.submission = sub || null;
        }
        return item;
      });
      if (payload.idKelas && payload.idKelas !== 'ALL') {
        data = data.filter(t => t.idKelas === payload.idKelas);
      }
      return { success: true, data };
    }

    case 'tambahTugas': {
      const newTugas = {
        id: 'TGS-' + Math.floor(1000 + Math.random() * 9000),
        judul: payload.judul,
        idKelas: payload.idKelas,
        namaKelas: payload.namaKelas,
        deskripsi: payload.deskripsi,
        deadline: payload.deadline,
        createdAt: new Date(),
        totalSubmissions: 0
      };
      MockDB.assignments.unshift(newTugas);
      return { success: true, message: 'Tugas berhasil dipublikasikan (Demo Mode)!' };
    }

    case 'hapusTugas':
      MockDB.assignments = MockDB.assignments.filter(t => t.id !== payload.idTugas);
      return { success: true, message: 'Tugas berhasil dihapus (Demo Mode).' };

    case 'submitTugas': {
      const existing = MockDB.submissions.find(s => s.idTugas === payload.idTugas && s.idSiswa === payload.idSiswa);
      if (existing) {
        existing.jawabanTeks = payload.jawabanTeks;
        existing.linkLampiran = payload.linkLampiran;
        existing.submittedAt = new Date();
      } else {
        MockDB.submissions.push({
          id: 'SUB-' + Math.floor(1000 + Math.random() * 9000),
          idTugas: payload.idTugas,
          idSiswa: payload.idSiswa,
          namaSiswa: payload.namaSiswa,
          namaKelas: payload.namaKelas,
          jawabanTeks: payload.jawabanTeks,
          linkLampiran: payload.linkLampiran,
          nilai: '',
          catatanGuru: '',
          status: 'Sudah Dikumpulkan',
          submittedAt: new Date()
        });
      }
      return { success: true, message: 'Tugas berhasil dikumpulkan (Demo Mode)!' };
    }

    case 'getPengumpulanByTugas': {
      const subs = MockDB.submissions.filter(s => s.idTugas === payload.idTugas);
      return { success: true, data: subs };
    }

    case 'nilaiPengumpulan': {
      const sub = MockDB.submissions.find(s => s.id === payload.idPengumpulan);
      if (sub) {
        sub.nilai = payload.nilai;
        sub.catatanGuru = payload.catatanGuru;
        sub.status = 'Dinilai';
      }
      return { success: true, message: 'Nilai dan catatan guru tersimpan (Demo Mode)!' };
    }

    default:
      return { success: false, message: 'Aksi API demo tidak dikenali.' };
  }
}
