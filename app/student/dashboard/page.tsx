'use client';
import { useEffect, useState } from 'react'; import { useRouter } from 'next/navigation';
export default function StudentDashboard() {
  const [data, setData] = useState<any>(null); const [err, setErr] = useState('');
  const router = useRouter();
  useEffect(() => {
    fetch('/api/student/me').then(async r => {
      const j = await r.json();
      if (!r.ok) { setErr(j.error || 'লোড করা যায়নি'); return; }
      setData(j);
    }).catch(e => setErr(String(e)));
  }, []);
  const logout = async () => { await fetch('/api/auth/student-logout', { method: 'POST' }); router.push('/student/login'); router.refresh(); };
  if (err) return <div className="max-w-2xl mx-auto px-4 py-16"><p className="text-red-600">⚠️ {err}</p><button onClick={() => router.push('/student/login')} className="mt-4 bg-brand text-white px-5 py-2 rounded font-bold">লগইন পেজে যান</button></div>;
  if (!data) return <div className="max-w-2xl mx-auto px-4 py-16">লোড হচ্ছে…</div>;
  const p = data.profile || {}; const s = data.student || {};
  return (<div className="max-w-7xl mx-auto px-4 py-10 fade-up">
    <div className="flex flex-wrap justify-between items-center gap-3">
      <h1 className="text-3xl font-black">শিক্ষার্থী ড্যাশবোর্ড <span className="text-lg font-normal text-gray-500">Student Dashboard</span></h1>
      <button onClick={logout} className="bg-gray-800 text-white px-4 py-2 rounded font-bold text-sm">লগআউট</button>
    </div>
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold">প্রোফাইল / Profile</h2>
      <div className="grid sm:grid-cols-2 gap-2 mt-3 text-sm">
        <p>নাম: <b>{p.name}</b></p><p>Student ID: <b>{p.student_id}</b></p>
        <p>ইমেইল: <b>{p.email || '—'}</b></p><p>শ্রেণি: <b>{s.class_name || '—'}</b></p>
        <p>বিভাগ: <b>{s.department || '—'}</b></p><p>সেকশন / রোল: <b>{s.section || '—'} / {s.roll || '—'}</b></p>
        <p>সেশন: <b>{s.session_year || '—'}</b></p>
      </div>
      {s.student_id === 'DEMO-001' && <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-3">⚠️ Demo student profile — sample data only.</p>}
    </div>
    <div className="grid lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 className="text-xl font-bold">নোটিশ / Notices</h2>
        <ul className="mt-3 space-y-2 text-sm">{(data.notices || []).map((n: any) => <li key={n.id} className="border-b dark:border-gray-700 pb-2"><b>{n.title_bn || n.title}</b> <span className="text-gray-500">— {n.date}</span>{n.is_sample && <span className="ml-2 bg-yellow-100 text-yellow-800 text-[11px] font-bold px-2 py-0.5 rounded">SAMPLE</span>}</li>)}
        {(!data.notices || data.notices.length === 0) && <p className="text-gray-500 text-sm mt-2">কোনো নোটিশ নেই।</p>}</ul></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 className="text-xl font-bold">ফলাফল / Results</h2>
        {(data.results || []).length === 0 ? <p className="text-gray-500 text-sm mt-3">কোনো ফলাফল নেই।</p> : (
        <table className="w-full text-sm mt-3"><thead><tr className="text-left text-gray-500"><th className="py-1">পরীক্ষা</th><th>বিষয়</th><th>গ্রেড</th><th>জিপিএ</th></tr></thead>
        <tbody>{data.results.map((r: any) => <tr key={r.id} className="border-t dark:border-gray-700"><td className="py-2 font-bold">{r.exam_name}</td><td>{r.subject}</td><td>{r.grade}</td><td>{r.gpa}</td></tr>)}</tbody></table>)}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 className="text-xl font-bold">ক্লাস রুটিন / Class Routine</h2>
        <ul className="mt-3 space-y-2 text-sm">{(data.classRoutine || []).map((r: any) => <li key={r.id} className="border-b dark:border-gray-700 pb-2"><b>{r.day}</b> {r.time} — {r.subject} ({r.class_name}, {r.room})</li>)}
        {(!data.classRoutine || data.classRoutine.length === 0) && <p className="text-gray-500 text-sm mt-2">কোনো ক্লাস রুটিন নেই।</p>}</ul></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 className="text-xl font-bold">পরীক্ষার রুটিন / Exam Routine</h2>
        <ul className="mt-3 space-y-2 text-sm">{(data.examRoutine || []).map((r: any) => <li key={r.id} className="border-b dark:border-gray-700 pb-2"><b>{r.day}</b> {r.time} — {r.subject} ({r.title})</li>)}
        {(!data.examRoutine || data.examRoutine.length === 0) && <p className="text-gray-500 text-sm mt-2">কোনো পরীক্ষার রুটিন নেই।</p>}</ul></div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6"><h2 className="text-xl font-bold">ডকুমেন্ট / Documents</h2>
      <ul className="mt-3 space-y-2 text-sm">{(data.documents || []).map((d: any) => <li key={d.id}><a className="text-brand font-bold hover:underline" href={d.file_url} target="_blank" rel="noreferrer">{d.title}</a> <span className="text-gray-500">— {d.category}</span></li>)}
      {(!data.documents || data.documents.length === 0) && <p className="text-gray-500 text-sm mt-2">কোনো ডকুমেন্ট নেই।</p>}</ul></div>
  </div>);
}
