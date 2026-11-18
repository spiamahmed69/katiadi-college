import Link from 'next/link';
import { getAll } from '@/lib/store';
export const dynamic = 'force-dynamic';
function Table({ rows, title }: { rows: any[]; title: string }) {
  return (<div className="mt-6"><h2 className="text-xl font-bold">{title}</h2>
    {rows.length === 0 ? <p className="text-gray-500 mt-3">কোনো রুটিন নেই।</p> : (
    <div className="overflow-x-auto mt-3"><table className="w-full text-sm bg-white dark:bg-gray-800 rounded-lg shadow">
      <thead><tr className="bg-brand text-white text-left"><th className="p-3">দিন / Day</th><th className="p-3">সময় / Time</th><th className="p-3">বিষয় / Subject</th><th className="p-3">শ্রেণি / Class</th><th className="p-3">কক্ষ / Room</th><th className="p-3">শিক্ষক / Teacher</th></tr></thead>
      <tbody>{rows.map((r: any) => <tr key={r.id} className="border-t dark:border-gray-700"><td className="p-3">{r.day}</td><td className="p-3">{r.time}</td><td className="p-3 font-bold">{r.subject}</td><td className="p-3">{r.class_name}</td><td className="p-3">{r.room}</td><td className="p-3">{r.teacher}</td></tr>)}</tbody>
    </table></div>)}
  </div>);
}
export default async function Routine({ searchParams }: { searchParams: { class?: string } }) {
  const all = (await getAll('routines')).filter((r: any) => r.type === 'class');
  const classes = [...new Set(all.map((r: any) => r.class_name).filter(Boolean))];
  const sel = searchParams.class || '';
  const rows = sel ? all.filter((r: any) => r.class_name === sel) : all;
  return (<div className="max-w-7xl mx-auto px-4 py-12 fade-up">
    <h1 className="text-3xl font-black">ক্লাস রুটিন <span className="text-lg font-normal text-gray-500">Class Routine</span></h1>
    <p className="mt-3 text-gray-600 dark:text-gray-300">⚠️ Routine entries are SAMPLE placeholders — to be confirmed by the college office.</p>
    <div className="mt-6 flex flex-wrap gap-2">
      <Link href="/routine" className={'px-4 py-2 rounded font-bold ' + (!sel ? 'bg-brand text-white' : 'bg-white dark:bg-gray-800 border')}>সব শ্রেণি</Link>
      {classes.map((c: string) => <Link key={c} href={'/routine?class=' + encodeURIComponent(c)} className={'px-4 py-2 rounded font-bold ' + (sel === c ? 'bg-brand text-white' : 'bg-white dark:bg-gray-800 border')}>{c}</Link>)}
    </div>
    <Table rows={rows} title={sel ? 'রুটিন — ' + sel : 'সব ক্লাস রুটিন'} />
  </div>);
}
