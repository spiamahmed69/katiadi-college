import { NextResponse } from 'next/server'; import { dbStatus, storageStatus, getAll, RESOURCES } from '@/lib/store'; import { adminConfigured } from '@/lib/auth';
export const dynamic = 'force-dynamic';
// Probes a real resource first so dbStatus() reflects a real DB check.
export async function GET() {
  const counts: Record<string, number> = {};
  for (const r of RESOURCES) { try { counts[r] = (await getAll(r)).length; } catch { counts[r] = -1; } }
  return NextResponse.json({ college: 'Katiadi Government College', eiin: '110434', database: dbStatus(), storage: storageStatus(), adminConfigured: adminConfigured(), counts, time: new Date().toISOString() });
}
