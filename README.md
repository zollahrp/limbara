# 🍃 Limbara Frontend

Repositori ini memuat kode antarmuka (Frontend) untuk aplikasi **Limbara**, sebuah platform pintar berbasis web untuk deteksi dan pengelolaan sampah. Aplikasi ini dibangun menggunakan **Next.js** dan dioptimalkan untuk performa tinggi serta antarmuka yang responsif.

> **⚠️ INFORMASI PENTING: ARSITEKTUR TERPISAH** > Repositori ini **hanya** berisi kode untuk sisi *Client/Frontend*. Sisi *Backend* (API FastAPI) dan pemrosesan Machine Learning (YOLOv8) berjalan di server yang sepenuhnya berbeda. Agar aplikasi ini berfungsi penuh, kamu harus menghubungkannya ke URL Backend yang valid.

Repository Backend: https://github.com/Rivalfitrah/limbara_backend
---

## 🚀 Teknologi yang Digunakan

* **Framework:** Next.js (React)
* **Styling:** Tailwind CSS *(Sesuaikan jika kamu pakai yang lain)*
* **HTTP Client:** Fetch API / Axios

---

## ⚙️ Persyaratan Sistem

Sebelum memulai, pastikan kamu sudah menginstal perangkat lunak berikut di komputermu:
* [Node.js](https://nodejs.org/) (Versi 18.x atau terbaru)
* Package Manager (NPM, Yarn, pnpm, atau bun)

---

## 🛠️ Tahapan Instalasi & Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk menjalankan aplikasi Limbara Frontend di komputermu (Local Development):

### 1. Kloning Repositori
Buka terminal dan jalankan perintah ini untuk mengunduh kode dari GitHub:
```bash
git clone https://github.com/zollahrp/limbara.git
```

```bash
cd limbara
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Pengaturan Environment Variables (.env)
```bash
NEXT_PUBLIC_API_BASE_URL=https://limbara.rivalfitrah.my.id
```

### 4. Jalankan Server Development

```bash
npm run dev
```
