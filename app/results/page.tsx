'use client';
import { useState } from 'react';
export default function Results() {
  const [sid, setSid] = useState('DEMO-001');
  const [rows, setRows] = useState<any[] | null>(null);
  const [msg, setMsg] = useState('');
  const search = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('খোঁজা হচ্ছে…'); setRows(null);
    const r = await fetch('/api/public/results?student_id=' + encodeURIComponent(sid.trim()));
    const j = await r.json();
    if (!r.ok) { setMsg('⚠️ ' + (j.error || 'খোঁজা যায়নি')); return; }
    setRows(j.items || []); setMsg(j.items?.length ? '' : 'এই শিক্ষার্থী আইডির কোনো ফলাফল পাওয়া যায়নি।');
  };
  return (<div className="max-w-4xl mx-auto px-4 py-12 fade-up">
    <h1 className="text-3xl font-black">ফলাফল <span className="text-lg font-normal text-gray-500">Results</span></h1>
    <p className="mt-3 text-gray-600 dark:text-gray-300">শিক্ষার্থী আইডি দিয়ে ফলাফল খুঁজুন। ডেমো: <b>DEMO-001</b> (নমুনা ফলাফল)। ⚠️ Real results must be published by the college office; sample rows are labelled SAMPLE.</p>
    <form onSubmit={search} className="mt-6 flex gap-2">
      <input required value={sid} onChange={e => setSid(e.target.value)} placeholder="Student ID (যেমন DEMO-001)" className="flex-1 border rounded p-3 dark:bg-gray-700 dark:border-gray-600" />
      <button className="bg-brand text-white px-6 rounded font-bold">খুঁজুন</button>
    </form>
    {msg && <p className="text-sm mt-4">{msg}</p>}
    {rows && rows.length > 0 && (
    <div className="overflow-x-auto mt-6"><table className="w-full text-sm bg-white dark:bg-gray-800 rounded-lg shadow">
      <thead><tr className="bg-brand text-white text-left"><th className="p-3">পরীক্ষা</th><th className="p-3">বিষয়</th><th className="p-3">গ্রেড</th><th className="p-3">জিপিএ</th><th className="p-3">বছর</th><th className="p-3"></th></tr></thead>
      <tbody>{rows.map((r: any) => <tr key={r.id} className="border-t dark:border-gray-700"><td className="p-3 font-bold">{r.exam_name}</td><td className="p-3">{r.subject}</td><td className="p-3">{r.grade}</td><td className="p-3">{r.gpa}</td><td className="p-3">{r.year}</td><td className="p-3">{r.is_sample && <span className="bg-yellow-100 text-yellow-800 text-[11px] font-bold px-2 py-0.5 rounded">SAMPLE</span>}</td></tr>)}</tbody>
    </table></div>)}
  </div>);
}
