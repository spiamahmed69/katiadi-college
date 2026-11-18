import { getAll } from '@/lib/store';
export const dynamic = 'force-dynamic';
export default async function Programs() {
  const programs = await getAll('programs');
  return (<div className="max-w-7xl mx-auto px-4 py-12 fade-up">
    <h1 className="text-3xl font-black">একাডেমিক প্রোগ্রাম <span className="text-lg font-normal text-gray-500">Academic Programs</span></h1>
    <p className="mt-3 text-gray-600 dark:text-gray-300">⚠️ Program list is a placeholder — levels, duration and departments are to be confirmed by the college office.</p>
    <div className="mt-8 grid sm:grid-cols-2 gap-4">{programs.map((p: any) => (
      <div key={p.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="font-bold text-xl">{p.name_bn} <span className="text-gray-500 text-base">({p.name})</span></div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{p.description}</p>
        <div className="flex flex-wrap gap-2 mt-4 text-xs">
          <span className="bg-brand-light dark:bg-blue-900 text-brand dark:text-blue-200 font-bold px-2 py-1 rounded">Level: {p.level}</span>
          <span className="bg-brand-light dark:bg-blue-900 text-brand dark:text-blue-200 font-bold px-2 py-1 rounded">Duration: {p.duration}</span>
          <span className="bg-brand-light dark:bg-blue-900 text-brand dark:text-blue-200 font-bold px-2 py-1 rounded">Dept: {p.department}</span>
        </div>
        {p.is_sample && <span className="inline-block mt-3 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-[11px] font-bold px-2 py-0.5 rounded">PLACEHOLDER</span>}
      </div>))}
    </div>
  </div>);
}
