-- ============================================================
-- Library Loan Management System - Supabase Schema
-- Run this SQL in Supabase SQL Editor
-- ============================================================

-- Create the loans table
CREATE TABLE IF NOT EXISTS loans (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id   VARCHAR(50)   NOT NULL,
  member_name VARCHAR(150)  NOT NULL,
  book_id     VARCHAR(50)   NOT NULL,
  book_title  VARCHAR(255)  NOT NULL,
  loan_date   DATE          NOT NULL,
  due_date    DATE          NOT NULL,
  return_date DATE,
  status      VARCHAR(20)   NOT NULL DEFAULT 'Dipinjam'
                            CHECK (status IN ('Dipinjam', 'Dikembalikan', 'Terlambat')),
  created_at  TIMESTAMPTZ   DEFAULT now(),
  updated_at  TIMESTAMPTZ   DEFAULT now()
);

-- Create index for common filter columns
CREATE INDEX IF NOT EXISTS idx_loans_status     ON loans(status);
CREATE INDEX IF NOT EXISTS idx_loans_member_id  ON loans(member_id);
CREATE INDEX IF NOT EXISTS idx_loans_book_id    ON loans(book_id);

-- Enable Row Level Security (RLS)
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Allow all operations using anon key (adjust for production as needed)
CREATE POLICY "Allow all for anon" ON loans
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ──────────────────────────────────────────────────────────────
-- OPTIONAL: Seed sample data for testing
-- ──────────────────────────────────────────────────────────────
INSERT INTO loans (member_id, member_name, book_id, book_title, loan_date, due_date, return_date, status)
VALUES
  ('M001', 'Budi Santoso',   'B001', 'Laskar Pelangi',             '2026-09-01', '2026-09-15', NULL,         'Dipinjam'),
  ('M002', 'Siti Rahayu',    'B002', 'Bumi Manusia',               '2026-09-05', '2026-09-19', '2026-09-17', 'Dikembalikan'),
  ('M003', 'Ahmad Fauzi',    'B003', 'Negeri 5 Menara',            '2026-08-20', '2026-09-03', '2026-09-10', 'Terlambat'),
  ('M001', 'Budi Santoso',   'B004', 'Sang Pemimpi',               '2026-09-20', '2026-10-04', NULL,         'Dipinjam'),
  ('M004', 'Dewi Lestari',   'B005', 'Filosofi Teras',             '2026-09-10', '2026-09-24', '2026-09-23', 'Dikembalikan');
