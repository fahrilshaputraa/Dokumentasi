# Tantangan 7 Hari Menjadi Django Developer

**Tujuan Akhir:** Dalam 7 hari, kamu akan membangun sebuah aplikasi blog yang fungsional dari nol dan mengerti cara kerja setiap bagiannya.

---

### **Hari 1: Fondasi dan Instalasi**

**Tujuan Hari Ini:** Menyiapkan lingkungan kerja dan menjalankan proyek Django untuk pertama kalinya.
**Fokus:** Konfigurasi, bukan koding.

*   **Tugas:**
    1.  **Persiapan Lingkungan:** Buat folder proyek, lalu buat dan aktifkan *virtual environment* (`venv`) di dalamnya.
    2.  **Instalasi:** Install Django menggunakan `pip`.
    3.  **Buat Proyek:** Gunakan `django-admin startproject` untuk membuat kerangka proyek.
    4.  **Jalankan Server:** Gunakan `python manage.py runserver` dan pastikan kamu melihat halaman selamat datang Django.
*   **Target Selesai:** Kamu melihat halaman roket Django di `http://127.0.0.1:8000`.
*   **Untuk Dipelajari Malam Ini:** Baca sekilas tentang arsitektur MVT (Model-View-Template) yang menjadi dasar Django.

---

### **Hari 2: Merancang Database (Models)**

**Tujuan Hari Ini:** Mendefinisikan struktur data blog kita.
**Fokus:** `models.py` dan migrasi.

*   **Tugas:**
    1.  **Buat Aplikasi:** Gunakan `python manage.py startapp blog` untuk membuat komponen blog.
    2.  **Daftarkan Aplikasi:** Tambahkan `'blog'` ke `INSTALLED_APPS` di file `settings.py`.
    3.  **Definisikan Model:** Buka `blog/models.py` dan buat sebuah class `Post` dengan field untuk `title` (judul), `content` (isi), dan `created_at` (waktu dibuat).
    4.  **Lakukan Migrasi:** Jalankan `makemigrations` dan `migrate` untuk membuat tabel `Post` di database.
*   **Target Selesai:** Perintah migrasi berjalan sukses tanpa error.
*   **Untuk Dipelajari Malam Ini:** Lihat berbagai tipe field yang tersedia di Django Models selain yang sudah kamu pakai.

---

### **Hari 3: Menguasai Panel Admin**

**Tujuan Hari Ini:** Belajar menggunakan fitur admin Django yang sangat powerful untuk mengelola data.
**Fokus:** `admin.py` dan manajemen data.

*   **Tugas:**
    1.  **Buat Superuser:** Buat akun admin dengan `python manage.py createsuperuser`.
    2.  **Daftarkan Model:** Di `blog/admin.py`, daftarkan model `Post` agar muncul di halaman admin.
    3.  **Eksplorasi Admin:** Jalankan server, buka `/admin`, login, dan buat 2-3 postingan blog melalui antarmuka admin.
*   **Target Selesai:** Kamu bisa membuat, melihat, dan mengedit postingan dari halaman admin.
*   **Untuk Dipelajari Malam Ini:** Coba kustomisasi admin. Gunakan `@admin.register(Post)` dan `list_display` untuk mengubah kolom yang tampil di daftar post.

---

### **Hari 4: Menampilkan Data ke Publik (Views & Templates)**

**Tujuan Hari Ini:** Menampilkan data dari database ke halaman web yang bisa dilihat semua orang.
**Fokus:** `views.py`, `urls.py`, dan file HTML.

*   **Tugas:**
    1.  **Buat View:** Di `blog/views.py`, buat sebuah fungsi yang mengambil semua data `Post` dari database.
    2.  **Buat Template:** Buat struktur folder template (`blog/templates/blog/`) dan file HTML untuk menampilkan daftar post. Gunakan DTL (`{% for post in posts %}`) untuk menampilkan semua post.
    3.  **Atur URL:** Buat `blog/urls.py` dan hubungkan ke `urls.py` utama proyekmu. Arahkan URL utama (`/`) ke view yang baru kamu buat.
*   **Target Selesai:** Saat membuka halaman utama website, daftar postingan yang kamu buat kemarin muncul.

---

### **Hari 5: Membuat Halaman Detail**

**Tujuan Hari Ini:** Membuat setiap post memiliki halaman khususnya sendiri.
**Fokus:** URL Dinamis dan mengambil objek tunggal.

*   **Tugas:**
    1.  **Buat View Detail:** Buat view baru yang menerima sebuah ID (`pk`) sebagai parameter dan mengambil satu objek `Post` saja. Gunakan `get_object_or_404`.
    2.  **Buat Template Detail:** Buat file HTML baru untuk menampilkan satu post secara lengkap.
    3.  **Atur URL Dinamis:** Tambahkan path URL baru seperti `post/<int:pk>/` ke `blog/urls.py`.
    4.  **Hubungkan Link:** Di template daftar post, ubah setiap judul menjadi link yang mengarah ke halaman detailnya masing-masing.
*   **Target Selesai:** Bisa mengklik judul post di halaman utama dan dibawa ke halaman khusus untuk post tersebut.

---

### **Hari 6: Form dan Interaksi Pengguna**

**Tujuan Hari Ini:** Membiarkan pengguna membuat post langsung dari website.
**Fokus:** `django.forms` dan menangani request `POST`.

*   **Tugas:**
    1.  **Buat Form:** Buat file `blog/forms.py` dan definisikan sebuah `ModelForm` untuk model `Post`.
    2.  **Buat View untuk Form:** Buat view baru yang bisa menampilkan form (saat request `GET`) dan menyimpan data form (saat request `POST`).
    3.  **Buat Template Form:** Buat file HTML yang berisi tag `<form>`, `{% csrf_token %}`, dan menampilkan field-field dari form-mu.
    4.  **Atur URL:** Tambahkan path untuk halaman "tambah post baru".
*   **Target Selesai:** Kamu bisa membuka halaman `/tambah`, mengisi form, dan setelah submit, post baru tersebut muncul di halaman utama.

---

### **Hari 7: Mempercantik Tampilan & Refleksi**

**Tujuan Hari Ini:** Memberi sentuhan akhir dan mereview apa yang telah dipelajari.
**Fokus:** `static files` dan pemahaman konsep.

*   **Tugas:**
    1.  **Styling:** Buat folder `static`, tambahkan file `style.css`, dan hubungkan ke template-mu untuk memberi gaya pada blog (ubah font, warna, layout).
    2.  **Refleksi:** Buka kembali semua file yang sudah kamu edit (`models`, `views`, `urls`, `templates`, `admin`, `forms`). Coba jelaskan kembali alur kerja Django dengan bahasamu sendiri: dari browser meminta URL, hingga halaman web ditampilkan.
*   **Target Selesai:** Blogmu punya tampilan yang lebih baik dan kamu percaya diri menjelaskan cara kerjanya.
