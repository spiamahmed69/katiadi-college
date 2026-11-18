import { NextResponse } from 'next/server'; import { cookies } from 'next/headers'; import bcrypt from 'bcryptjs';
import { verifySession, ADMIN_COOKIE } from '@/lib/auth';
import { getAll, upsertGeneric, deleteGeneric, RESOURCES, REQUIRED, type Resource } from '@/lib/store';
function authed() { return !!verifySession(cookies().get(ADMIN_COOKIE)?.value); }
function isResource(r: string): r is Resource { return (RESOURCES as readonly string[]).includes(r); }
export async function GET(_req: Request, { params }: { params: { resource: string } }) {
  if (!authed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isResource(params.resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });
  const items = await getAll(params.resource);
  return NextResponse.json({ resource: params.resource, items });
}
export async function POST(req: Request, { params }: { params: { resource: string } }) {
  if (!authed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isResource(params.resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });
  const resource = params.resource;
  const body = await req.json().catch(() => ({}));
  const required = REQUIRED[resource] || [];
  for (const f of required) {
    if (f === 'password') continue;
    if (!body.id && (body[f] === undefined || body[f] === '')) return NextResponse.json({ error: `Field "${f}" is required` }, { status: 400 });
  }
  try {
    const row: Record<string, any> = { ...body };
    if (!row.id) row.id = resource.slice(0, 2) + '-' + Date.now().toString(36);
    if (resource === 'news_events' && !row.slug && row.title) row.slug = row.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || row.id;
    if (resource === 'departments' && !row.slug && row.name) row.slug = row.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') || row.id;
    if (resource === 'users') {
      if (row.password) { row.password_hash = await bcrypt.hash(String(row.password), 10); }
      delete row.password;
      if (!row.role) row.role = 'student';
    }
    if (resource === 'students' && row.student_id) row.student_id = String(row.student_id).toUpperCase();
    if (resource === 'results' && row.student_id) row.student_id = String(row.student_id).toUpperCase();
    const saved = await upsertGeneric(resource, row);
    return NextResponse.json({ ok: true, item: saved });
  } catch (e: any) { return NextResponse.json({ ok: false, error: e?.message || 'Save failed — NOT saved' }, { status: 500 }); }
}
export async function DELETE(req: Request, { params }: { params: { resource: string } }) {
  if (!authed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isResource(params.resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id query param is required' }, { status: 400 });
  try { await deleteGeneric(params.resource, id); return NextResponse.json({ ok: true }); }
  catch (e: any) { return NextResponse.json({ ok: false, error: e?.message || 'Delete failed' }, { status: 500 }); }
}
