---
name: webappbuilder-ui-designer
description: "Ekstrak spesifikasi desain UI/UX secara mendalam dari gambar referensi (screenshot, mockup, atau desain aplikasi) menjadi dokumen teks terstruktur dan Design System Blueprint yang siap dikombinasikan dengan skill Webapp Builder. Gunakan saat pengguna melampirkan gambar UI dan meminta analisis desain, bedah tampilan, referensi gaya visual, atau spesifikasi UI untuk pembuatan aplikasi web."
---
# UI Designer

Skill ini menganalisis gambar referensi antarmuka (UI) yang dilampirkan pengguna dan menerjemahkannya menjadi spesifikasi desain berbasis teks yang komprehensif, terstruktur, dan siap dieksekusi oleh skill pembuatan aplikasi (Webapp Builder).

## When to Use

- Pengguna melampirkan gambar (screenshot aplikasi, mockup, dribble shot, atau wireframe) dan meminta analisis atau spesifikasi UI.
- Pengguna ingin mengekstrak gaya visual, warna, tipografi, dan tata letak dari gambar sebagai referensi sebelum membangun aplikasi.
- Pengguna meminta "bedah UI", "ambil referensi dari gambar ini", atau "buat spesifikasi desain dari gambar" untuk digabungkan dengan skill Webapp Builder.

## Steps

1. **Identifikasi Karakter & Gaya Desain Utama**
   Tentukan jenis dan kategori gaya visual dari gambar yang dilampirkan (misalnya: Modern Minimalist, Glassmorphism, Neumorphism, Bento Grid, Clean Corporate, Playful/Gamified, atau Dark Mode Futuristic) beserta kesan umum dan target penggunaannya.

2. **Ekstraksi Palet Warna & Token Visual**
   Identifikasi warna-warna utama dari gambar dan konversikan ke dalam kode HEX beserta padanan class Tailwind CSS terdekat:
   - **Background Colors**: Warna latar utama (Primary BG), latar sekunder/surface (Card/Modal BG).
   - **Brand/Accent Colors**: Warna utama tombol, elemen aktif, dan highlight (Primary & Secondary Accent).
   - **Text/Typography Colors**: Warna teks judul (Heading), teks isi (Body), dan teks redup (Muted/Placeholder).
   - **Status & Border Colors**: Warna garis tepi (Border/Divider), serta indikator status jika ada (Success, Warning, Danger).

3. **Analisis Tipografi & Hierarki Teks**
   Jelaskan karakteristik teks yang terlihat pada referensi:
   - Jenis font yang disarankan (misal: Inter, Plus Jakarta Sans, Poppins, atau Roboto).
   - Hierarki ukuran dan ketebalan (Heading, Subheading, Body, Caption/Label).
   - Kerapatan teks (line-height, letter-spacing) dan perataan teks.

4. **Bedah Tata Letak (Layout) & Navigasi**
   Uraikan struktur kerangka halaman secara menyeluruh:
   - **Sistem Navigasi**: Posisi dan bentuk navigasi (misal: Bottom Navigation Bar ala mobile app, Sidebar, Top Navbar, atau Floating Action Button).
   - **Struktur Grid & Spacing**: Pola penyusunan konten (Single Column Mobile-First, Bento Grid, 2-Column Asymmetric, dll.), estimasi padding kontainer, dan jarak antar elemen (gap).
   - **Responsivitas**: Bagaimana layout tersebut harus beradaptasi di layar smartphone (mobile-first) maupun desktop.

5. **Rincian Komponen UI (Component Breakdown)**
   Daftar setiap komponen spesifik yang tampak di dalam gambar dari atas ke bawah beserta detail bentuknya:
   - **Header / Hero Section**: Avatar, sapaan, ikon notifikasi, search bar, atau banner.
   - **Cards & Containers**: Tingkat kelengkungan sudut (border-radius seperti `rounded-xl`, `rounded-2xl`, `rounded-3xl`), gaya bayangan (`shadow-sm`, `shadow-lg`, atau flat dengan border tipis), dan efek latar (solid, gradient, atau blur/glass).
   - **Buttons, Badges & Inputs**: Bentuk tombol (pill/rounded-full atau rounded-lg), gaya input form, chip filter, atau tab navigasi.
   - **Data Visualization / Lists**: Tampilan grafik, progress bar, tabel, atau daftar item (list view).

6. **Rekomendasi Interaksi & Micro-interactions**
   Berikan saran singkat mengenai transisi, efek hover/active, state loading (skeleton), dan library ikon yang paling cocok (misalnya Lucide Icons, Heroicons, atau Phosphor Icons) agar hasil akhir di Webapp Builder terasa hidup.

7. **Susun Prompt Blueprint untuk Webapp Builder**
   Di bagian paling akhir, rangkum seluruh hasil analisis ke dalam satu blok **"Design System Blueprint (Siap Pakai untuk Webapp Builder)"** yang padat dan instruktif. Bagian ini dirancang agar langsung terbaca oleh agen saat mengeksekusi skill Webapp Builder pada tahap berikutnya.

## Format Output

Sajikan respons dalam Bahasa Indonesia yang rapi dan terstruktur menggunakan urutan bagian berikut:

- **1. Karakter & Gaya Desain (UI Style)**
- **2. Palet Warna & Token (HEX & Tailwind)**
- **3. Tipografi & Hierarki**
- **4. Struktur Layout & Navigasi**
- **5. Bedah Komponen Detail**
- **6. Detail Visual & Interaksi (Shadows, Radius, Icons)**
- **7. Design System Blueprint (Untuk Webapp Builder)**

## Gotchas

- **Jangan menulis kode aplikasi penuh**: Fokus utama skill ini adalah memberikan deskripsi teks, jenis, dan spesifikasi mendalam dari desain UI. Jangan men-generate kode HTML/JS aplikasi secara utuh kecuali pengguna memintanya secara eksplisit di luar analisis.
- **Berikan nilai yang konkret dan terukur**: Hindari deskripsi kabur seperti "sudut agak melengkung" atau "warna biru muda". Gunakan istilah terukur seperti "sudut sangat membulat (`rounded-2xl` / 16px)" dan kode HEX spesifik (misal `#3B82F6` / `bg-blue-500`).
- **Siap dikombinasikan**: Pastikan bagian ke-7 (Design System Blueprint) merangkum aturan UI secara tegas sehingga ketika pengguna memanggil skill Webapp Builder (Supabase, Firebase, atau GAS), gaya visual dari gambar langsung teraplikasikan dengan akurat.
