import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (<div className="max-w-7xl mx-auto px-4 py-6">
    <div className="flex flex-wrap justify-between items-center gap-3 bg-brand text-white rounded-lg px-5 py-4">
      <div><div className="font-black text-xl">কটিয়াদী সরকারি কলেজ — অ্যাডমিন</div><div className="text-sm text-blue-100">Admin Dashboard • EIIN 110434</div></div>
      <div className="flex gap-2">
        <Link href="/" className="bg-white text-brand px-4 py-2 rounded font-bold text-sm">ওয়েবসাইট দেখুন</Link>
        <LogoutButton />
      </div>
    </div>
    <div className="mt-6">{children}</div>
  </div>);
}
