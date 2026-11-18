import Link from 'next/link';
import { getAll } from '@/lib/store';
export const dynamic = 'force-dynamic';
export default async function Departments() {
  const depts = await getAll('departments');
  return (<div className="max-w-7xl mx-auto px-4 py-12 fade-up">
    <h1 className="text-3xl font-black">বিভাগসমূহ <span className="text-lg font-normal text-gray-500">Departments</span></h1>
    <p className="mt-3 text-gray-600 dark:text-gray-300">⚠️ Department list is a placeholder — to be confirmed by the college office.</p>
    <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{depts.map((d: any) => (
      <div key={d.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="font-bold text-xl text-brand">{d.name_bn}</div>
        <div className="text-gray-500">{d.name}</div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">{d.description}</p>
        <p className="text-sm mt-3">বিভাগীয় প্রধান: <b>{d.head || 'To be confirmed'}</b></p>
        {d.is_sample && <span className="inline-block mt-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-[11px] font-bold px-2 py-0.5 rounded">PLACEHOLDER</span>}
      </div>))}
    </div>
    <p className="mt-6"><Link href="/programs" className="text-brand font-bold">একাডেমিক প্রোগ্রাম দেখুন →</Link></p>
  </div>);
}
