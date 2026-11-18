import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBySlug } from '@/lib/store';
export const dynamic = 'force-dynamic';
export default async function NewsDetail({ params }: { params: { slug: string } }) {
  const item = await getBySlug('news_events', params.slug);
  if (!item) notFound();
  return (<div className="max-w-3xl mx-auto px-4 py-12 fade-up">
    <Link href="/news" className="text-brand font-bold">← সব সংবাদ</Link>
    <h1 className="text-3xl font-black mt-4">{item.title_bn || item.title}</h1>
    <p className="text-sm text-gray-500 mt-2">{item.date} • {item.category}</p>
    {item.is_sample && <span className="inline-block mt-3 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-bold px-2 py-1 rounded">SAMPLE / PLACEHOLDER — not a real college announcement</span>}
    {item.image && <img src={item.image} alt={item.title} className="w-full rounded-lg shadow mt-6" />}
    <p className="mt-6 text-lg leading-relaxed">{item.excerpt}</p>
    <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{item.content}</p>
  </div>);
}
