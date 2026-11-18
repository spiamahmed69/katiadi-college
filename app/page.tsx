import Link from 'next/link';
import { getAll, getSettings } from '@/lib/store';
export const dynamic = 'force-dynamic';
function Badge({ sample }: { sample?: boolean }) {
  return sample ? <span className="ml-2 inline-block bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-[11px] font-bold px-2 py-0.5 rounded">SAMPLE / PLACEHOLDER</span> : null;
}
export default async function Home() {
  const s = await getSettings();
  const notices = await getAll('notices');
  const news = await getAll('news_events');
  const depts = await getAll('departments');
  const programs = await getAll('programs');
  const teachers = await getAll('teachers');
  return (<div className="fade-up">
    <section className="relative bg-brand text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?w=1800&q=80')" }} />
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <p className="text-blue-200 font-bold tracking-wide">কটিয়াদী, কিশোরগঞ্জ • EIIN: {s.eiin}</p>
        <h1 className="text-4xl sm:text-6xl font-black mt-3 leading-tight">{s.siteNameBn}</h1>
        <p className="text-xl sm:text-2xl mt-2 font-bold text-blue-100">{s.siteName}</p>
        <p className="mt-4 max-w-2xl text-blue-100">{s.tagline} — {s.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/admission" className="bg-white text-brand font-bold px-6 py-3 rounded shadow">ভর্তির আবেদন করুন</Link>
          <Link href="/notices" className="bg-brand-dark border border-white/40 font-bold px-6 py-3 rounded">নোটিশ বোর্ড</Link>
          <Link href="/student/login" className="bg-brand-gold text-gray-900 font-bold px-6 py-3 rounded">শিক্ষার্থী পোর্টাল</Link>
        </div>
      </div>
    </section>
    <section className="max-w-7xl mx-auto px-4 -mt-6 relative"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[{ l: 'EIIN', v: s.eiin }, { l: 'Departments / বিভাগ', v: String(depts.length) }, { l: 'Programs / প্রোগ্রাম', v: String(programs.length) }, { l: 'Teachers (listed) / শিক্ষক', v: String(teachers.length) }].map(x => (
        <div key={x.l} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 text-center"><div className="text-3xl font-black text-brand">{x.v}</div><div className="text-sm text-gray-500 mt-1">{x.l}</div></div>))}
    </div></section>
    <section className="max-w-7xl mx-auto px-4 py-12 grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-2"><h2 className="text-2xl font-black">নোটিশ বোর্ড <span className="text-base font-normal text-gray-500">Notice Board</span></h2>
        <ul className="mt-4 space-y-3">{notices.slice(0, 5).map((n: any) => <li key={n.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"><Link href="/notices" className="font-bold hover:text-brand">{n.title_bn || n.title}</Link><Badge sample={n.is_sample} /><p className="text-xs text-gray-500 mt-1">{n.date} • {n.category}</p></li>)}
        {notices.length === 0 && <p className="text-gray-500 mt-4">কোনো নোটিশ নেই।</p>}</ul>
        <Link href="/notices" className="inline-block mt-4 text-brand font-bold">সব নোটিশ দেখুন →</Link></div>
      <div className="lg:col-span-3"><h2 className="text-2xl font-black">সংবাদ ও অনুষ্ঠান <span className="text-base font-normal text-gray-500">News &amp; Events</span></h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">{news.slice(0, 4).map((a: any) => <article key={a.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {a.image && <img src={a.image} alt={a.title} className="w-full h-40 object-cover" />}
          <div className="p-4"><Link href={`/news/${a.slug}`} className="font-bold hover:text-brand">{a.title_bn || a.title}</Link><Badge sample={a.is_sample} /><p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{a.excerpt}</p><p className="text-xs text-gray-500 mt-2">{a.date} • {a.category}</p></div></article>)}
        {news.length === 0 && <p className="text-gray-500">কোনো সংবাদ নেই।</p>}</div>
        <Link href="/news" className="inline-block mt-4 text-brand font-bold">সব সংবাদ দেখুন →</Link></div>
    </section>
    <section className="bg-white dark:bg-gray-900 py-12"><div className="max-w-7xl mx-auto px-4"><h2 className="text-2xl font-black">বিভাগসমূহ <span className="text-base font-normal text-gray-500">Departments</span></h2>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{depts.map((d: any) => <Link key={d.id} href="/departments" className="border rounded-lg p-5 hover:border-brand hover:shadow dark:border-gray-700"><div className="font-bold text-lg">{d.name_bn} <span className="text-gray-500 text-sm">({d.name})</span></div><Badge sample={d.is_sample} /><p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{d.description}</p></Link>)}</div></div></section>
    <section className="max-w-7xl mx-auto px-4 py-12"><h2 className="text-2xl font-black">দ্রুত লিংক <span className="text-base font-normal text-gray-500">Quick Links</span></h2>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[['/admission', 'ভর্তি', 'Admission'], ['/results', 'ফলাফল', 'Results'], ['/routine', 'ক্লাস রুটিন', 'Class Routine'], ['/exam-routine', 'পরীক্ষার রুটিন', 'Exam Routine'], ['/gallery', 'ফটো গ্যালারি', 'Gallery'], ['/teachers', 'শিক্ষক ও কর্মচারী', 'Teachers'], ['/programs', 'একাডেমিক প্রোগ্রাম', 'Programs'], ['/contact', 'যোগাযোগ', 'Contact']].map(([href, bn, en]) => (
          <Link key={href} href={href} className="bg-brand text-white rounded-lg p-5 font-bold hover:bg-brand-accent">{bn}<span className="block text-xs font-normal text-blue-100 mt-1">{en}</span></Link>))}
      </div>
      <p className="text-xs text-gray-500 mt-8">⚠️ This website uses only verified college facts (name, EIIN 110434, location). Principal, teacher, notice, result and contact details shown as “SAMPLE / PLACEHOLDER” are not verified and must be confirmed by the college office.</p>
    </section>
  </div>);
}
