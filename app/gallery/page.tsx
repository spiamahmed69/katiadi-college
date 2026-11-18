import { getAll } from '@/lib/store';
export const dynamic = 'force-dynamic';
export default async function Gallery() {
  const items = await getAll('gallery');
  return (<div className="max-w-7xl mx-auto px-4 py-12 fade-up">
    <h1 className="text-3xl font-black">ফটো গ্যালারি <span className="text-lg font-normal text-gray-500">Photo Gallery</span></h1>
    <p className="mt-3 text-gray-600 dark:text-gray-300">⚠️ Gallery photos are generic sample images (Unsplash), not real photos of the college campus.</p>
    <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{items.map((g: any) => (
      <figure key={g.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <img src={g.image} alt={g.title} className="w-full h-48 object-cover" />
        <figcaption className="p-3 text-sm font-bold">{g.title_bn || g.title} <span className="block text-xs font-normal text-gray-500">{g.category}</span></figcaption>
      </figure>))}
    </div>
    {items.length === 0 && <p className="text-gray-500 mt-6">গ্যালারি খালি।</p>}
  </div>);
}
