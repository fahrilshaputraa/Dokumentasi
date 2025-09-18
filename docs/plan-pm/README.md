# Preventive Maintenance Plan – Zabbix Platform

## Tujuan & Ruang Lingkup
Preventive maintenance ini bertujuan menjaga ketersediaan layanan monitoring dengan mengeksekusi perawatan terjadwal pada seluruh komponen Zabbix Server, Zabbix Proxy, dan dependensi pendukungnya. Pekerjaan mencakup enam node (dua server utama di DC1 dan DC2, empat proxy di DC1, DC2, DMZ-DC1, DMZ-DC2). Seluruh eviden seperti screenshot, output perintah, dan berkas backup harus dibukukan mengikuti struktur berikut.

```
F:\WORK\ZABBIX\PM-19-09-2025\DATA-COLLECTION
├───01_zabbix-server-dc1
│   ├───01_Precheck
│   ├───02_Backup
│   ├───03_Action
│   ├───04_Postcheck
│   └───05_Issue
├───02_zabbix-server-dc2
│   ├───01_Precheck
│   ├───02_Backup
│   ├───03_Action
│   ├───04_Postcheck
│   └───05_Issue
├───03_zabbix-proxy-dc1
│   ├───01_Precheck
│   ├───02_Backup
│   ├───03_Action
│   ├───04_Postcheck
│   └───05_Issue
├───04_zabbix-proxy-dc2
│   ├───01_Precheck
│   ├───02_Backup
│   ├───03_Action
│   ├───04_Postcheck
│   └───05_Issue
├───05_zabbix-proxy-dmz-dc1
│   ├───01_Precheck
│   ├───02_Backup
│   ├───03_Action
│   ├───04_Postcheck
│   └───05_Issue
└───06_zabbix-proxy-dmz-dc2
    ├───01_Precheck
    ├───02_Backup
    ├───03_Action
    ├───04_Postcheck
    └───05_Issue
```

## Persiapan Umum
1. Sampaikan jadwal preventive maintenance dan pastikan persetujuan downtime jika dibutuhkan.
2. Verifikasi kapasitas penyimpanan untuk snapshot VM, file image, dan arsip backup.
3. Uji akses ke seluruh server, termasuk jalur DMZ dan kredensial database.
4. Siapkan template catatan untuk mendokumentasikan temuan, kendala, dan tindak lanjut.

## Langkah 1 – Precheck
1. Ambil snapshot VM pada setiap node sebelum memulai pekerjaan dan catat ID snapshot dalam log aktivitas.
2. Jalankan pemeriksaan layanan dengan perintah berikut lalu simpan outputnya:
   ```bash
   docker-compose ps
   ```
3. Capture kondisi awal: screenshot dashboard monitoring, status container, dan catat versi OS, Docker, Zabbix, serta Selenium.
4. Uji koneksi ke database menggunakan:
   ```bash
   psql -h 10.9.2.108 -U zabbix_user -d Zabbix
   ```
5. Setelah tersambung, cek ukuran database untuk menentukan kebutuhan vacuum:
   ```sql
   SELECT pg_size_pretty(pg_database_size(current_database())) AS size;
   ```
6. Simpan semua eviden precheck (screenshot, output perintah) ke folder `01_Precheck` sesuai node.

## Langkah 2 – Backup
1. Evaluasi apakah database dapat atau perlu dibackup. Jika ya, jalankan prosedur backup database sesuai SOP internal dan dokumentasikan hasilnya.
2. Backup konfigurasi Docker (berkas compose dan environment) menggunakan perintah berikut, lalu simpan arsip di folder `02_Backup`:
   ```bash
   tar -czvf zabbix_config_backup_$(date +%F).tar.gz docker-compose_v3_alpine_pgsql_latest.yaml .env*
   ```
3. Validasi arsip yang dihasilkan. Sesuaikan tanggal contoh sesuai file yang dibuat:
   ```bash
   tar -tzvf zabbix_config_backup_2025-06-19.tar.gz
   ```
4. Apabila ada image yang harus dibawa ke server DMZ, unggah file tersebut dan dokumentasikan bukti upload.

## Langkah 3 – Action
1. Jalankan pembaruan OS secara interaktif agar dapat meninjau paket yang akan diinstal:
   ```bash
   dnf update
   ```
2. Perbarui image Zabbix Web ke versi `7.0.18` lalu lakukan build ulang di direktori proyek web:
   ```bash
   docker build -t zabbix-web-nginx-pgsql:alpine-7.0.18-php8.3 .
   ```
3. Edit berkas compose agar Selenium menggunakan tag `140.0`, kemudian simpan perubahan konfigurasi.
4. Sesuaikan `docker-compose_v3_alpine_pgsql_latest.yaml` untuk mencerminkan tag baru Zabbix Server/Proxy ataupun update lain yang dibutuhkan.
5. Terapkan konfigurasi dengan menjalankan layanan secara langsung tanpa `down` terlebih dahulu:
   ```bash
   docker compose -f docker-compose_v3_alpine_pgsql_latest.yaml up -d
   ```
6. Untuk node proxy di DMZ, load image yang telah diunggah, perbarui tag pada compose, dan catat langkah-langkah yang dilakukan:
   ```bash
   docker image load -i zabbix-snmptraps-7.0.18-centos.tar.gz
   ```
   Setelah image termuat, perbarui tag pada compose sebelum menjalankan layanan.
7. Simpan screenshot rencana aksi, perubahan konfigurasi, dan catatan penting lainnya ke folder `03_Action`.

## Langkah 4 – Postcheck
1. Segera setelah layanan naik, periksa log container utama guna memastikan tidak ada error:
   ```bash
   docker-compose logs --tail=100 zabbix-server
   docker-compose logs --tail=100 zabbix-web-nginx
   docker-compose logs --tail=100 selenium-chrome
   ```
2. Validasi dashboard monitoring dan ambil screenshot kondisi terbaru.
3. Pastikan versi Zabbix sudah `7.0.18` dan Selenium `140.0`, serta catat hasil pemeriksaan tersebut.
4. Tentukan apakah vacuum database diperlukan berdasarkan ukuran yang tercatat pada tahap precheck. Jika dijalankan, dokumentasikan perintah dan hasilnya.
5. Periksa pemakaian resource (CPU, RAM, disk) untuk memastikan sistem stabil pasca-update, kemudian simpan output perintah berikut sebagai eviden:
   ```bash
   top -bn1 | head -n20
   free -h
   df -h
   ```
   Tindak lanjuti jika terlihat lonjakan pemakaian abnormal.
6. Simpan semua bukti postcheck ke folder `04_Postcheck`.

## Langkah 5 – Issue & Dokumentasi
1. Jika ditemukan kendala atau error, tulis deskripsi singkat, langkah mitigasi, dan status penyelesaiannya.
2. Tambahkan nomor tiket atau referensi eskalasi apabila melibatkan pihak lain.
3. Pindahkan seluruh screenshot (pre/post, log, dashboard) serta output perintah ke struktur folder yang telah ditentukan.
4. Susun ringkasan temuan dan rekomendasi tindak lanjut, misalnya kebutuhan patch tambahan atau jadwal vacuum berkala.

## Penutup
Finalisasi pekerjaan dengan memastikan seluruh catatan dan eviden telah tersimpan rapi di repositori dokumentasi. Lakukan review bersama tim operasional untuk memastikan tidak ada langkah terlewat, kemudian jadwalkan preventive maintenance berikutnya sambil memperbarui panduan ini bila ada pembelajaran baru.
