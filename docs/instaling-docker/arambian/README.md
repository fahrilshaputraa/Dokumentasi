# Instalasi Docker di Armbian

Panduan ini menjelaskan langkah-langkah instalasi Docker pada sistem Armbian dan mengonfigurasi penyimpanan data Docker ke storage tambahan (misal: SD card di `/sd`).

## 1. Persiapan Sistem

- Pastikan sistem menggunakan Armbian dan terhubung ke internet.
- Update dan upgrade paket sistem:

```bash
sudo apt update && sudo apt upgrade -y
```

## 2. Install Dependensi Docker

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
```

## 3. Tambahkan GPG Key Docker

```bash
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo tee /usr/share/keyrings/docker-archive-keyring.gpg > /dev/null
```

## 4. Tambahkan Docker Repository

```bash
echo "deb [arch=arm64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian bullseye stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

## 5. Update Paket dan Install Docker

```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io -y
```

## 6. Periksa Status Docker

```bash
sudo systemctl status docker
```

## 7. Konfigurasi Storage untuk Docker

1. **Stop Docker:**
    ```bash
    sudo systemctl stop docker
    ```
2. **Buat Direktori Baru untuk Data Docker:**
    ```bash
    sudo mkdir -p /sd/docker
    ```
3. **Pindahkan Data Docker:**
    ```bash
    sudo rsync -aP /var/lib/docker/ /sd/docker/
    ```
4. **Ganti Lokasi Penyimpanan Docker (symbolic link):**
    ```bash
    sudo mv /var/lib/docker /var/lib/docker.bak
    sudo ln -s /sd/docker /var/lib/docker
    ```

## 8. Mulai Docker

```bash
sudo systemctl start docker
```

## 9. Verifikasi Penggunaan Disk

```bash
df -h
```

## 10. Pengujian Docker

```bash
sudo docker run hello-world
```

## 11. Periksa Status Docker Setelah Pengujian

```bash
sudo systemctl status docker
```

---

Dengan mengikuti langkah-langkah di atas, Docker berhasil terinstal dan data Docker disimpan di storage tambahan (misal: SD card di `/sd`).