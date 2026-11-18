import type { MetadataRoute } from 'next'; import { getAll } from '@/lib/store';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date();
  const pages = ['', '/about', '/history', '/principal', '/governing-body', '/teachers', '/departments', '/programs', '/admission', '/routine', '/exam-routine', '/results', '/notices', '/news', '/gallery', '/contact', '/student/login'];
  const news = await getAll('news_events');
  return [
    ...pages.map(p => ({ url: base + p, lastModified: now })),
    ...news.map((a: any) => ({ url: `${base}/news/${a.slug}`, lastModified: new Date(a.date || now) })),
  ];
}
