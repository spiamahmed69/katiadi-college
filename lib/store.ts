// Katiadi Government College data store.
//
// SOURCE OF TRUTH RULE:
// - When DATABASE_URL is set AND the Postgres tables exist, Postgres is the
//   source of truth: reads come from Postgres, writes go to Postgres first.
//   Writes await the DB and THROW on failure — API routes return 500, never
//   a fake ok:true.
// - When DATABASE_URL is NOT set, the app runs on the JSON seed
//   (data/seed.json, local dev only). Writes update the in-memory copy and
//   persist back to seed.json (works locally; on Vercel the filesystem is
//   read-only/ephemeral, so set DATABASE_URL there).
// - When DATABASE_URL IS set but tables do not exist yet, reads fall back to
//   the seed and dbStatus() says so; run POST /api/admin/migrate.
// - When DATABASE_URL IS set and tables exist but are EMPTY, reads return []
//   — the DB is the source of truth; never silently fall back to the seed.
import fs from 'fs'; import path from 'path'; import bcrypt from 'bcryptjs';
import seed from '../data/seed.json';
import type { SeedData, SiteSettings, ContactMessage, Row } from './types';
import { getPool, dbPing, DB_SCHEMA_SQL } from './db';

const seedPath = path.join(process.cwd(), 'data', 'seed.json');
let data: SeedData = JSON.parse(JSON.stringify(seed)) as SeedData;
let dbChecked = false; let dbAvailable = false; let dbTablesMissing = false;
let dbCheckPromise: Promise<boolean> | null = null;

export const RESOURCES = ['notices', 'news_events', 'teachers', 'departments', 'programs', 'students', 'admissions', 'routines', 'results', 'gallery', 'documents', 'users', 'contacts'] as const;
export type Resource = typeof RESOURCES[number];
export const PUBLIC_RESOURCES: Resource[] = ['notices', 'news_events', 'teachers', 'departments', 'programs', 'routines', 'results', 'gallery', 'documents'];
export const REQUIRED: Record<string, string[]> = {
  notices: ['title'], news_events: ['title'], teachers: ['name'], departments: ['name'],
  programs: ['name'], students: ['name', 'student_id'], admissions: ['applicant_name', 'phone', 'program'],
  routines: ['title'], results: ['student_id', 'exam_name'], gallery: ['title'],
  documents: ['title'], users: ['name'], contacts: ['name', 'email', 'message'],
};
// Columns per table (excluding created_at which has a default). `key` for settings is handled separately.
export const COLUMNS: Record<string, string[]> = {
  notices: ['id', 'title', 'title_bn', 'body', 'body_bn', 'date', 'category', 'is_sample'],
  news_events: ['id', 'title', 'title_bn', 'slug', 'excerpt', 'content', 'image', 'date', 'category', 'is_sample'],
  teachers: ['id', 'name', 'name_bn', 'designation', 'department', 'email', 'phone', 'photo', 'bio', 'is_sample'],
  departments: ['id', 'name', 'name_bn', 'slug', 'description', 'head', 'is_sample'],
  programs: ['id', 'name', 'name_bn', 'level', 'duration', 'department', 'description', 'is_sample'],
  students: ['id', 'student_id', 'name', 'name_bn', 'class_name', 'section', 'roll', 'department', 'session_year', 'email', 'phone'],
  admissions: ['id', 'applicant_name', 'email', 'phone', 'program', 'class_name', 'ssc_roll', 'ssc_gpa', 'status'],
  routines: ['id', 'title', 'class_name', 'type', 'day', 'subject', 'time', 'room', 'teacher', 'is_sample'],
  results: ['id', 'student_id', 'exam_name', 'subject', 'grade', 'gpa', 'year', 'published', 'is_sample'],
  gallery: ['id', 'title', 'title_bn', 'image', 'category', 'is_sample'],
  documents: ['id', 'title', 'file_url', 'category'],
  users: ['id', 'name', 'email', 'role', 'student_id', 'password_hash'],
  contacts: ['id', 'name', 'email', 'subject', 'message', 'read'],
};
const ORDER_BY: Record<string, string> = {
  notices: 'date DESC, created_at DESC', news_events: 'date DESC, created_at DESC',
  routines: 'created_at', results: 'created_at', contacts: 'created_at DESC',
  admissions: 'created_at DESC', students: 'student_id', teachers: 'name',
  departments: 'name', programs: 'name', gallery: 'created_at', documents: 'created_at', users: 'created_at',
};

export function dbStatus(): { configured: boolean; connected: boolean; mode: string } {
  const configured = !!process.env.DATABASE_URL;
  const mode = !configured ? 'JSON seed fallback (no DATABASE_URL)'
    : dbTablesMissing ? 'PostgreSQL (tables missing — run POST /api/admin/migrate)'
    : dbAvailable ? 'PostgreSQL' : 'PostgreSQL (unreachable — using JSON fallback)';
  return { configured, connected: configured && dbAvailable && !dbTablesMissing, mode };
}
export function storageStatus(): { blob: boolean; mode: string } {
  const blob = !!process.env.BLOB_READ_WRITE_TOKEN;
  return { blob, mode: blob ? 'Vercel Blob' : 'Local public/uploads' };
}
async function checkDb(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  if (dbChecked) return dbAvailable;
  if (dbCheckPromise) return dbCheckPromise;
  dbCheckPromise = (async () => {
    const ping = await dbPing();
    dbAvailable = ping.ok; dbChecked = true;
    if (!ping.ok) dbTablesMissing = false;
    return dbAvailable;
  })();
  return dbCheckPromise;
}
function isMissingTable(e: any): boolean { return e?.code === '42P01' || /does not exist/i.test(e?.message || ''); }
function markMissingTable() { dbTablesMissing = true; dbAvailable = false; }
const iso = (v: any): string => (v instanceof Date ? v.toISOString() : v);
function cleanRow(r: any): Row {
  const out: Row = {};
  for (const [k, v] of Object.entries(r)) {
    if (k === 'created_at' || k === 'createdAt') continue;
    if (k === 'password_hash') continue; // never expose hashes via generic reads
    out[k] = iso(v);
  }
  if (r.created_at) out.createdAt = iso(r.created_at);
  return out;
}
function seedRows(resource: Resource): Row[] {
  const rows = (data as any)[resource] as Row[] | undefined;
  return rows ? JSON.parse(JSON.stringify(rows)) : [];
}
function sortSeed(resource: Resource, rows: Row[]): Row[] {
  const key = resource === 'notices' || resource === 'news_events' ? 'date' : 'createdAt';
  return [...rows].sort((a, b) => String(b[key] || '').localeCompare(String(a[key] || '')));
}

async function dbQueryRows(resource: Resource, where = '', params: any[] = []): Promise<Row[] | null> {
  const pool = getPool(); if (!pool) return null;
  if (!(await checkDb())) return null;
  try {
    const order = ORDER_BY[resource] || 'created_at DESC';
    const r = await pool.query(`SELECT * FROM ${resource} ${where} ORDER BY ${order}`, params);
    dbAvailable = true; dbTablesMissing = false;
    return r.rows.map(cleanRow);
  } catch (e) {
    if (isMissingTable(e)) markMissingTable(); else dbAvailable = false;
    return null;
  }
}
async function dbExec(sql: string, params: any[]): Promise<void> {
  const pool = getPool(); if (!pool) throw new Error('DATABASE_URL is not set — cannot write to Postgres');
  if (!(await checkDb())) throw new Error('Database is unreachable — write was NOT saved. Check DATABASE_URL and run POST /api/admin/migrate.');
  try { await pool.query(sql, params); dbAvailable = true; }
  catch (e: any) {
    if (isMissingTable(e)) { markMissingTable(); throw new Error('Database tables do not exist yet — run POST /api/admin/migrate first. Write was NOT saved.'); }
    throw new Error('Database write failed: ' + (e?.message || 'unknown error') + ' — write was NOT saved.');
  }
}

// --- Migration + seeding (admin only, via /api/admin/migrate) ---
export async function migrateDb(): Promise<{ created: boolean; seeded: Record<string, number>; counts: Record<string, number> }> {
  const pool = getPool(); if (!pool) throw new Error('DATABASE_URL is not set — cannot migrate. Set DATABASE_URL in Vercel first.');
  const ping = await dbPing();
  if (!ping.ok) throw new Error('Database is unreachable — ' + (ping.error || 'check DATABASE_URL.'));
  await pool.query(DB_SCHEMA_SQL);
  dbTablesMissing = false; dbAvailable = true;
  const count = async (t: string) => Number((await pool.query(`SELECT COUNT(*) FROM ${t}`)).rows[0].count);
  const seeded: Record<string, number> = {};
  const beforeNotices = await count('notices');
  // Seed ONLY when the notices table is empty — idempotent, never overwrites real data.
  if (beforeNotices === 0) {
    for (const resource of RESOURCES) {
      const cols = COLUMNS[resource];
      for (const row of seedRows(resource)) {
        if (resource === 'users') {
          // Demo student gets a bcrypt hash of 'demo123' at migrate time.
          const hash = row.student_id === 'DEMO-001' ? await bcrypt.hash('demo123', 10) : (row as any).password_hash || null;
          const vals = cols.map(c => (c === 'password_hash' ? hash : (row as any)[c] ?? null));
          await pool.query(`INSERT INTO users (${cols.join(',')}) VALUES (${cols.map((_, i) => '$' + (i + 1)).join(',')}) ON CONFLICT (id) DO NOTHING`, vals);
        } else {
          const vals = cols.map(c => (row as any)[c] ?? null);
          await pool.query(`INSERT INTO ${resource} (${cols.join(',')}) VALUES (${cols.map((_, i) => '$' + (i + 1)).join(',')}) ON CONFLICT (id) DO NOTHING`, vals);
        }
      }
      seeded[resource] = seedRows(resource).length;
    }
    await pool.query('INSERT INTO settings (key,value) VALUES ($1,$2) ON CONFLICT (key) DO NOTHING', ['site', JSON.stringify(data.settings)]);
  }
  const counts: Record<string, number> = {};
  for (const resource of RESOURCES) counts[resource] = await count(resource);
  return { created: true, seeded, counts };
}

function persist() { try { fs.writeFileSync(seedPath, JSON.stringify(data, null, 2)); } catch {} }

// --- Async (DB-first) reads ---
export async function getAll(resource: Resource): Promise<Row[]> {
  const db = await dbQueryRows(resource);
  if (db !== null) return db; // DB is source of truth — even when empty
  return sortSeed(resource, seedRows(resource));
}
export async function getById(resource: Resource, id: string): Promise<Row | undefined> {
  const pool = getPool();
  if (pool && await checkDb()) {
    try {
      const r = await pool.query(`SELECT * FROM ${resource} WHERE id=$1`, [id]);
      if (r.rows[0]) return cleanRow(r.rows[0]);
      return undefined;
    } catch (e) { if (isMissingTable(e)) markMissingTable(); }
  }
  return seedRows(resource).find(x => x.id === id);
}
export async function getBySlug(resource: Resource, slug: string): Promise<Row | undefined> {
  const d = decodeSlug(slug);
  return (await getAll(resource)).find(x => x.slug === d);
}
export async function getSettings(): Promise<SiteSettings> {
  const pool = getPool();
  if (pool && await checkDb()) {
    try { const r = await pool.query("SELECT value FROM settings WHERE key='site'"); if (r.rows[0]) return { ...data.settings, ...(r.rows[0].value as SiteSettings) }; } catch { /* fall through */ }
  }
  return data.settings;
}
export function getSettingsSync(): SiteSettings { return data.settings; }
export async function getContactMessages(): Promise<ContactMessage[]> {
  return (await getAll('contacts')).map(m => ({ id: m.id, name: m.name, email: m.email, subject: m.subject || '', message: m.message, createdAt: m.createdAt || m.created_at || new Date().toISOString(), read: !!m.read }));
}

// --- Async (DB-first) writes — throw on DB failure; never fake success ---
function sanitize(resource: Resource, row: Row): Row {
  const cols = COLUMNS[resource];
  const out: Row = {};
  for (const c of cols) if (row[c] !== undefined) out[c] = row[c];
  if (!out.id) out.id = resource.slice(0, 2) + Date.now();
  return out;
}
export async function upsertGeneric(resource: Resource, row: Row): Promise<Row> {
  const clean = sanitize(resource, row);
  if (getPool()) {
    const cols = Object.keys(clean);
    const vals = cols.map(c => clean[c]);
    const sets = cols.filter(c => c !== 'id').map(c => `${c}=EXCLUDED.${c}`).join(', ');
    const sql = sets
      ? `INSERT INTO ${resource} (${cols.join(',')}) VALUES (${cols.map((_, i) => '$' + (i + 1)).join(',')}) ON CONFLICT (id) DO UPDATE SET ${sets}`
      : `INSERT INTO ${resource} (${cols.join(',')}) VALUES (${cols.map((_, i) => '$' + (i + 1)).join(',')}) ON CONFLICT (id) DO NOTHING`;
    await dbExec(sql, vals);
  }
  const arr = (data as any)[resource] as Row[];
  const i = arr.findIndex(x => x.id === clean.id);
  const stored = { ...clean, createdAt: arr[i]?.createdAt || new Date().toISOString() };
  if (i >= 0) arr[i] = stored; else arr.push(stored);
  persist(); return stored;
}
export async function deleteGeneric(resource: Resource, id: string): Promise<void> {
  if (getPool()) await dbExec(`DELETE FROM ${resource} WHERE id=$1`, [id]);
  const arr = (data as any)[resource] as Row[];
  (data as any)[resource] = arr.filter(x => x.id !== id); persist();
}
export async function addContactMessage(m: ContactMessage): Promise<ContactMessage> {
  const row = await upsertGeneric('contacts', { id: m.id, name: m.name, email: m.email, subject: m.subject || '', message: m.message, read: !!m.read });
  return { id: row.id, name: row.name, email: row.email, subject: row.subject || '', message: row.message, createdAt: row.createdAt || new Date().toISOString(), read: !!row.read };
}
export async function updateSettings(patch: Partial<SiteSettings>): Promise<void> {
  data.settings = { ...data.settings, ...patch };
  if (getPool()) await dbExec('INSERT INTO settings (key,value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value', ['site', JSON.stringify(data.settings)]);
  persist();
}
export function decodeSlug(s: string): string { try { return decodeURIComponent(s); } catch { return s; } }
export function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/^-+|-+$/g, '') || ('item-' + Date.now()); }
