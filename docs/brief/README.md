# Project Brief: Aplikasi Booking Ruang Rapat

---

## Tujuan Utama

Membuat sistem yang cepat dan andal untuk memesan ruang rapat, dengan fokus utama mencegah jadwal bentrok.

---

## Rincian Fitur

### Halaman Utama / Dashboard

- Fokus utama halaman ini adalah menampilkan jadwal untuk satu ruangan spesifik dalam format mingguan (Senin - Minggu).
- Tampilan harus visual (kalender atau linimasa), bukan tabel.
- Harus ada pilihan (dropdown) untuk beralih dan melihat jadwal ruangan lain.
- Halaman ini bisa diakses siapa saja tanpa perlu login.

### Alur Proses Booking

1. Pengguna mengklik slot waktu yang kosong di jadwal untuk memulai proses pemesanan.
2. Sistem kemudian akan meminta pengguna untuk Login.
3. Setelah berhasil login, form booking akan tampil. Form minimal berisi input untuk Agenda Rapat.
4. Tombol persetujuan pada form menggunakan nama "Booking".

### Aturan Validasi & Anti-Bentrok

- Sistem harus secara otomatis menolak pemesanan jika waktunya tumpang tindih dengan jadwal yang sudah ada di ruangan yang sama.
- Tampilkan pesan error yang jelas kepada pengguna jika terjadi bentrok.

### Halaman Pengguna ("Jadwal Saya")

- Setelah login, harus ada halaman di mana pengguna dapat melihat daftar semua jadwal yang telah mereka buat.
- Di halaman ini, sediakan tombol untuk membatalkan booking mereka sendiri.

### Fitur Khusus Admin

- Admin memiliki hak akses untuk mengelola data ruangan (menambah, mengubah, atau menghapus).
- Admin dapat membatalkan booking milik pengguna manapun jika diperlukan.

---

## Kriteria Tambahan

- Tampilan antarmuka harus bersih, profesional, dan berfungsi dengan baik di perangkat mobile.
- Pada tampilan kalender, setiap blok jadwal yang terisi harus menampilkan informasi agenda rapat dan nama pemesan.
