# Mount SD Card Otomatis Setelah Reboot

Panduan ini menjelaskan cara agar SD card yang sudah dimount ke direktori tertentu (misal `/sd`) tetap ter-mount otomatis setelah reboot menggunakan konfigurasi pada file `/etc/fstab`.

## 1. Pastikan SD Card Sudah Ter-mount

Pastikan SD card sudah terpasang dan dimount ke lokasi yang diinginkan (misal `/sd`).

```bash
df -h
```

Pastikan `/sd` muncul di output.

## 2. Cari Identifikasi Partisi SD Card

Cari tahu partisi yang digunakan SD card, biasanya seperti `/dev/mmcblk1p1` atau `/dev/sda1`.

```bash
sudo blkid
```

Contoh output:
```
/dev/mmcblk1p1: UUID="xxxxxx-xxxx-xxxx" TYPE="ext4"
```

## 3. Edit File `/etc/fstab`

Buka file `/etc/fstab` dengan editor teks:

```bash
sudo nano /etc/fstab
```

## 4. Tambahkan Entri untuk SD Card

Tambahkan baris berikut di bagian bawah file, sesuaikan UUID dan filesystem:

```
UUID=xxxxxxxx-xxxx-xxxx-xxxx  /sd  ext4  defaults  0  2
```

- Ganti `xxxxxxxx-xxxx-xxxx-xxxx` dengan UUID SD card.
- `/sd` adalah mount point.
- `ext4` adalah tipe filesystem (sesuaikan jika berbeda).

Simpan dan keluar dari editor.

## 5. Uji Mount Otomatis

Jalankan perintah berikut untuk menguji konfigurasi:

```bash
sudo mount -a
```

## 6. Verifikasi

Pastikan SD card sudah ter-mount:

```bash
df -h
```

## 7. Reboot untuk Pengujian

Reboot sistem:

```bash
sudo reboot
```

Setelah reboot, cek kembali:

```bash
df -h
```

SD card seharusnya sudah otomatis ter-mount di `/sd`.

---

> **Catatan:** Pastikan mount point (`/sd`) sudah ada sebelum reboot. Jika belum, buat dengan `sudo mkdir /sd`.