import Link from 'next/link';
import { getAll } from '@/lib/store';
export const dynamic = 'force-dynamic';
export default async function News() {
  const news = await getAll('news_events');
  return (<div className="max-w-7xl mx-auto px-4 py-12 fade-up">
    <h1 className="text-3xl font-black">সংবাদ ও অনুষ্ঠান <span className="text-lg font-normal text-gray-500">News &amp; Events</span></h1>
    <p className="mt-3 text-gray-600 dark:text-gray-300">⚠️ Items labelled SAMPLE are placeholders, not real college news.</p>
    <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{news.map((a: any) => (
      <article key={a.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {a.image && <img src={a.image} alt={a.title} className="w-full h-44 object-cover" />}
        <div className="p-4">
          <Link href={'/news/' + a.slug} className="font-bold hover:text-brand">{a.title_bn || a.title}</Link>
          {a.is_sample && <span className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-[11px] font-bold px-2 py-0.5 rounded">SAMPLE</span>}
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{a.excerpt}</p>
          <p className="text-xs text-gray-500 mt-2">{a.date} • {a.category}</p>
        </div>
      </article>))}
    </div>
    {news.length === 0 && <p className="text-gray-500 mt-6">কোনো সংবাদ নেই।</p>}
  </div>);
}
