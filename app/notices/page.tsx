import { getAll } from '@/lib/store';
export const dynamic = 'force-dynamic';
export default async function Notices() {
  const notices = await getAll('notices');
  return (<div className="max-w-4xl mx-auto px-4 py-12 fade-up">
    <h1 className="text-3xl font-black">নোটিশ বোর্ড <span className="text-lg font-normal text-gray-500">Notice Board</span></h1>
    <p className="mt-3 text-gray-600 dark:text-gray-300">⚠️ Notices shown as SAMPLE are placeholders, not official college notices.</p>
    <ul className="mt-8 space-y-4">{notices.map((n: any) => (
      <li key={n.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
        <div className="flex flex-wrap items-center gap-2"><span className="font-bold text-lg">{n.title_bn || n.title}</span>{n.is_sample && <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-[11px] font-bold px-2 py-0.5 rounded">SAMPLE / PLACEHOLDER</span>}</div>
        <p className="text-xs text-gray-500 mt-1">{n.date} • {n.category}</p>
        {n.body && <p className="text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">{n.body_bn || n.body}</p>}
      </li>))}
    {notices.length === 0 && <p className="text-gray-500 mt-6">কোনো নোটিশ নেই।</p>}</ul>
  </div>);
}
