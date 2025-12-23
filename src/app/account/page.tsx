'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AccountNav from '@/components/account/AccountNav';
import ProfileSection from '@/components/account/ProfileSection';
import OrderHistory from '@/components/account/OrderHistory';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  // Protection logic: Keep the user out if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
        <div className="space-y-2">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-brand-dark">
            Account
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
            Welcome back, <span className="text-brand-primary">{session.user?.name}</span>
          </p>
        </div>
        
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-slate-100 text-slate-500 px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
        >
          Sign Out
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3">
          <AccountNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>

        {/* Dynamic Content Area */}
        <main className="lg:col-span-9">
          {activeTab === 'profile' && <ProfileSection user={session.user} />}
          {activeTab === 'orders' && <OrderHistory />}
        </main>
      </div>
    </div>
  );
}