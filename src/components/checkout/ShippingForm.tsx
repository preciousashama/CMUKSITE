'use client';
import { useForm } from 'react-hook-form'; // I recommend adding this: npm install react-hook-form

export default function ShippingForm({ onNext }: { onNext: (data: any) => void }) {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-8">
      <h2 className="text-2xl font-black italic uppercase tracking-tighter text-brand-dark">Shipping Address</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
          <input {...register('fullName', { required: true })} className="checkout-input" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</label>
          <input {...register('email', { required: true })} type="email" className="checkout-input" placeholder="john@example.com" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">City</label>
          <input {...register('city', { required: true })} className="checkout-input" placeholder="London" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Street Address</label>
          <input {...register('address', { required: true })} className="checkout-input" placeholder="123 CMUK Way" />
        </div>
      </div>

      <button type="submit" className="w-full bg-brand-dark text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-primary transition-all shadow-xl shadow-slate-200">
        Continue to Payment
      </button>
    </form>
  );
}