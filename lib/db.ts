// PostgreSQL layer (optional). When DATABASE_URL is not set, returns null and
// callers fall back to the JSON seed — never pretend the DB is connected.
import { Pool } from 'pg';
let pool: Pool | null = null;
export function dbConfigured(): boolean { return !!process.env.DATABASE_URL; }
export function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    const url = process.env.DATABASE_URL;
    const needsSsl = /sslmode=require|neon\.tech|pooler/i.test(url);
    pool = new Pool({ connectionString: url, max: 5, connectionTimeoutMillis: 10000, ssl: needsSsl ? { rejectUnauthorized: false } : undefined });
  }
  return pool;
}
export async function dbPing(): Promise<{ ok: boolean; error?: string }> {
  const p = getPool(); if (!p) return { ok: false, error: 'DATABASE_URL is not set' };
  try { await p.query('SELECT 1'); return { ok: true }; } catch (e: any) { return { ok: false, error: e?.message || 'DB connection failed' }; }
}
export const DB_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS notices (id TEXT PRIMARY KEY, title TEXT, title_bn TEXT, body TEXT, body_bn TEXT, date TEXT, category TEXT, is_sample BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS news_events (id TEXT PRIMARY KEY, title TEXT, title_bn TEXT, slug TEXT UNIQUE, excerpt TEXT, content TEXT, image TEXT, date TEXT, category TEXT, is_sample BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS teachers (id TEXT PRIMARY KEY, name TEXT, name_bn TEXT, designation TEXT, department TEXT, email TEXT, phone TEXT, photo TEXT, bio TEXT, is_sample BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS departments (id TEXT PRIMARY KEY, name TEXT, name_bn TEXT, slug TEXT UNIQUE, description TEXT, head TEXT, is_sample BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS programs (id TEXT PRIMARY KEY, name TEXT, name_bn TEXT, level TEXT, duration TEXT, department TEXT, description TEXT, is_sample BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS students (id TEXT PRIMARY KEY, student_id TEXT UNIQUE, name TEXT, name_bn TEXT, class_name TEXT, section TEXT, roll TEXT, department TEXT, session_year TEXT, email TEXT, phone TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS admissions (id TEXT PRIMARY KEY, applicant_name TEXT, email TEXT, phone TEXT, program TEXT, class_name TEXT, ssc_roll TEXT, ssc_gpa TEXT, status TEXT DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS routines (id TEXT PRIMARY KEY, title TEXT, class_name TEXT, type TEXT, day TEXT, subject TEXT, time TEXT, room TEXT, teacher TEXT, is_sample BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS results (id TEXT PRIMARY KEY, student_id TEXT, exam_name TEXT, subject TEXT, grade TEXT, gpa TEXT, year TEXT, published BOOLEAN DEFAULT TRUE, is_sample BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS gallery (id TEXT PRIMARY KEY, title TEXT, title_bn TEXT, image TEXT, category TEXT, is_sample BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, title TEXT, file_url TEXT, category TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value JSONB);
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE, role TEXT, student_id TEXT UNIQUE, password_hash TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS contacts (id TEXT PRIMARY KEY, name TEXT, email TEXT, subject TEXT, message TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), read BOOLEAN DEFAULT FALSE);
`;
