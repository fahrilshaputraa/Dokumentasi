# Sistem Fingerprint GKIM

> Dokumentasi lengkap untuk troubleshooting dan pengelolaan sistem absensi fingerprint

## Arsitektur Sistem

Sistem fingerprint GKIM terdiri dari 4 komponen utama:

1. **Perangkat Fingerprint** - Sistem pengumpulan data absen dari sidik jari
2. **Pengambilan Data Fingerprint (Easylink)** - Software dari Fingerspot untuk mengambil data via API
3. **Container Sistem Penghubung** - Code untuk menghubungkan data dari Easylink ke Website Admin
4. **Website Admin Absen** - Interface untuk melihat dan mengelola data absensi

## Quick Start

### Akses VM Browser
```
URL: http://192.168.100.100:9090
Username: gkim
Password: Sukres32!
```

### Akses Server
```bash
ssh gkim@192.168.100.100
```

## Troubleshooting

### 1. Pemeriksaan VM Status

!> **Langkah Pertama**: Selalu check VM terlebih dahulu sebelum troubleshooting lainnya

1. Buka browser ke `http://192.168.100.100:9090`
2. Login dengan kredensial di atas
3. Klik **Limited Access** (sebelah kanan Help)
4. Masukkan password kembali
5. Periksa status VM:
   - ✅ **Aktif**: Aman, tidak perlu action
   - ❌ **Tidak aktif**: Klik **Run**

### 2. Pemeriksaan Aplikasi Easylink

1. Klik VM `vm7-2024-8-14` pada table list
2. Akses **Console** (menampilkan Windows 7)
3. Buka aplikasi **Easylink** di VM
4. Periksa logs yang ditampilkan:

```
✅ Status AMAN: "GerProductData OK"
❌ Status BERMASALAH: "Tidak bisa terhubung dengan mesin! Silahkan cek koneksi jaringan anda.."
```

### 3. Pemeriksaan Koneksi Fingerprint

Jika Easylink menunjukkan masalah koneksi:

```bash
# Test koneksi ke fingerprint
telnet 192.168.100.22 5005
```

**Output yang diharapkan:**
```
Trying 192.168.100.22...
Connected to 192.168.100.22.
Escape character is '^]'.
```

**Jika hanya muncul:**
```
Trying 192.168.100.22...
```

?> **Solusi**: Restart perangkat fingerprint

⚠️ **WARNING**: Data pada fingerprint akan hilang setelah restart karena perangkat tidak memiliki memory

## Testing Data Real-time

Untuk testing apakah data masuk ke website tanpa menunggu 1 jam:

```bash
# Jalankan container temporary untuk testing
docker run --rm --name fingerprint-listener \
  --env-file /home/gkim/Apps/finger-listener/.env \
  -v /home/gkim/Apps/finger-listener/devices.yaml:/opt/app/devices.yaml \
  rndsemesta.azurecr.io/app-gkim-fingerprint-listener:main
```

**Interpretasi Output:**
- `200` = Data berhasil dikirim
- `400` = Error (contoh: harusnya checkout malah checkin)

!> **PENTING**: Jangan menjalankan container fingerprint yang sudah ada, karena akan menyebabkan error

## Cronjob Schedule

Sistem berjalan otomatis menggunakan cronjob:

```bash
# Lihat list cronjob
crontab -l

# Lihat logs cronjob
sudo tail -f /var/log/cron
```

**Schedule yang aktif:**
- `0 * * * *` - Setiap jam pada menit ke-00 (08:00, 09:00, dst)
- `0 12 * * 0` - Setiap hari Minggu pukul 12:00 siang

## Penjelasan Detail Sistem

### Perangkat Fingerprint
Sistem pengumpulan data absen dari sidik jari yang tersimpan pada perangkat. User melakukan absensi dengan meletakkan jari pada scanner.

### Easylink
Software dari Fingerspot yang berfungsi:
- Mengambil data dari perangkat fingerprint via IP dan port
- Menyediakan API untuk sistem eksternal
- Menampilkan logs aktivitas

### Sistem Penghubung
Container yang dirancang untuk:
- Mengambil data dari API Easylink
- Memproses dan memformat data
- Mengirim data ke API Website Admin

### Website Admin
Interface web yang menyediakan:
- Tampilan data absensi yang mudah dipahami
- API endpoint untuk menerima data
- Penyimpanan data ke database
- Dashboard untuk monitoring absensi

## FAQ

**Q: Mengapa harus menunggu 1 jam untuk melihat data?**
A: Sistem berjalan dengan cronjob setiap jam. Gunakan container testing untuk real-time checking.

**Q: Data fingerprint hilang setelah restart?**
A: Ya, perangkat tidak memiliki memory permanen. Data hanya tersimpan sementara.

**Q: Container fingerprint error saat testing?**
A: Pastikan tidak ada container fingerprint lain yang sedang berjalan.
