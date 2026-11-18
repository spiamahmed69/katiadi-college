import { getSettings } from '@/lib/store';
export const dynamic = 'force-dynamic';
export default async function Principal() {
  const s = await getSettings();
  return (<div className="max-w-4xl mx-auto px-4 py-12 fade-up">
    <h1 className="text-3xl font-black">অধ্যক্ষের বাণী <span className="text-lg font-normal text-gray-500">Principal&apos;s Message</span></h1>
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex gap-5 items-start">
      <div className="w-24 h-24 rounded-full bg-brand text-white flex items-center justify-center text-3xl font-black shrink-0">অ</div>
      <div>
        <p className="font-bold text-xl">Principal&apos;s name: {s.principalName}</p>
        <p className="text-sm text-gray-500">{s.siteNameBn}, কটিয়াদী, কিশোরগঞ্জ • EIIN {s.eiin}</p>
        <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300">“Placeholder message — the principal&apos;s name and message have not been verified and are not published here. Once the college office confirms the principal&apos;s name and message, this page will be updated with the real text.”</p>
      </div>
    </div>
    <p className="text-sm text-gray-500 mt-6">⚠️ Do not treat the placeholder above as a real message from a real person.</p>
  </div>);
}
