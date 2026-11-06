# Throune v0.1

Website lari mobile dengan React, TypeScript, Vite, Leaflet/OpenStreetMap, Turf dan localStorage.

## Menjalankan lokal

```sh
npm install
npm run dev
```

Buka URL localhost dari Vite. Izinkan akses lokasi. Untuk GPS pada ponsel gunakan HTTPS; alamat IP LAN lewat HTTP umumnya tidak mendapat izin geolocation. Tidak ada backend atau akun; data hanya berada di browser ini dan dapat hilang jika data situs dihapus.

## Alur

Isi nama  Mulai lari  Selesai  isi judul dan catatan opsional  Simpan aktivitas. Riwayat menampilkan jejak, durasi dan wilayah. Simulasi loop disediakan untuk mencoba alur, ditandai terpisah dan tidak menambah statistik lari asli. Peta awal berada di Jakarta; tombol Lokasi saya memusatkan peta ke posisi perangkat.

Draft disimpan setiap pembaruan. Setelah reload, pilih lanjutkan rekaman atau akhiri. Durasi adalah waktu berjalan sejak mulai, termasuk jeda. Titik yang hilang saat browser tertutup/tidur tidak dapat dipulihkan; jaga halaman tetap terbuka. Website bukan pelacak GPS background.

## Aturan awal

- Akurasi GPS maksimal 40 m, perpindahan minimal 3 m, kecepatan maksimal 12 m/detik.
- Loop minimal 6 titik, panjang 300 m, jarak akhir ke awal maksimal 50 m.
- Luas minimal 1.000 m�; loop berpotongan ditolak. Maksimal satu wilayah per aktivitas.
- Aktivitas tanpa loop tetap bisa disimpan dengan minimal 2 titik dan judul.
- Wilayah adalah visualisasi lokal, bukan klaim kepemilikan atau sistem kompetisi.

## Validasi

`npm run build` memeriksa TypeScript dan membuat build. `npm test` menguji perhitungan jarak, loop, dan penyaringan GPS.

Peta OSM dan font memerlukan internet. Font memiliki fallback sistem. Uji GPS nyata di perangkat sebelum dipakai untuk aktivitas panjang. Belum ada login, server, Strava, ranking, atau smart contract. Tidak ada push/deploy otomatis.

## Mengaktifkan Supabase

1. Buat project gratis di https://supabase.com/dashboard.
2. Buka SQL Editor, jalankan isi supabase/schema.sql untuk membuat tabel serta akses API.
3. Salin Project URL dan anon/publishable key dari Project Settings  API.
4. Untuk lokal, salin .env.example menjadi .env.local lalu isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.
5. Untuk Vercel, masukkan dua nilai yang sama pada Project  Settings  Environment Variables untuk Production dan Preview, kemudian redeploy.

Username-only tidak membuktikan kepemilikan username. Kebijakan SQL MVP ini membuat riwayat publik: orang yang tahu username dapat membaca atau mengubah aktivitas, termasuk jejak GPS. Jangan gunakan untuk data lokasi sensitif. Jangan pernah menaruh service_role key di frontend.

