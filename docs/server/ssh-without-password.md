# Login SSH Tanpa Password

## Langkah-langkah Konfigurasi

### 1. Buat SSH Public Key di Laptop
```bash
ssh-keygen
```
Setelah menjalankan perintah tersebut, public key akan tersimpan di:
- Windows: `C:\Users\<username>\.ssh\id_rsa.pub`
- Linux/Mac: `~/.ssh/id_rsa.pub`

### 2. Lihat Isi Public Key
```bash
# Windows
cat C:\Users\<username>\.ssh\id_rsa.pub

# Linux/Mac
cat ~/.ssh/id_rsa.pub
```

### 3. Konfigurasi di Server

1. Login ke server terlebih dahulu

2. Buat folder `.ssh` jika belum ada:
```bash
mkdir -p ~/.ssh
```

3. Set permission folder `.ssh`:
```bash
chmod 700 ~/.ssh
```

4. Buat atau edit file `authorized_keys`:
```bash
nano ~/.ssh/authorized_keys
```

5. Paste public key yang sudah di-copy sebelumnya ke dalam file `authorized_keys`

6. Set permission untuk file `authorized_keys`:
```bash
chmod 600 ~/.ssh/authorized_keys
```

### 4. Verifikasi
Untuk memastikan file dan permission sudah benar, jalankan:
```bash
ls -la ~/.ssh
```

Setelah semua langkah selesai, coba login kembali ke server. Seharusnya tidak akan diminta password lagi.