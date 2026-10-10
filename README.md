# ResponsiMod1MayoPD

REST API untuk manajemen peminjaman buku perpustakaan, dibangun menggunakan Node.js, Express.js, dan Supabase.

Live API: https://responsi-mod1-mayo.vercel.app/

---

## Deskripsi Umum & Tujuan Proyek

API ini dibuat untuk mengelola data peminjaman buku di perpustakaan secara digital. Fitur yang tersedia:

- Anggota dapat meminjam dan mengembalikan buku.
- Admin dapat memantau status semua peminjaman.
- Filter berdasarkan status peminjaman: Dipinjam, Dikembalikan, atau Terlambat.
- Database berbasis cloud menggunakan Supabase (PostgreSQL).

---

## Struktur Data / Schema

### Tabel: loans

| Kolom       | Tipe        | Keterangan                                          |
|-------------|-------------|-----------------------------------------------------|
| id          | UUID (PK)   | ID unik peminjaman, auto-generated                  |
| member_id   | VARCHAR(50) | ID anggota peminjam                                 |
| member_name | VARCHAR(150)| Nama lengkap anggota                                |
| book_id     | VARCHAR(50) | ID buku yang dipinjam                               |
| book_title  | VARCHAR(255)| Judul buku                                          |
| loan_date   | DATE        | Tanggal pinjam (format: YYYY-MM-DD)                 |
| due_date    | DATE        | Tanggal jatuh tempo pengembalian                    |
| return_date | DATE        | Tanggal dikembalikan (null jika belum dikembalikan) |
| status      | VARCHAR(20) | Status: Dipinjam / Dikembalikan / Terlambat         |
| created_at  | TIMESTAMPTZ | Waktu record dibuat                                 |
| updated_at  | TIMESTAMPTZ | Waktu record terakhir diupdate                      |

### Status Peminjaman

- Dipinjam: buku sedang dipinjam, belum dikembalikan
- Dikembalikan: buku dikembalikan tepat waktu atau sebelum jatuh tempo
- Terlambat: buku dikembalikan melewati tanggal jatuh tempo

---

## Endpoint API

| Method | Endpoint       | Deskripsi                              |
|--------|----------------|----------------------------------------|
| GET    | /api/loans     | Ambil semua data peminjaman            |
| GET    | /api/loans/:id | Ambil detail peminjaman berdasarkan ID |
| POST   | /api/loans     | Buat data peminjaman baru              |
| PUT    | /api/loans/:id | Update data peminjaman                 |
| DELETE | /api/loans/:id | Hapus data peminjaman                  |

### Filter Query pada GET /api/loans

| Parameter | Contoh                           | Keterangan           |
|-----------|----------------------------------|----------------------|
| status    | ?status=Terlambat                | Filter by status     |
| member_id | ?member_id=M001                  | Filter by member ID  |
| book_id   | ?book_id=B003                    | Filter by book ID    |

---

## Contoh Request & Response

### GET /api/loans

Request:
```
GET /api/loans
```

Response:
```json
{
  "success": true,
  "total": 1,
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

### GET /api/loans?status=Terlambat

Request:
```
GET /api/loans?status=Terlambat
```

Response:
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

### GET /api/loans/:id

Request:
```
GET /api/loans/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

Response (200):
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

Response (404):
```json
{
  "success": false,
  "error": {
    "message": "Loan with id xxx not found"
  }
}
```

### POST /api/loans

Request:
```
POST /api/loans
Content-Type: application/json
```

Body:
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

Response (201):
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

Response (400 - field tidak lengkap):
```json
{
  "success": false,
  "error": {
    "message": "All fields are required: member_id, member_name, book_id, book_title, loan_date, due_date"
  }
}
```

### PUT /api/loans/:id

Request:
```
PUT /api/loans/a1b2c3d4-e5f6-7890-abcd-ef1234567890
Content-Type: application/json
```

Body:
```json
{
  "return_date": "2026-09-14",
  "due_date": "2026-09-15"
}
```

Status dihitung otomatis: jika return_date sebelum atau sama dengan due_date maka statusnya Dikembalikan, jika sesudah maka Terlambat.

Response (200):
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

### DELETE /api/loans/:id

Request:
```
DELETE /api/loans/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

Response (200):
```json
{
  "success": true,
  "message": "Loan with id a1b2c3d4-e5f6-7890-abcd-ef1234567890 deleted successfully"
}
```

---

## Struktur Proyek

```
library-loan-api/
├── src/
│   ├── config/
│   │   └── supabase.js
│   ├── controllers/
│   │   └── loanController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   └── routes/
│       └── loanRoutes.js
├── database/
│   └── schema.sql
├── .env.example
├── .gitignore
├── index.js
├── package.json
├── vercel.json
└── README.md
```

---

## Instalasi & Menjalankan Lokal

Prasyarat: Node.js v18+, npm, akun Supabase.

1. Clone repository

```
git clone https://github.com/your-username/library-loan-api.git
cd library-loan-api
```

2. Install dependencies

```
npm install
```

3. Setup Supabase

Buka Supabase Dashboard, buat project baru, lalu jalankan isi file `database/schema.sql` di SQL Editor. Salin Project URL dan anon key dari Project Settings > API.

4. Buat file .env

Salin dari .env.example lalu isi nilainya:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
PORT=3000
NODE_ENV=development
```

5. Jalankan server

```
npm run dev
```

Server berjalan di http://localhost:3000

---

## Deployment ke Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables di Vercel Dashboard > Project > Settings > Environment Variables: `SUPABASE_URL` dan `SUPABASE_ANON_KEY`

---

## Link Deployment

https://responsi-mod1-mayo-pd-rrk4.vercel.app

---

## Lisensi

ISC
