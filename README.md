# 💭 Memory Lane

Memory Lane adalah aplikasi pencatat cerita pribadi (buku harian digital) yang eksklusif, responsif, dan mudah digunakan. Dirancang khusus dengan sentuhan personal menggunakan font *Lora* dan warna dominan *Sage Green*, memberikan sensasi klasik layaknya menulis di dalam buku kenangan premium.

## ✨ Fitur Utama

- **Quick Capture:** Fitur mencatat super instan dengan antarmuka *Floating Action Button (FAB)*. Aman dari gangguan layar keyboard (Safe Area UI) di segala ukuran ponsel kesayangan Anda.
- **Kamera Langsung (HTML5 Native):** Terintegrasi sempurna dengan perangkat *mobile*. Mengunggah foto berkesan setiap harinya menjadi satu-klik saja.
- **Story Queue:** Daftar memori interaktif untuk membaca semua hal manis maupun keseharian secara mundur (*timeline*).
- **Smooth Micro-Interactions:** Dirancang dengan *Framer Motion*, menawarkan detail percikan (Particle burst) dan efek pudar (*fade out*) saat mengeklik kartu memori sebagai sensasi kepuasan. 
- **Haptic Vibrate Feedback:** Getaran *Duk-Duk!* yang khas di ponsel mengindikasikan cerita Anda sukses tersimpan di pangkalan data secara tenang.
- **Otomasi Instan:** Perubahan langsung dimuat ke layar seketika memori tersimpan via Event Sinyal tanpa perlu me-refresh halaman!

## 🛠️ Tech Stack

Sebuah tumpukan teknologi modern namun ringan:
- **Kerangka Web:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 
- **Animasi:** Framer Motion
- **Icon Hiasan:** Lucide React
- **Database & Storage (BaaS):** Supabase (PostgreSQL)
- **Deployment & Hosting:** Vercel

## 🚀 Cara Menjalankan Secara Lokal

Pastikan komputer/laptop telah terinstal [Node.js](https://nodejs.org/) & [Git](https://git-scm.com/).

1. Klon / Unduh Repositori ini.
2. Buka Terminal pada folder proyek, lalu instal kebutuhan kodenya:
   ```bash
   npm install
   ```
3. (Opsional) Buat berkas bernama `.env.local` di _root_ proyek dan sisipkan URL & Key Anonim Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=Isi_Dengan_URL_Anda
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=Isi_Dengan_Anon_Key_Anda
   ```
4. Putar mesin pemrosesan dan masuk ke portal utamanya:
   ```bash
   npm run dev
   ```
5. Buka `http://localhost:3000` di *Browser* Anda!

## 🔓 Catatan Database

Aplikasi versi eksklusif perseorangan ini beroperasi dalam status perlindungan sandi berlapis *dimatikan sementara* atau biasa kita sebut **Row Level Security (RLS) ter-Bypass** pada platform Supabase—karena kerangka masuk kata sandi telah ditiadakan agar aplikasinya sigap melayani Anda kapan pun Anda membuka layarnya. Sangat disarankan hanya membagi URL Production Anda (Vercel) ke perangkat intim Anda/Orang tercinta saja! 

---
*Dibuat dengan cinta untuk mencatat cerita hari ini—dan masa depan.*
