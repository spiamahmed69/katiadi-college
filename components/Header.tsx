import Link from 'next/link';
import { getSettings, getAll } from '@/lib/store';
import ThemeToggle from './ThemeToggle';
const NAV: [string, string, string][] = [
  ['/', 'হোম', 'Home'], ['/about', 'কলেজ সম্পর্কে', 'About'], ['/history', 'ইতিহাস', 'History'],
  ['/principal', 'অধ্যক্ষের বাণী', "Principal's Message"], ['/governing-body', 'পরিচালনা পর্ষদ', 'Governing Body'],
  ['/teachers', 'শিক্ষক ও কর্মচারী', 'Teachers & Staff'], ['/departments', 'বিভাগসমূহ', 'Departments'],
  ['/programs', 'একাডেমিক প্রোগ্রাম', 'Programs'], ['/admission', 'ভর্তি', 'Admission'],
  ['/routine', 'ক্লাস রুটিন', 'Class Routine'], ['/exam-routine', 'পরীক্ষার রুটিন', 'Exam Routine'],
  ['/results', 'ফলাফল', 'Results'], ['/notices', 'নোটিশ বোর্ড', 'Notice Board'],
  ['/news', 'সংবাদ ও অনুষ্ঠান', 'News & Events'], ['/gallery', 'ফটো গ্যালারি', 'Gallery'],
  ['/contact', 'যোগাযোগ', 'Contact'],
];
export default async function Header() {
  const s = await getSettings();
  const notices = await getAll('notices');
  const today = new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return (<header className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow">
    <div className="bg-brand text-white text-xs sm:text-sm"><div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between gap-2"><span>{today} | কটিয়াদী, কিশোরগঞ্জ</span><span className="hidden sm:inline">EIIN: {s.eiin}</span><span className="flex gap-3"><Link href="/student/login" className="underline">শিক্ষার্থী পোর্টাল</Link><Link href="/admin/login" className="underline">অ্যাডমিন</Link></span></div></div>
    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
      <Link href="/" className="flex items-center gap-3">
        <span className="bg-brand text-white font-black text-xl sm:text-2xl w-12 h-12 rounded-full flex items-center justify-center shrink-0">কসক</span>
        <span className="leading-tight"><span className="block font-black text-lg sm:text-2xl text-brand dark:text-blue-300">{s.siteNameBn}</span><span className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">{s.siteName}</span><span className="block text-[11px] text-gray-500 dark:text-gray-400">কটিয়াদী, কিশোরগঞ্জ • EIIN: {s.eiin}</span></span>
      </Link>
      <ThemeToggle />
    </div>
    <nav className="bg-brand-dark text-white overflow-x-auto"><div className="max-w-7xl mx-auto px-4 flex gap-1 text-sm whitespace-nowrap">
      {NAV.map(([href, bn]) => <Link key={href} className="px-3 py-2 hover:bg-brand-accent" href={href}>{bn}</Link>)}
    </div></nav>
    {notices.length > 0 && <div className="bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-900 overflow-hidden"><div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center gap-2"><span className="bg-brand text-white text-xs font-bold px-2 py-0.5 rounded shrink-0">নোটিশ</span><div className="overflow-hidden flex-1"><div className="ticker-track">{[...notices, ...notices].map((n, i) => <Link key={i} href="/notices" className="mx-4 text-sm text-blue-800 dark:text-blue-200 hover:underline">• {n.title_bn || n.title}</Link>)}</div></div></div></div>}
  </header>);
}
