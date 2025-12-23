'use client';
import { motion } from 'framer-motion';

export default function ProfileSection({ user }: { user: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="bg-white rounded-4xl p-10 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-brand-dark mb-8">
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</span>
            <p className="text-lg font-bold text-brand-dark">{user?.name || 'User'}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</span>
            <p className="text-lg font-bold text-brand-dark">{user?.email}</p>
          </div>
        </div>
        
        <button className="mt-10 text-brand-primary font-black uppercase text-[10px] tracking-widest hover:underline">
          Edit Details
        </button>
      </div>

      {/* Support Card */}
      <div className="bg-brand-dark rounded-4xl p-10 text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-xl font-black italic uppercase">Need Assistance?</h3>
          <p className="text-slate-400 text-sm font-medium">Our support crew is ready for your custom requests.</p>
        </div>
        <button className="w-full md:w-auto bg-brand-primary px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform">
          Contact Support
        </button>
      </div>
    </motion.div>
  );
}