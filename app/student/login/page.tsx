'use client';
import { useState } from 'react'; import { useRouter } from 'next/navigation';
export default function StudentLogin() {
  const [studentId, setStudentId] = useState(''); const [password, setPassword] = useState(''); const [msg, setMsg] = useState('');
  const router = useRouter();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('লগইন হচ্ছে…');
    const r = await fetch('/api/auth/student-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ student_id: studentId, password }) });
    const j = await r.json();
    if (!r.ok) { setMsg('⚠️ ' + (j.error || 'লগইন ব্যর্থ')); return; }
    router.push('/student/dashboard'); router.refresh();
  };
  return (<div className="max-w-md mx-auto px-4 py-16 fade-up"><div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h1 className="text-2xl font-black">শিক্ষার্থী লগইন <span className="text-base font-normal text-gray-500">Student Login</span></h1>
    <p className="text-sm text-gray-500 mt-1">শিক্ষার্থী আইডি ও পাসওয়ার্ড দিয়ে প্রবেশ করুন।</p>
    <form onSubmit={submit} className="space-y-4 mt-5">
      <input required value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="শিক্ষার্থী আইডি (যেমন DEMO-001)" className="w-full border rounded p-3 dark:bg-gray-700" />
      <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="পাসওয়ার্ড" className="w-full border rounded p-3 dark:bg-gray-700" />
      <button className="w-full bg-brand text-white py-3 rounded font-bold">লগইন</button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
    <p className="text-xs text-gray-500 mt-4">ডেমো অ্যাকাউন্ট: Student ID <b>DEMO-001</b> / Password <b>demo123</b> (নমুনা শিক্ষার্থী)।</p>
  </div></div>);
}
