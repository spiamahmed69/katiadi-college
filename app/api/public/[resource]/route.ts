import { NextResponse } from 'next/server';
import { getAll, PUBLIC_RESOURCES, type Resource } from '@/lib/store';
export const dynamic = 'force-dynamic';
// GET /api/public/[resource] — public read. Supports:
//   /api/public/results?student_id=DEMO-001
//   /api/public/routines?type=class|exam&class_name=HSC%201st%20Year
export async function GET(req: Request, { params }: { params: { resource: string } }) {
  const resource = params.resource as Resource;
  if (!PUBLIC_RESOURCES.includes(resource)) return NextResponse.json({ error: 'Unknown or non-public resource' }, { status: 404 });
  const url = new URL(req.url);
  let items = await getAll(resource);
  const studentId = url.searchParams.get('student_id');
  if (studentId) items = items.filter((x: any) => String(x.student_id || '').toUpperCase() === studentId.trim().toUpperCase());
  const type = url.searchParams.get('type');
  if (type) items = items.filter((x: any) => x.type === type);
  const className = url.searchParams.get('class_name');
  if (className) items = items.filter((x: any) => x.class_name === className);
  return NextResponse.json({ resource, items });
}
