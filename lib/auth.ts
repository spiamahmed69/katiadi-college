import crypto from 'crypto'; import bcrypt from 'bcryptjs';
import { getPool } from './db';
const ADMIN_COOKIE_NAME = 'katiadi_admin';
const STUDENT_COOKIE_NAME = 'katiadi_student';
function secret() { return process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'katiadi-dev-secret'; }
export function signSession(value: string): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(`${value}.${exp}`).toString('base64url');
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('hex');
  return `${payload}.${sig}`;
}
export function verifySession(token?: string | null): string | null {
  if (!token) return null;
  const idx = token.lastIndexOf('.'); if (idx < 0) return null;
  const payload = token.slice(0, idx); const sig = token.slice(idx + 1);
  const expected = crypto.createHmac('sha256', secret()).update(payload).digest('hex');
  if (sig !== expected) return null;
  let decoded: string; try { decoded = Buffer.from(payload, 'base64url').toString('utf8'); } catch { return null; }
  const dot = decoded.lastIndexOf('.'); if (dot < 0) return null;
  const value = decoded.slice(0, dot); const exp = Number(decoded.slice(dot + 1));
  if (!value || Date.now() > exp) return null;
  return value;
}
export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL; const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !hash) return false;
  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) return false;
  try { return await bcrypt.compare(password, hash); } catch { return false; }
}
export function adminConfigured(): boolean { return !!(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH); }
/** Student login: checks the users table (DB-first); falls back to the demo
 *  account DEMO-001 / demo123 only when no DATABASE_URL is set. */
export async function verifyStudent(studentId: string, password: string): Promise<{ id: string; name: string; email: string; student_id: string } | null> {
  const sid = (studentId || '').trim().toUpperCase();
  const pool = getPool();
  if (pool) {
    try {
      const r = await pool.query('SELECT id,name,email,student_id,password_hash FROM users WHERE student_id=$1 AND role=$2', [sid, 'student']);
      const u = r.rows[0];
      if (u && u.password_hash && await bcrypt.compare(password, u.password_hash)) {
        return { id: u.id, name: u.name, email: u.email, student_id: u.student_id };
      }
      return null;
    } catch { return null; }
  }
  if (sid === 'DEMO-001' && password === 'demo123') return { id: 'u-demo', name: 'Demo Student', email: 'demo@katiadi.edu.bd', student_id: 'DEMO-001' };
  return null;
}
export async function getStudentById(studentId: string): Promise<{ id: string; name: string; email: string; student_id: string; role: string } | null> {
  const sid = (studentId || '').trim().toUpperCase();
  const pool = getPool();
  if (pool) {
    try {
      const r = await pool.query('SELECT id,name,email,student_id,role FROM users WHERE student_id=$1', [sid]);
      return r.rows[0] || null;
    } catch { return null; }
  }
  if (sid === 'DEMO-001') return { id: 'u-demo', name: 'Demo Student', email: 'demo@katiadi.edu.bd', student_id: 'DEMO-001', role: 'student' };
  return null;
}
export const ADMIN_COOKIE = ADMIN_COOKIE_NAME;
export const STUDENT_COOKIE = STUDENT_COOKIE_NAME;
