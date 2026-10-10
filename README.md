# 📚 Library Loan API

REST API untuk sistem manajemen peminjaman buku perpustakaan yang dibangun menggunakan **Node.js**, **Express.js**, dan **Supabase** sebagai database.

> **Live API:** [https://library-loan-api.vercel.app](https://library-loan-api.vercel.app) *(update link setelah deploy)*

---

## 📋 Deskripsi Umum & Tujuan Proyek

API ini dirancang untuk mengelola data peminjaman buku di perpustakaan secara digital. Sistem ini memungkinkan:

- **Anggota** dapat meminjam dan mengembalikan buku
- **Admin** dapat memantau status semua peminjaman
- **Filter otomatis** status peminjaman: `Dipinjam`, `Dikembalikan`, atau `Terlambat`
- Integrasi database berbasis cloud melalui **Supabase (PostgreSQL)**

---

## 🗃️ Struktur Data / Schema

### Tabel: `loans`

| Kolom         | Tipe           | Keterangan                                              |
|---------------|----------------|---------------------------------------------------------|
| `id`          | UUID (PK)      | ID unik peminjaman, auto-generated                      |
| `member_id`   | VARCHAR(50)    | ID anggota peminjam                                     |
| `member_name` | VARCHAR(150)   | Nama lengkap anggota                                    |
| `book_id`     | VARCHAR(50)    | ID buku yang dipinjam                                   |
| `book_title`  | VARCHAR(255)   | Judul buku                                              |
| `loan_date`   | DATE           | Tanggal pinjam (format: YYYY-MM-DD)                     |
| `due_date`    | DATE           | Tanggal jatuh tempo pengembalian                        |
| `return_date` | DATE           | Tanggal dikembalikan (null jika belum dikembalikan)     |
| `status`      | VARCHAR(20)    | Status: `Dipinjam` / `Dikembalikan` / `Terlambat`       |
| `created_at`  | TIMESTAMPTZ    | Waktu record dibuat                                     |
| `updated_at`  | TIMESTAMPTZ    | Waktu record terakhir diupdate                          |

### Status Peminjaman

```
Dipinjam      → Buku sedang dipinjam, belum dikembalikan
Dikembalikan  → Buku dikembalikan tepat waktu atau sebelum jatuh tempo
Terlambat     → Buku dikembalikan melewati tanggal jatuh tempo
```

---

## 🛣️ Endpoint API

| Method   | Endpoint            | Deskripsi                              |
|----------|---------------------|----------------------------------------|
| `GET`    | `/api/loans`        | Ambil semua data peminjaman            |
| `GET`    | `/api/loans?status=Terlambat` | Filter berdasarkan status    |
| `GET`    | `/api/loans/:id`    | Ambil detail peminjaman berdasarkan ID |
| `POST`   | `/api/loans`        | Buat data peminjaman baru              |
| `PUT`    | `/api/loans/:id`    | Update data peminjaman                 |
| `DELETE` | `/api/loans/:id`    | Hapus data peminjaman                  |

### Query Parameters untuk `GET /api/loans`

| Parameter   | Contoh                              | Keterangan                  |
|-------------|-------------------------------------|-----------------------------|
| `status`    | `?status=Terlambat`                 | Filter by status            |
| `member_id` | `?member_id=M001`                   | Filter by member ID         |
| `book_id`   | `?book_id=B003`                     | Filter by book ID           |
| Kombinasi   | `?status=Dipinjam&member_id=M001`   | Kombinasi filter            |

---

## 📨 Contoh Request & Response

### 1. GET `/api/loans` — Ambil Semua Data

**Request:**
```http
GET /api/loans
```

**Response `200 OK`:**
```json
{
  "success": true,
  "total": 2,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "member_id": "M001",
      "member_name": "Budi Santoso",
      "book_id": "B001",
      "book_title": "Laskar Pelangi",
      "loan_date": "2026-09-01",
      "due_date": "2026-09-15",
      "return_date": null,
      "status": "Dipinjam",
      "created_at": "2026-09-01T08:00:00.000Z",
      "updated_at": "2026-09-01T08:00:00.000Z"
    }
  ]
}
```

---

### 2. GET `/api/loans?status=Terlambat` — Filter by Status

**Request:**
```http
GET /api/loans?status=Terlambat
```

**Response `200 OK`:**
```json
{
  "success": true,
  "total": 1,
  "data": [
    {
      "id": "c3d4e5f6-a1b2-3456-cdef-789012345678",
      "member_id": "M003",
      "member_name": "Ahmad Fauzi",
      "book_id": "B003",
      "book_title": "Negeri 5 Menara",
      "loan_date": "2026-08-20",
      "due_date": "2026-09-03",
      "return_date": "2026-09-10",
      "status": "Terlambat",
      "created_at": "2026-08-20T07:30:00.000Z",
      "updated_at": "2026-09-10T14:00:00.000Z"
    }
  ]
}
```

---

### 3. GET `/api/loans/:id` — Ambil Detail

**Request:**
```http
GET /api/loans/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "member_id": "M001",
    "member_name": "Budi Santoso",
    "book_id": "B001",
    "book_title": "Laskar Pelangi",
    "loan_date": "2026-09-01",
    "due_date": "2026-09-15",
    "return_date": null,
    "status": "Dipinjam",
    "created_at": "2026-09-01T08:00:00.000Z",
    "updated_at": "2026-09-01T08:00:00.000Z"
  }
}
```

**Response `404 Not Found`:**
```json
{
  "success": false,
  "error": {
    "message": "Loan with id xxx not found"
  }
}
```

---

### 4. POST `/api/loans` — Buat Peminjaman Baru

**Request:**
```http
POST /api/loans
Content-Type: application/json
```

**Request Body:**
```json
{
  "member_id": "M005",
  "member_name": "Rina Wulandari",
  "book_id": "B006",
  "book_title": "Perahu Kertas",
  "loan_date": "2026-10-10",
  "due_date": "2026-10-24"
}
```

**Response `201 Created`:**
```json
{
  "success": true,
  "message": "Loan created successfully",
  "data": {
    "id": "f7e8d9c0-b1a2-3456-def0-123456789abc",
    "member_id": "M005",
    "member_name": "Rina Wulandari",
    "book_id": "B006",
    "book_title": "Perahu Kertas",
    "loan_date": "2026-10-10",
    "due_date": "2026-10-24",
    "return_date": null,
    "status": "Dipinjam",
    "created_at": "2026-10-10T10:00:00.000Z",
    "updated_at": "2026-10-10T10:00:00.000Z"
  }
}
```

**Response `400 Bad Request`** (field tidak lengkap):
```json
{
  "success": false,
  "error": {
    "message": "All fields are required: member_id, member_name, book_id, book_title, loan_date, due_date"
  }
}
```

---

### 5. PUT `/api/loans/:id` — Update Peminjaman (Pengembalian Buku)

**Request:**
```http
PUT /api/loans/a1b2c3d4-e5f6-7890-abcd-ef1234567890
Content-Type: application/json
```

**Request Body:**
```json
{
  "return_date": "2026-09-14",
  "due_date": "2026-09-15"
}
```

> Status dihitung otomatis:
> - `return_date <= due_date` → `Dikembalikan`
> - `return_date > due_date` → `Terlambat`

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Loan updated successfully",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "Dikembalikan",
    "return_date": "2026-09-14",
    "updated_at": "2026-10-10T11:00:00.000Z"
  }
}
```

---

### 6. DELETE `/api/loans/:id` — Hapus Data Peminjaman

**Request:**
```http
DELETE /api/loans/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Loan with id a1b2c3d4-e5f6-7890-abcd-ef1234567890 deleted successfully"
}
```

---

## 🏗️ Struktur Proyek

```
library-loan-api/
├── src/
│   ├── config/
│   │   └── supabase.js          # Konfigurasi Supabase client
│   ├── controllers/
│   │   └── loanController.js    # Business logic CRUD loans
│   ├── middleware/
│   │   └── errorHandler.js      # Global error & 404 handler
│   └── routes/
│       └── loanRoutes.js        # Express router untuk /api/loans
├── database/
│   └── schema.sql               # SQL schema & seed data Supabase
├── .env.example                 # Template environment variables
├── .gitignore
├── index.js                     # Entry point aplikasi
├── package.json
├── vercel.json                  # Konfigurasi deployment Vercel
└── README.md
```

---

## ⚙️ Panduan Instalasi & Menjalankan Lokal

### Prasyarat

- [Node.js](https://nodejs.org/) v18 atau lebih baru
- [npm](https://www.npmjs.com/) v9+
- Akun [Supabase](https://supabase.com/)

### Langkah 1: Clone Repository

```bash
git clone https://github.com/your-username/library-loan-api.git
cd library-loan-api
```

### Langkah 2: Install Dependencies

```bash
npm install
```

### Langkah 3: Setup Supabase

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Buat project baru
3. Buka **SQL Editor** dan jalankan isi file `database/schema.sql`
4. Salin **Project URL** dan **anon/public API Key** dari menu **Project Settings → API**

### Langkah 4: Setup Environment Variables

```bash
cp .env.example .env
```

Edit file `.env`:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
PORT=3000
NODE_ENV=development
```

### Langkah 5: Jalankan Server

```bash
# Mode development (auto-restart)
npm run dev

# Mode production
npm start
```

Server akan berjalan di: `http://localhost:3000`

---

## 🚀 Deployment ke Vercel

### Langkah 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Langkah 2: Login ke Vercel

```bash
vercel login
```

### Langkah 3: Deploy

```bash
vercel --prod
```

### Langkah 4: Set Environment Variables di Vercel

Buka **Vercel Dashboard → Project → Settings → Environment Variables** lalu tambahkan:

| Name               | Value                              |
|--------------------|------------------------------------|
| `SUPABASE_URL`     | `https://your-project-id.supabase.co` |
| `SUPABASE_ANON_KEY`| `your-supabase-anon-key-here`     |

---

## 🌐 Link Deployment

> **Base URL:** `https://library-loan-api.vercel.app`
>
> *(Update link ini setelah deploy ke Vercel)*

---

## 🧪 Testing dengan cURL

```bash
# Get all loans
curl https://library-loan-api.vercel.app/api/loans

# Filter by status
curl "https://library-loan-api.vercel.app/api/loans?status=Terlambat"

# Create new loan
curl -X POST https://library-loan-api.vercel.app/api/loans \
  -H "Content-Type: application/json" \
  -d '{"member_id":"M005","member_name":"Rina","book_id":"B006","book_title":"Perahu Kertas","loan_date":"2026-10-10","due_date":"2026-10-24"}'

# Return a book (update)
curl -X PUT https://library-loan-api.vercel.app/api/loans/{id} \
  -H "Content-Type: application/json" \
  -d '{"return_date":"2026-10-20","due_date":"2026-10-24"}'

# Delete a loan
curl -X DELETE https://library-loan-api.vercel.app/api/loans/{id}
```

---

## 📄 Lisensi

ISC License — bebas digunakan untuk keperluan pembelajaran dan pengembangan.
