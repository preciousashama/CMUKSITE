'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Unified State Object
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    company: '',
    shipping: { address: '', city: '', postcode: '', country: '' },
    billing: { address: '', city: '', postcode: '', country: '' },
    sameAsShipping: true
  });

  const isStep1Valid = 
    formData.firstName && formData.lastName && formData.email && 
    formData.password && formData.password === formData.confirmPassword;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6 py-24">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <header className="mb-12 text-center">
          <div className="flex justify-center gap-4 mb-6">
            <div className={`h-1 w-12 rounded-full ${step >= 1 ? 'bg-brand-primary' : 'bg-slate-100'}`} />
            <div className={`h-1 w-12 rounded-full ${step >= 2 ? 'bg-brand-primary' : 'bg-slate-100'}`} />
          </div>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter text-brand-dark leading-none">
            Join the <span className="text-brand-primary">Collective</span>
          </h1>
        </header>

        <form onSubmit={handleRegister} className="bg-white p-2 md:p-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">First Name</label>
                  <input className="checkout-input" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Name</label>
                  <input className="checkout-input" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                  <input type="email" className="checkout-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                  <input type="password" className="checkout-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confirm Password</label>
                  <input type="password" className="checkout-input" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
                </div>

                <button 
                  type="button" 
                  disabled={!isStep1Valid}
                  onClick={() => setStep(2)} 
                  className="md:col-span-2 mt-4 bg-brand-dark text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-primary transition-all disabled:opacity-30"
                >
                  Next: Address Details
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Address fields here - mapping same as Step 1 inputs */}
                   <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Street Address</label>
                      <input className="checkout-input" value={formData.shipping.address} onChange={e => setFormData({...formData, shipping: {...formData.shipping, address: e.target.value}})} />
                   </div>
                </div>

                {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-dark">Back</button>
                  <button type="submit" disabled={loading} className="flex-[2] bg-brand-primary text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-dark transition-all">
                    {loading ? 'Creating Account...' : 'Finish Registration'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className="mt-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
          Already a member? <Link href="/login" className="text-brand-primary hover:underline">Log In</Link>
        </p>
      </div>
    </main>
  );
}