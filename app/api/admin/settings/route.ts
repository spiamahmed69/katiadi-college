import { NextResponse } from 'next/server'; import { cookies } from 'next/headers';
import { verifySession, ADMIN_COOKIE } from '@/lib/auth';
import { getSettings, updateSettings } from '@/lib/store';
function authed() { return !!verifySession(cookies().get(ADMIN_COOKIE)?.value); }
export async function GET() { if (!authed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); return NextResponse.json({ settings: await getSettings() }); }
export async function POST(req: Request) {
  if (!authed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const patch = await req.json().catch(() => ({}));
  try { await updateSettings(patch); return NextResponse.json({ ok: true, settings: await getSettings() }); }
  catch (e: any) { return NextResponse.json({ ok: false, error: e?.message || 'Settings save failed' }, { status: 500 }); }
}
