import { getSettings, getAll } from '@/lib/store';
export const dynamic = 'force-dynamic';
export default async function About() {
  const s = await getSettings(); const depts = await getAll('departments'); const programs = await getAll('programs');
  return (<div className="max-w-4xl mx-auto px-4 py-12 fade-up">
    <h1 className="text-3xl font-black">কলেজ সম্পর্কে <span className="text-lg font-normal text-gray-500">About College</span></h1>
    <p className="mt-4 text-lg leading-relaxed">{s.siteNameBn} ({s.siteName}) — কটিয়াদী, কিশোরগঞ্জ, বাংলাদেশে অবস্থিত একটি সরকারি কলেজ। EIIN: <b>{s.eiin}</b>।</p>
    <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300">This page contains only verified facts: the college name, EIIN {s.eiin}, and location (Katiadi, Kishoreganj, Bangladesh). All other details on this website are clearly labelled SAMPLE / PLACEHOLDER until the college office confirms them.</p>
    <div className="grid sm:grid-cols-3 gap-4 mt-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5"><div className="font-bold">EIIN</div><div className="text-2xl font-black text-brand mt-1">{s.eiin}</div></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5"><div className="font-bold">অবস্থান / Location</div><div className="mt-1">কটিয়াদী, কিশোরগঞ্জ, বাংলাদেশ</div></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5"><div className="font-bold">প্রতিষ্ঠা / Established</div><div className="mt-1">To be confirmed — placeholder</div></div>
    </div>
    <h2 className="text-2xl font-bold mt-10">বিভাগসমূহ ({depts.length})</h2>
    <ul className="mt-3 list-disc pl-6 space-y-1">{depts.map((d: any) => <li key={d.id}>{d.name_bn} ({d.name})</li>)}</ul>
    <h2 className="text-2xl font-bold mt-8">একাডেমিক প্রোগ্রাম ({programs.length})</h2>
    <ul className="mt-3 list-disc pl-6 space-y-1">{programs.map((p: any) => <li key={p.id}>{p.name_bn} — {p.name} ({p.level}, {p.duration})</li>)}</ul>
    <p className="text-sm text-gray-500 mt-8">⚠️ Department and program lists are placeholders — to be confirmed by the college office.</p>
  </div>);
}
