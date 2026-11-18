import { getAll } from '@/lib/store';
export const dynamic = 'force-dynamic';
export default async function Teachers() {
  const teachers = await getAll('teachers');
  return (<div className="max-w-7xl mx-auto px-4 py-12 fade-up">
    <h1 className="text-3xl font-black">শিক্ষক ও কর্মচারী <span className="text-lg font-normal text-gray-500">Teachers &amp; Staff</span></h1>
    <p className="mt-3 text-gray-600 dark:text-gray-300">⚠️ All teacher entries below are placeholders — names and details are “To be confirmed” and must be verified by the college office. No real teacher is named here.</p>
    <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{teachers.map((t: any) => (
      <div key={t.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-brand text-white flex items-center justify-center text-2xl font-black">{(t.name_bn || t.name || '?').slice(0, 1)}</div>
        <div className="font-bold text-lg mt-3">{t.name_bn || t.name}</div>
        <div className="text-sm text-brand font-bold">{t.designation}</div>
        <div className="text-sm text-gray-500">{t.department}</div>
        {t.bio && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{t.bio}</p>}
        {t.is_sample && <span className="inline-block mt-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-[11px] font-bold px-2 py-0.5 rounded">PLACEHOLDER</span>}
      </div>))}
    </div>
    {teachers.length === 0 && <p className="text-gray-500 mt-6">কোনো শিক্ষকের তথ্য নেই।</p>}
  </div>);
}
