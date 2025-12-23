'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push('/account'); // Send them to their profile if already logged in
    }
  }, [session, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Try again.");
      setLoading(false);
    } else {
      router.push('/');
      router.refresh(); // Ensure the Navbar updates to show 'Account'
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <header className="text-center mb-10">
          <h1 className="text-6xl font-black italic tracking-tighter uppercase text-brand-dark mb-2">
            Welcome <span className="text-brand-primary">Back</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
            Enter your details to access your studio
          </p>
        </header>

        {/* Social Login */}
        <button 
          onClick={() => signIn('google')}
          className="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all mb-8 shadow-sm"
        >
          <img src="/google-icon.svg" alt="" className="w-5 h-5" />
          Continue with Google
        </button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-300">
            <span className="bg-white px-4">Or Email Login</span>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all outline-none"
              placeholder="name@example.com"
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all outline-none"
              placeholder="••••••••"
              required 
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-dark text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-primary transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
          New to the collective? <Link href="/register" className="text-brand-primary hover:underline">Register here</Link>
        </p>
      </motion.div>
    </main>
  );
}