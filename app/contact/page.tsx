'use client';
import { useState } from 'react';
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [msg, setMsg] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('পাঠানো হচ্ছে…');
    const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const j = await r.json();
    if (!r.ok) { setMsg('⚠️ ' + (j.error || 'বার্তা পাঠানো যায়নি')); return; }
    setMsg('✅ বার্তা পাঠানো হয়েছে। কলেজ অফিস শীঘ্রই যোগাযোগ করবে।');
    setForm({ name: '', email: '', subject: '', message: '' });
  };
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const input = 'w-full border rounded p-3 dark:bg-gray-700 dark:border-gray-600';
  return (<div className="max-w-2xl mx-auto px-4 py-12 fade-up">
    <h1 className="text-3xl font-black">যোগাযোগ <span className="text-lg font-normal text-gray-500">Contact Us</span></h1>
    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow p-5">
      <p>📍 কটিয়াদী, কিশোরগঞ্জ, বাংলাদেশ</p>
      <p>EIIN: 110434</p>
      <p>✉️ info@katiadi-college.edu.bd <span className="text-xs text-yellow-600">(placeholder — to be confirmed)</span></p>
      <p>📞 +880-1XXX-XXXXXX <span className="text-xs text-yellow-600">(placeholder — to be confirmed)</span></p>
    </div>
    <form onSubmit={submit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4 mt-6">
      <input required placeholder="আপনার নাম / Name" className={input} value={form.name} onChange={e => set('name', e.target.value)} />
      <input required type="email" placeholder="ইমেইল / Email" className={input} value={form.email} onChange={e => set('email', e.target.value)} />
      <input placeholder="বিষয় / Subject" className={input} value={form.subject} onChange={e => set('subject', e.target.value)} />
      <textarea required rows={5} placeholder="বার্তা / Message" className={input} value={form.message} onChange={e => set('message', e.target.value)} />
      <button className="w-full bg-brand text-white py-3 rounded font-bold">বার্তা পাঠান</button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  </div>);
}
