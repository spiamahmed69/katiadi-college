import { NextResponse } from 'next/server'; import { cookies } from 'next/headers';
import { verifySession, STUDENT_COOKIE, getStudentById } from '@/lib/auth';
import { getAll } from '@/lib/store';
export const dynamic = 'force-dynamic';
export async function GET() {
  const studentId = verifySession(cookies().get(STUDENT_COOKIE)?.value);
  if (!studentId) return NextResponse.json({ error: 'Unauthorized — please log in as a student' }, { status: 401 });
  const profile = await getStudentById(studentId);
  if (!profile) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  const sid = profile.student_id.toUpperCase();
  const [students, notices, routines, results, documents] = await Promise.all([
    getAll('students'), getAll('notices'), getAll('routines'), getAll('results'), getAll('documents'),
  ]);
  const student = students.find((s: any) => String(s.student_id || '').toUpperCase() === sid) || null;
  return NextResponse.json({
    profile: { id: profile.id, name: profile.name, email: profile.email, student_id: profile.student_id, role: profile.role },
    student,
    notices: notices.slice(0, 10),
    classRoutine: routines.filter((r: any) => r.type === 'class'),
    examRoutine: routines.filter((r: any) => r.type === 'exam'),
    results: results.filter((r: any) => String(r.student_id || '').toUpperCase() === sid),
    documents,
  });
}
