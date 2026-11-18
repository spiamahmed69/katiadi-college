import { NextResponse } from 'next/server'; import { cookies } from 'next/headers'; import { verifySession, ADMIN_COOKIE } from '@/lib/auth';
import { migrateDb, dbStatus } from '@/lib/store';
function authed() { return !!verifySession(cookies().get(ADMIN_COOKIE)?.value); }
export async function GET() { if (!authed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); return NextResponse.json({ database: dbStatus(), usage: 'POST to this endpoint (admin cookie required) to create tables and seed only when tables are empty.' }); }
export async function POST() { if (!authed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { const r = await migrateDb(); return NextResponse.json({ ok: true, ...r, database: dbStatus() }); }
  catch (e: any) { return NextResponse.json({ ok: false, error: e?.message || 'Migration failed' }, { status: 500 }); } }
