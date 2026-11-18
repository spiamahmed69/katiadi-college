import Link from 'next/link';
import { getSettings, getAll } from '@/lib/store';
export default async function Footer() {
  const s = await getSettings();
  const depts = await getAll('departments');
  return (<footer className="bg-gray-900 text-gray-300 mt-12">
    <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
      <div><div className="text-white font-black text-xl">{s.siteNameBn}</div><p className="text-sm mt-1 text-gray-400">{s.siteName}</p><p className="text-sm mt-3">📍 {s.address}<br />EIIN: {s.eiin}<br />✉️ {s.contactEmail}<br />📞 {s.contactPhone}</p><p className="text-xs mt-3 text-yellow-300">⚠️ Contact details are placeholders — to be confirmed by the college office.</p></div>
      <div><h3 className="text-white font-bold mb-3">বিভাগসমূহ</h3><ul className="space-y-1 text-sm">{depts.map((d: any) => <li key={d.id}><Link className="hover:text-white" href="/departments">{d.name_bn || d.name}</Link></li>)}</ul></div>
      <div><h3 className="text-white font-bold mb-3">গুরুত্বপূর্ণ লিংক</h3><ul className="space-y-1 text-sm">
        <li><Link className="hover:text-white" href="/about">কলেজ সম্পর্কে</Link></li>
        <li><Link className="hover:text-white" href="/admission">ভর্তি</Link></li>
        <li><Link className="hover:text-white" href="/results">ফলাফল</Link></li>
        <li><Link className="hover:text-white" href="/notices">নোটিশ বোর্ড</Link></li>
        <li><Link className="hover:text-white" href="/student/login">শিক্ষার্থী পোর্টাল</Link></li>
        <li><Link className="hover:text-white" href="/admin/login">অ্যাডমিন</Link></li>
        <li><Link className="hover:text-white" href="/contact">যোগাযোগ</Link></li>
      </ul></div>
      <div><h3 className="text-white font-bold mb-3">একাডেমিক</h3><ul className="space-y-1 text-sm">
        <li><Link className="hover:text-white" href="/routine">ক্লাস রুটিন</Link></li>
        <li><Link className="hover:text-white" href="/exam-routine">পরীক্ষার রুটিন</Link></li>
        <li><Link className="hover:text-white" href="/programs">একাডেমিক প্রোগ্রাম</Link></li>
        <li><Link className="hover:text-white" href="/news">সংবাদ ও অনুষ্ঠান</Link></li>
        <li><Link className="hover:text-white" href="/gallery">ফটো গ্যালারি</Link></li>
      </ul></div>
    </div>
    <div className="border-t border-gray-800"><div className="max-w-7xl mx-auto px-4 py-4 text-xs flex flex-wrap justify-between gap-2"><span>© {new Date().getFullYear()} {s.siteName} — সর্বস্বত্ব সংরক্ষিত। EIIN: {s.eiin}</span><span>কটিয়াদী, কিশোরগঞ্জ, বাংলাদেশ</span></div></div>
  </footer>);
}
