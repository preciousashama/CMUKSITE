'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Updated for Next.js 13+ compatibility
import { useEffect, useState } from 'react';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  // Protective Redirect
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">MY ACCOUNT</h1>
          <p className="text-slate-500 mt-2">Welcome back, <span className="text-blue-600 font-bold">{session.user?.name}</span></p>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all"
        >
          LOG OUT
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Navigation Sidebar */}
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`text-left px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Profile Overview
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`text-left px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Order History
          </button>
          <button 
            className="text-left px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
            disabled
          >
            My Saved Designs (Coming Soon)
          </button>
        </nav>

        {/* Content Area */}
        <main className="md:col-span-3">
          {activeTab === 'profile' ? (
            <section className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="bg-white border rounded-2xl p-8 space-y-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                    <p className="text-lg font-medium text-slate-900">{session.user?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
                    <p className="text-lg font-medium text-slate-900">{session.user?.email}</p>
                  </div>
                </div>
                <button className="mt-4 text-blue-600 text-sm font-bold hover:underline">Edit Details</button>
              </div>

              <div className="bg-slate-900 rounded-2xl p-8 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Need help with an order?</h3>
                  <p className="text-slate-400 text-sm">Our support team is available 24/7.</p>
                </div>
                <button className="bg-white text-slate-900 px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-400 transition-colors">
                  Contact Support
                </button>
              </div>
            </section>
          ) : (
            <section className="animate-in fade-in slide-in-from-right-4">
              <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">You haven't placed any orders yet.</p>
                <button 
                  onClick={() => router.push('/products')}
                  className="mt-4 text-blue-600 font-bold hover:underline"
                >
                  Start Shopping
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}