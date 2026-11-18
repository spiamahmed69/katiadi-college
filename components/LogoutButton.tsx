'use client';
import { useRouter } from 'next/navigation';
export default function LogoutButton() {
  const router = useRouter();
  const logout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/admin/login'); router.refresh(); };
  return <button onClick={logout} className="bg-brand-dark px-4 py-2 rounded font-bold text-sm">লগআউট</button>;
}
