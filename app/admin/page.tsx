'use client';
import { useEffect, useState } from 'react';
// Field configs per resource: [key, label, type]
const FIELDS: Record<string, [string, string, string?][]> = {
  notices: [['title', 'Title (English)'], ['title_bn', 'শিরোনাম (বাংলা)'], ['body', 'Body', 'textarea'], ['date', 'Date (YYYY-MM-DD)'], ['category', 'Category']],
  news_events: [['title', 'Title (English)'], ['title_bn', 'শিরোনাম (বাংলা)'], ['slug', 'Slug'], ['excerpt', 'Excerpt', 'textarea'], ['content', 'Content', 'textarea'], ['image', 'Image URL'], ['date', 'Date (YYYY-MM-DD)'], ['category', 'Category (News/Event)']],
  teachers: [['name', 'Name'], ['name_bn', 'নাম (বাংলা)'], ['designation', 'Designation'], ['department', 'Department'], ['email', 'Email'], ['phone', 'Phone'], ['photo', 'Photo URL'], ['bio', 'Bio', 'textarea']],
  departments: [['name', 'Name'], ['name_bn', 'নাম (বাংলা)'], ['slug', 'Slug'], ['description', 'Description', 'textarea'], ['head', 'Department Head']],
  programs: [['name', 'Name'], ['name_bn', 'নাম (বাংলা)'], ['level', 'Level (HSC/Degree)'], ['duration', 'Duration'], ['department', 'Department'], ['description', 'Description', 'textarea']],
  students: [['student_id', 'Student ID'], ['name', 'Name'], ['name_bn', 'নাম (বাংলা)'], ['class_name', 'Class'], ['section', 'Section'], ['roll', 'Roll'], ['department', 'Department'], ['session_year', 'Session'], ['email', 'Email'], ['phone', 'Phone']],
  admissions: [['applicant_name', 'Applicant Name'], ['email', 'Email'], ['phone', 'Phone'], ['program', 'Program'], ['class_name', 'Class'], ['ssc_roll', 'SSC Roll'], ['ssc_gpa', 'SSC GPA'], ['status', 'Status (pending/approved/rejected)']],
  routines: [['title', 'Title'], ['class_name', 'Class'], ['type', 'Type (class/exam)'], ['day', 'Day'], ['subject', 'Subject'], ['time', 'Time'], ['room', 'Room'], ['teacher', 'Teacher']],
  results: [['student_id', 'Student ID'], ['exam_name', 'Exam Name'], ['subject', 'Subject'], ['grade', 'Grade'], ['gpa', 'GPA'], ['year', 'Year']],
  gallery: [['title', 'Title'], ['title_bn', 'শিরোনাম (বাংলা)'], ['image', 'Image URL'], ['category', 'Category']],
  documents: [['title', 'Title'], ['file_url', 'File URL'], ['category', 'Category']],
  users: [['name', 'Name'], ['email', 'Email'], ['role', 'Role (student/admin)'], ['student_id', 'Student ID (for students)'], ['password', 'New Password (leave blank to keep)']],
  contacts: [['name', 'Name'], ['email', 'Email'], ['subject', 'Subject'], ['message', 'Message', 'textarea']],
};
const TABS = ['notices', 'news_events', 'teachers', 'departments', 'programs', 'students', 'admissions', 'routines', 'results', 'gallery', 'documents', 'settings', 'users', 'contacts', 'database'];
const LABELS: Record<string, string> = {
  notices: 'Notices', news_events: 'News & Events', teachers: 'Teachers', departments: 'Departments',
  programs: 'Programs', students: 'Students', admissions: 'Admissions', routines: 'Routines',
  results: 'Results', gallery: 'Gallery', documents: 'Documents', settings: 'Settings',
  users: 'Users', contacts: 'Messages', database: 'Database',
};
const emptyForm = (tab: string) => { const o: Record<string, string> = {}; (FIELDS[tab] || []).forEach(([k]) => { o[k] = ''; }); return o; };
export default function AdminDashboard() {
  const [tab, setTab] = useState('notices');
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [msg, setMsg] = useState(''); const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const isSettings = tab === 'settings'; const isDatabase = tab === 'database';
  const load = async (t = tab) => {
    setLoading(true); setMsg('');
    try {
      if (t === 'settings') { const r = await fetch('/api/admin/settings'); const j = await r.json(); if (!r.ok) throw new Error(j.error || 'Failed'); setSettings(j.settings || {}); setForm(j.settings || {}); }
      else if (t === 'database') { const r = await fetch('/api/status'); setStatus(await r.json()); }
      else { const r = await fetch('/api/admin/' + t); const j = await r.json(); if (!r.ok) throw new Error(j.error || 'Failed to load'); setItems(j.items || []); }
    } catch (e: any) { setMsg('⚠️ ' + (e?.message || 'Load failed')); }
    setLoading(false);
  };
  useEffect(() => { setItems([]); setEditing(null); setForm(isSettings || isDatabase ? {} : emptyForm(tab)); load(tab); }, [tab]);
  const startNew = () => { setEditing(null); setForm(emptyForm(tab)); };
  const startEdit = (it: any) => { setEditing(it.id); const o: Record<string, string> = {}; (FIELDS[tab] || []).forEach(([k]) => { o[k] = it[k] ?? ''; }); setForm(o); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('সংরক্ষণ হচ্ছে…');
    try {
      if (isSettings) {
        const r = await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        const j = await r.json(); if (!r.ok) throw new Error(j.error || 'Save failed'); setMsg('✅ Settings saved.'); return;
      }
      const body = { ...form }; if (editing) body.id = editing;
      const r = await fetch('/api/admin/' + tab, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error || 'Save failed — NOT saved');
      setMsg('✅ Saved.'); startNew(); load(tab);
    } catch (e: any) { setMsg('⚠️ ' + (e?.message || 'Save failed — NOT saved')); }
  };
  const del = async (id: string) => {
    if (!confirm('মুছে ফেলবেন? Delete this item?')) return;
    const r = await fetch('/api/admin/' + tab + '?id=' + encodeURIComponent(id), { method: 'DELETE' });
    const j = await r.json(); if (!r.ok) { setMsg('⚠️ ' + (j.error || 'Delete failed')); return; }
    setMsg('✅ Deleted.'); load(tab);
  };
  const migrate = async () => {
    setMsg('Migrating…');
    const r = await fetch('/api/admin/migrate', { method: 'POST' }); const j = await r.json();
    if (!r.ok) { setMsg('⚠️ Migration failed: ' + (j.error || '')); return; }
    setMsg('✅ Migration done. Seeded: ' + JSON.stringify(j.seeded) + ' Counts: ' + JSON.stringify(j.counts));
    load('database');
  };
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inputCls = 'w-full border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600';
  return (<div>
    <div className="flex flex-wrap gap-2">{TABS.map(t => (
      <button key={t} onClick={() => setTab(t)} className={'px-3 py-2 rounded text-sm font-bold ' + (tab === t ? 'bg-brand text-white' : 'bg-white dark:bg-gray-800 border dark:border-gray-700')}>{LABELS[t]}</button>))}
    </div>
    {msg && <p className="mt-4 text-sm bg-white dark:bg-gray-800 border rounded p-3">{msg}</p>}
    {isDatabase ? (
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold">Database &amp; API Status</h2>
        <pre className="mt-3 text-xs bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto">{status ? JSON.stringify(status, null, 2) : 'Loading…'}</pre>
        <button onClick={migrate} className="mt-4 bg-brand text-white px-5 py-2 rounded font-bold">Run Migration / Seed (POST /api/admin/migrate)</button>
        <p className="text-sm text-gray-500 mt-3">Migration creates all tables and seeds placeholder data ONLY when the tables are empty. It never overwrites existing data. Requires DATABASE_URL.</p>
      </div>
    ) : isSettings ? (
      <form onSubmit={save} className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-bold">Website Settings</h2>
        {[['siteName', 'Site Name (English)'], ['siteNameBn', 'সাইটের নাম (বাংলা)'], ['tagline', 'Tagline'], ['description', 'Description', 'textarea'], ['contactEmail', 'Contact Email'], ['contactPhone', 'Contact Phone'], ['address', 'Address'], ['eiin', 'EIIN'], ['established', 'Established'], ['principalName', 'Principal Name']].map(([k, label, type]) => (
          <label key={k} className="block"><span className="text-sm font-bold">{label}</span>
            {type === 'textarea'
              ? <textarea rows={3} className={inputCls} value={settings[k] ?? form[k] ?? ''} onChange={e => { set(k, e.target.value); setSettings(s => ({ ...s, [k]: e.target.value })); }} />
              : <input className={inputCls} value={settings[k] ?? form[k] ?? ''} onChange={e => { set(k, e.target.value); setSettings(s => ({ ...s, [k]: e.target.value })); }} />}
          </label>))}
        <button className="bg-brand text-white px-6 py-2 rounded font-bold">Save Settings</button>
      </form>
    ) : (<div className="mt-6 grid lg:grid-cols-5 gap-6">
      <form onSubmit={save} className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-5 space-y-3 h-fit">
        <h2 className="text-lg font-bold">{editing ? 'Edit' : 'Add New'} — {LABELS[tab]}</h2>
        {(FIELDS[tab] || []).map(([k, label, type]) => (
          <label key={k} className="block"><span className="text-sm font-bold">{label}</span>
            {type === 'textarea'
              ? <textarea rows={3} className={inputCls} value={form[k] || ''} onChange={e => set(k, e.target.value)} />
              : <input className={inputCls} value={form[k] || ''} onChange={e => set(k, e.target.value)} />}
          </label>))}
        <div className="flex gap-2"><button className="bg-brand text-white px-5 py-2 rounded font-bold">{editing ? 'Update' : 'Create'}</button>
        {editing && <button type="button" onClick={startNew} className="border px-4 py-2 rounded font-bold">Cancel</button>}</div>
      </form>
      <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow p-5">
        <h2 className="text-lg font-bold">{LABELS[tab]} ({items.length}) {loading && '— loading…'}</h2>
        <ul className="mt-3 space-y-2">{items.map((it: any) => (
          <li key={it.id} className="border dark:border-gray-700 rounded p-3 flex flex-wrap justify-between gap-2 items-center">
            <div className="text-sm"><b>{it.title || it.name || it.applicant_name || it.id}</b>
              <span className="text-gray-500"> — {it.title_bn || it.name_bn || it.student_id || it.email || it.subject || it.class_name || ''}</span>
              {it.is_sample && <span className="ml-2 bg-yellow-100 text-yellow-800 text-[11px] font-bold px-2 py-0.5 rounded">SAMPLE</span>}
              <span className="block text-xs text-gray-400">{it.id} • {it.date || it.createdAt || ''}</span></div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(it)} className="bg-brand text-white px-3 py-1 rounded text-sm font-bold">Edit</button>
              <button onClick={() => del(it.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">Delete</button>
            </div>
          </li>))}
        {items.length === 0 && !loading && <p className="text-gray-500 text-sm mt-2">No items yet — the database table is empty (real empty state, not a demo).</p>}</ul>
      </div>
    </div>)}
  </div>);
}
