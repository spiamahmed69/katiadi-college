import type { Metadata } from 'next';
import './globals.css'; import Header from '@/components/Header'; import Footer from '@/components/Footer'; import { getSettings } from '@/lib/store';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Katiadi Government College | কটিয়াদী সরকারি কলেজ — EIIN 110434',
  description: 'Katiadi Government College, Katiadi, Kishoreganj, Bangladesh. EIIN 110434. Official college website — Bengali and English.',
  openGraph: { title: 'Katiadi Government College', description: 'কটিয়াদী সরকারি কলেজ, কটিয়াদী, কিশোরগঞ্জ — EIIN 110434', type: 'website', locale: 'bn_BD', siteName: 'Katiadi Government College' },
  twitter: { card: 'summary_large_image', title: 'Katiadi Government College', description: 'কটিয়াদী সরকারি কলেজ — EIIN 110434' },
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const jsonLd = { '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: 'Katiadi Government College', alternateName: s.siteNameBn, url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', address: { '@type': 'PostalAddress', addressLocality: 'Katiadi, Kishoreganj', addressCountry: 'BD' }, description: s.description };
  return (<html lang="bn"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;700&family=Noto+Serif+Bengali:wght@400;600;700;900&display=swap" rel="stylesheet" />
    <script dangerouslySetInnerHTML={{ __html: `try{const t=localStorage.getItem('katiadi-theme'); if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark')}catch(e){}` }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </head><body className="bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 min-h-screen flex flex-col"><Header /><main className="flex-1">{children}</main><Footer /></body></html>);
}
