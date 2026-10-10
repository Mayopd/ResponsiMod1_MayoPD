# 📚 Library Loan API

REST API untuk sistem manajemen peminjaman buku perpustakaan yang dibangun menggunakan **Node.js**, **Express.js**, dan **Supabase** sebagai database.

> **Live API:** [https://responsi-mod1-mayo-pd-rrk4.vercel.app](https://responsi-mod1-mayo-pd-rrk4.vercel.app)

---

## 📋 Deskripsi Umum & Tujuan Proyek

API ini dirancang untuk mengelola data peminjaman buku di perpustakaan secara digital. Sistem ini memungkinkan:

- **Anggota** dapat meminjam dan mengembalikan buku.
- **Admin** dapat memantau status semua peminjaman.
- **Filter otomatis** status peminjaman: `Dipinjam`, `Dikembalikan`, atau `Terlambat`.
- Integrasi database berbasis cloud melalui **Supabase (PostgreSQL)**.

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

```text
Dipinjam      → Buku sedang dipinjam, belum dikembalikan
Dikembalikan  → Buku dikembalikan tepat waktu atau sebelum jatuh tempo
Terlambat     → Buku dikembalikan melewati tanggal jatuh tempo