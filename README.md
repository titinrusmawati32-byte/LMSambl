# ☁️ LMS EduCloud - Smart Learning Management System

Aplikasi **Learning Management System (LMS)** modern, responsif, dan interaktif yang dibangun menggunakan arsitektur **Serverless**:
- **Backend & Database**: Google Apps Script (`Code.gs`, `Setup.gs`) dan Google Sheets sebagai database relasional.
- **Frontend**: Single Page Application (HTML5, Modern CSS Glassmorphism, Vanilla JS) yang siap di-push ke **GitHub** dan di-deploy ke **Vercel** secara gratis.
- **Penghubung (Bridge)**: Terhubung secara instan melalui berkas konfigurasi `config.js`.

---

## 🎨 Tampilan & Desain
Terinspirasi dari desain UI antarmuka modern bernuansa gradien ungu pastel (*Violet / Purple Gradient & Glassmorphism*):
- Glowing header dengan indikator progres penyelesaian tugas siswa.
- Kartu kategori aksi cepat (*Quick Action Tiles*).
- Pemutar video YouTube interaktif *embedded* langsung di dalam aplikasi.
- Desain responsif di perangkat desktop, tablet, maupun smartphone.

---

## 🚀 Fitur Unggulan

### 👑 Role Admin (Guru / Administrator)
1. **Autentikasi Aman & Ganti Kredensial**:
   - Login admin terverifikasi ke database `Config`.
   - Admin dapat mengganti *Username* dan *Password* langsung dari dashboard.
2. **Input Kelas Masal (*Bulk Class Input*)**:
   - Input banyak kelas sekaligus hanya dengan memisahkan baris baru (*multiline*). ID kelas digenerate otomatis secara unik.
3. **Input Siswa Masal (*Bulk Student Input*)**:
   - Cukup masukkan daftar nama lengkap siswa (satu per baris).
   - **Otomatis Dibuatkan Username** (format bersih seperti `ahmad.fauzi` dengan penanganan resolusi duplikasi nama).
   - **Otomatis Disetelkan Password Default** (`siswa123`).
   - Dilengkapi *Live Pratinjau Generator Akun* sebelum disimpan.
4. **Manajemen Materi Terintegrasi**:
   - Mendukung 3 tipe materi:
     - **Link Video YouTube**: Dilengkapi pemutar video pop-up langsung (*embedded modal*).
     - **Link Google Drive**: Membuka dokumen, modul PDF, atau spreadsheet.
     - **Link Website**: Sumber belajar dan artikel eksternal.
5. **Manajemen Tugas, Soal & Penilaian**:
   - Buat tugas/ujian dengan batas waktu (*deadline*) dan instruksi soal.
   - Evaluasi pengumpulan siswa, input nilai (skala 0 - 100), dan berikan umpan balik / catatan guru.
6. **Dashboard Interaktif**:
   - Metrik ringkasan (*Total Kelas, Siswa, Materi, Tugas*).
   - Grafik distribusi tipe materi dan rasio tugas yang telah dinilai.
   - Riwayat catatan log aktivitas sistem *real-time*.

### 👨‍🎓 Role Siswa
1. **Login Siswa**:
   - Siswa login menggunakan username hasil generate admin dan password `siswa123`.
2. **Portal Materi Pembelajaran**:
   - Filter materi per kategori (YouTube, Google Drive, Website).
   - Tonton materi video langsung di dalam web tanpa harus keluar aplikasi.
3. **Pengerjaan & Pengumpulan Tugas**:
   - Membaca instruksi dan tenggat waktu tugas kelasnya.
   - Mengumpulkan jawaban teks/esai dan menyematkan link Google Drive berkas jawaban.
   - Melihat status tugas:
     - ⚠️ **Belum Dikerjakan**
     - ⏳ **Sudah Dikumpulkan** (Menunggu evaluasi guru)
     - 🏆 **Dinilai** (Menampilkan perolehan skor nilai dan catatan evaluasi dari guru)

---

## 📁 Struktur Berkas

```
aplikasi-lms/
├── Code.gs            # Backend Google Apps Script (REST API, doGet, doPost, CRUD, Auth)
├── Setup.gs           # Database setup, header tabel, data sampel, dan trigger otomatis
├── index.html         # Antarmuka Web App utama (Responsive SPA)
├── config.js          # Konfigurasi endpoint URL Google Apps Script Web App
├── style.css          # Desain modern violet glassmorphism
├── app.js             # Logika aplikasi frontend, state management, & Demo Mock fallback
├── vercel.json        # Konfigurasi deployment statis Vercel
├── .gitignore         # Berkas gitignore
└── README.md          # Dokumentasi lengkap panduan instalasi
```

---

## 🛠️ Panduan Instalasi Langkah-demi-Langkah

### Langkah 1: Siapkan Database Google Sheets & Apps Script
1. Buka [Google Sheets](https://sheets.new) di browser Anda dan buat spreadsheet baru (misal beri judul `Database LMS EduCloud`).
2. Klik menu **Extensions** (Ekstensi) > **Apps Script**.
3. Di editor Apps Script:
   - Ubah berkas `Code.gs` dengan menyalin isi dari berkas `Code.gs` di repositori ini.
   - Tambahkan berkas baru bernama `Setup.gs` (klik tanda `+` > *Script*), lalu salin seluruh isi dari berkas `Setup.gs`.
4. Jalankan fungsi inisialisasi:
   - Pada dropdown fungsi di bagian atas editor Apps Script, pilih fungsi `setupLMS`.
   - Klik tombol **Run** (Jalankan).
   - Setujui perizinan akun Google (*Review permissions* > *Allow*).
   - Sistem akan secara otomatis membuat 7 sheet: `Config`, `Kelas`, `Siswa`, `Materi`, `Tugas`, `Pengumpulan`, `Aktivitas_Log` lengkap dengan header tabel berwarna dan data sampel.

### Langkah 2: Deploy Google Apps Script Sebagai Web App
1. Di halaman Apps Script, klik tombol biru **Deploy** (Terapkan) di kanan atas > pilih **New deployment** (Penerapan baru).
2. Klik ikon gerigi (Select type) > pilih **Web app**.
3. Isi konfigurasi deployment:
   - **Description**: `LMS EduCloud Backend v1`
   - **Execute as**: **Me (emailanda@gmail.com)**
   - **Who has access**: **Anyone** *(Wajib "Anyone" agar frontend Vercel dapat mengakses API database tanpa kendala izin)*
4. Klik **Deploy**.
5. Salin **Web app URL** yang muncul (format: `https://script.google.com/macros/s/AKfycb.../exec`).

### Langkah 3: Hubungkan Frontend ke Database (`config.js`)
Buka berkas `config.js` di repositori ini, lalu ganti nilai `API_URL`:
```javascript
const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycb.../exec", // Tempelkan URL Web App Anda
  APP_NAME: "LMS EduCloud",
  ...
};
```
> *Catatan: `config.js` adalah satu-satunya konfigurasi database di frontend. Tidak ada form/menu database di tampilan pengguna sehingga ketika repositori ini di-deploy ke Vercel, aplikasi langsung otomatis tersambung ke database Google Apps Script.*

### Langkah 4: Push ke GitHub & Deploy ke Vercel

1. **Inisialisasi Git & Push ke GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit LMS EduCloud"
   git branch -M main
   git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git
   git push -u origin main
   ```

2. **Deploy di Vercel**:
   - Kunjungi [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
   - Klik **"Add New..."** > **"Project"**.
   - Pilih repositori GitHub Anda yang baru dibuat.
   - Biarkan pengaturan build default (*Framework Preset: Other / Static Site*).
   - Klik tombol **"Deploy"**.
   - Dalam beberapa detik, website LMS Anda telah aktif dan dapat diakses publik di URL Vercel (misal: `https://aplikasi-lms.vercel.app`).

---

## 🔑 Kredensial Login Bawaan

| Peran | Username | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Akses penuh dashboard guru, kelas, siswa, materi, dan tugas |
| **Siswa 1** | `ahmad.fauzi` | `siswa123` | Siswa kelas 10 MIPA 1 |
| **Siswa 2** | `budi.pratama` | `siswa123` | Siswa kelas 10 MIPA 1 |
| **Siswa 3** | `citra.lestari` | `siswa123` | Siswa kelas 10 MIPA 2 |
| **Siswa 4** | `dewi.anggraini` | `siswa123` | Siswa kelas 11 IPS 1 |

> *Catatan: Seluruh siswa baru yang ditambahkan secara masal oleh Admin akan otomatis memiliki format username `nama.lengkap` dan password bawaan `siswa123`.*

---

## ⚡ Optimalisasi Kinerja Google Apps Script
- Seluruh pembacaan dan penulisan data ke Google Sheets menggunakan metode **Batch Operation** (`getDataRange().getValues()` dan `setValues()`), **bebas dari pemanggilan API di dalam perulangan (looping)** untuk menghindari limit kuota Google.
- Mendukung pemanggilan *Simple POST Request* tanpa *CORS Preflight Trigger* dari browser.
- Dilengkapi mekanisme *Time-Driven Trigger* harian untuk pembersihan log berkala dan penjagaan performa database.
