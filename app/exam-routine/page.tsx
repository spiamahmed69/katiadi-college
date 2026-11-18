import { getAll } from '@/lib/store';
export const dynamic = 'force-dynamic';
export default async function ExamRoutine() {
  const rows = (await getAll('routines')).filter((r: any) => r.type === 'exam');
  return (<div className="max-w-7xl mx-auto px-4 py-12 fade-up">
    <h1 className="text-3xl font-black">পরীক্ষার রুটিন <span className="text-lg font-normal text-gray-500">Examination Routine</span></h1>
    <p className="mt-3 text-gray-600 dark:text-gray-300">⚠️ Exam routine entries are SAMPLE placeholders — dates and times must be confirmed by the college office.</p>
    {rows.length === 0 ? <p className="text-gray-500 mt-6">কোনো পরীক্ষার রুটিন নেই।</p> : (
    <div className="overflow-x-auto mt-6"><table className="w-full text-sm bg-white dark:bg-gray-800 rounded-lg shadow">
      <thead><tr className="bg-brand text-white text-left"><th className="p-3">পরীক্ষা / Exam</th><th className="p-3">দিন / Day</th><th className="p-3">সময় / Time</th><th className="p-3">বিষয় / Subject</th><th className="p-3">শ্রেণি / Class</th><th className="p-3">কক্ষ / Room</th></tr></thead>
      <tbody>{rows.map((r: any) => <tr key={r.id} className="border-t dark:border-gray-700"><td className="p-3 font-bold">{r.title}</td><td className="p-3">{r.day}</td><td className="p-3">{r.time}</td><td className="p-3">{r.subject}</td><td className="p-3">{r.class_name}</td><td className="p-3">{r.room}</td></tr>)}</tbody>
    </table></div>)}
  </div>);
}
