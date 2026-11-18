'use client';
import { useState } from 'react';
export default function Admission() {
  const [form, setForm] = useState({ applicant_name: '', email: '', phone: '', program: 'HSC Science', class_name: 'HSC 1st Year', ssc_roll: '', ssc_gpa: '' });
  const [msg, setMsg] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('জমা দেওয়া হচ্ছে…');
    const r = await fetch('/api/admissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const j = await r.json();
    if (!r.ok) { setMsg('⚠️ ' + (j.error || 'আবেদন জমা হয়নি')); return; }
    setMsg('✅ আবেদন জমা হয়েছে! আবেদন আইডি: ' + j.application.id + ' (অবস্থা: pending — কলেজ অফিস যাচাই করবে)');
  };
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const input = 'w-full border rounded p-3 dark:bg-gray-700 dark:border-gray-600';
  return (<div className="max-w-2xl mx-auto px-4 py-12 fade-up">
    <h1 className="text-3xl font-black">ভর্তি <span className="text-lg font-normal text-gray-500">Admission</span></h1>
    <p className="mt-3 text-gray-600 dark:text-gray-300">ভর্তির আবেদন ফরম। ⚠️ ভর্তির তারিখ, ফি ও শর্তাবলি এখনো নিশ্চিত করা হয়নি — সেগুলো placeholder হিসেবে বিবেচনা করুন এবং কলেজ অফিস থেকে যাচাই করুন। আবেদন জমা হলে তা ডাটাবেজে সংরক্ষিত হয় এবং অ্যাডমিন ড্যাশবোর্ডে দেখা যায়।</p>
    <form onSubmit={submit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4 mt-6">
      <input required placeholder="আবেদনকারীর নাম / Applicant name" className={input} value={form.applicant_name} onChange={e => set('applicant_name', e.target.value)} />
      <input placeholder="ইমেইল / Email" type="email" className={input} value={form.email} onChange={e => set('email', e.target.value)} />
      <input required placeholder="মোবাইল / Phone" className={input} value={form.phone} onChange={e => set('phone', e.target.value)} />
      <select className={input} value={form.program} onChange={e => set('program', e.target.value)}>
        <option>HSC Science</option><option>HSC Humanities</option><option>HSC Business Studies</option><option>Degree / Honours (placeholder)</option>
      </select>
      <input placeholder="শ্রেণি / Class (যেমন HSC 1st Year)" className={input} value={form.class_name} onChange={e => set('class_name', e.target.value)} />
      <input placeholder="এসএসসি রোল / SSC Roll" className={input} value={form.ssc_roll} onChange={e => set('ssc_roll', e.target.value)} />
      <input placeholder="এসএসসি জিপিএ / SSC GPA" className={input} value={form.ssc_gpa} onChange={e => set('ssc_gpa', e.target.value)} />
      <button className="w-full bg-brand text-white py-3 rounded font-bold">আবেদন জমা দিন</button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  </div>);
}
