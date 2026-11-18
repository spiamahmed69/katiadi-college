export const dynamic = 'force-dynamic';
const MEMBERS = [
  { role: 'সভাপতি / President', name: 'To be confirmed', note: 'Placeholder — not verified' },
  { role: 'অধ্যক্ষ / Principal', name: 'To be confirmed', note: 'Placeholder — not verified' },
  { role: 'শিক্ষক প্রতিনিধি / Teacher Representative', name: 'To be confirmed', note: 'Placeholder — not verified' },
  { role: 'অভিভাবক প্রতিনিধি / Guardian Representative', name: 'To be confirmed', note: 'Placeholder — not verified' },
  { role: 'সদস্য / Member', name: 'To be confirmed', note: 'Placeholder — not verified' },
];
export default function GoverningBody() {
  return (<div className="max-w-4xl mx-auto px-4 py-12 fade-up">
    <h1 className="text-3xl font-black">পরিচালনা পর্ষদ <span className="text-lg font-normal text-gray-500">Governing Body</span></h1>
    <div className="mt-6 bg-yellow-50 dark:bg-yellow-950 border border-yellow-300 dark:border-yellow-800 rounded-lg p-5">
      <p className="font-bold">⚠️ PLACEHOLDER — Governing body members not yet verified</p>
      <p className="mt-2 text-gray-700 dark:text-gray-300">No real names are published here. The list below shows the usual roles only; names will be added by the college office once confirmed.</p>
    </div>
    <div className="mt-6 grid sm:grid-cols-2 gap-4">{MEMBERS.map(m => (
      <div key={m.role} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5"><div className="font-bold text-brand">{m.role}</div><div className="text-lg font-bold mt-1">{m.name}</div><div className="text-xs text-gray-500 mt-1">{m.note}</div></div>))}
    </div>
  </div>);
}
