## Cara Menambahkan SSH Public Key ke Server

1. **Generate SSH Public Key di Laptop**
    Jalankan perintah berikut di laptop yang ingin digunakan untuk login ke server:
    ```
    ssh-keygen
    ```
    Ikuti instruksi hingga selesai.

2. **Salin Public Key**
    Tampilkan isi public key dengan perintah:
    ```
    cat C:\Users\fahri\.ssh\id_rsa.pub
    ```
    Salin seluruh isi file tersebut.

3. **Login ke Server**
    Masuk ke server menggunakan SSH.

4. **Buat Folder `.ssh` (Jika Belum Ada)**
    ```
    mkdir -p ~/.ssh
    ```
    Atur permission folder agar lebih aman:
    ```
    chmod 700 ~/.ssh
    ```

5. **Tambahkan Public Key ke `authorized_keys`**
    Buka file `authorized_keys` (akan dibuat otomatis jika belum ada):
    ```
    nano ~/.ssh/authorized_keys
    ```
    Paste public key yang sudah disalin ke dalam file tersebut, lalu simpan.

6. **Set Permission untuk File `authorized_keys`**
    ```
    chmod 600 ~/.ssh/authorized_keys
    ```

7. **Verifikasi**
    Cek kembali isi dan permission folder `.ssh`:
    ```
    ls -la ~/.ssh
    ```
    Pastikan file dan permission sudah benar.

Setelah semua langkah di atas selesai, coba login kembali ke server menggunakan SSH.