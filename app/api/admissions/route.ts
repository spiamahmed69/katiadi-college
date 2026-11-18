import { NextResponse } from 'next/server'; import { upsertGeneric } from '@/lib/store'; import { rateLimit } from '@/lib/rate-limit';
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  if (!rateLimit('admissions:' + ip, 10)) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  if (!b.applicant_name || !b.phone || !b.program) return NextResponse.json({ error: 'Applicant name, phone and program are required' }, { status: 400 });
  try {
    const app = await upsertGeneric('admissions', { id: 'ad' + Date.now().toString(36), applicant_name: b.applicant_name, email: b.email || '', phone: b.phone, program: b.program, class_name: b.class_name || '', ssc_roll: b.ssc_roll || '', ssc_gpa: b.ssc_gpa || '', status: 'pending' });
    return NextResponse.json({ ok: true, application: app });
  } catch (e: any) { return NextResponse.json({ ok: false, error: e?.message || 'Application was NOT saved' }, { status: 500 }); }
}
