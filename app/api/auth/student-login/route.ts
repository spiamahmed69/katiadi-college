import { NextResponse } from 'next/server'; import { verifyStudent, signSession, STUDENT_COOKIE } from '@/lib/auth'; import { rateLimit } from '@/lib/rate-limit';
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  if (!rateLimit('student-login:' + ip, 5)) return NextResponse.json({ error: 'Too many login attempts. Try again in a minute.' }, { status: 429 });
  const { student_id, password } = await req.json();
  if (!student_id || !password) return NextResponse.json({ error: 'Student ID and password are required' }, { status: 400 });
  const u = await verifyStudent(student_id, password);
  if (!u) return NextResponse.json({ error: 'Invalid student ID or password' }, { status: 401 });
  const res = NextResponse.json({ ok: true, student: { name: u.name, student_id: u.student_id } });
  res.cookies.set(STUDENT_COOKIE, signSession(u.student_id), { httpOnly: true, path: '/', maxAge: 7 * 24 * 3600, sameSite: 'lax' });
  return res;
}
