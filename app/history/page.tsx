import { getSettings } from '@/lib/store';
export const dynamic = 'force-dynamic';
export default async function History() {
  const s = await getSettings();
  return (<div className="max-w-4xl mx-auto px-4 py-12 fade-up">
    <h1 className="text-3xl font-black">ইতিহাস <span className="text-lg font-normal text-gray-500">History</span></h1>
    <div className="mt-6 bg-yellow-50 dark:bg-yellow-950 border border-yellow-300 dark:border-yellow-800 rounded-lg p-5">
      <p className="font-bold">⚠️ PLACEHOLDER — College history not yet verified</p>
      <p className="mt-2 text-gray-700 dark:text-gray-300">The official history of {s.siteNameBn} ({s.siteName}, EIIN {s.eiin}, Katiadi, Kishoreganj) has not been verified. No founding date, founder, or historical milestones are published here, because inventing them would be misleading. This section will be completed by the college office with verified records.</p>
    </div>
    <h2 className="text-2xl font-bold mt-10">Verified facts</h2>
    <ul className="mt-3 list-disc pl-6 space-y-1">
      <li>College name: {s.siteNameBn} / {s.siteName}</li>
      <li>EIIN: {s.eiin}</li>
      <li>Location: Katiadi, Kishoreganj, Bangladesh</li>
      <li>Established: To be confirmed</li>
    </ul>
  </div>);
}
