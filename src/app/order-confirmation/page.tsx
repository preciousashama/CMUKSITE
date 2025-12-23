'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

export default function ConfirmationPage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const orderId = sessionStorage.getItem('lastOrderId');

    if (!orderId) {
      router.push('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        // In a real app, this hits your actual DB
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) throw new Error('Order not found');
        
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Order recovery failed", error);
        // Fallback for demo/dev mode if API isn't built yet
        setOrder(JSON.parse(sessionStorage.getItem('lastOrderData') || '{}'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [router]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!order || !order.id) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* Success Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-20"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full mb-8">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-6xl font-black italic tracking-tighter uppercase text-brand-dark mb-4">
          Order <span className="text-brand-primary">Locked In.</span>
        </h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
          Order #{order.id} • A confirmation email is on its way.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Shipping & Meta Details */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 space-y-12"
        >
          <div className="bg-slate-50 rounded-[2.5rem] p-10 space-y-8 border border-slate-100">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Shipping To</h2>
              <address className="not-italic space-y-1">
                <span className="block text-lg font-black text-brand-dark uppercase italic">{order.shipping?.fullName}</span>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  {order.shipping?.address}<br />
                  {order.shipping?.city}, {order.shipping?.state} {order.shipping?.zip}<br />
                  {order.shipping?.country}
                </p>
              </address>
            </div>

            <div className="pt-8 border-t border-slate-200">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Delivery Method</h2>
              <p className="text-sm font-bold text-brand-dark">Standard Shipping (3-5 Business Days)</p>
            </div>
          </div>
        </motion.div>

        {/* Line Items & Total */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-7"
        >
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Your Items</h2>
          <div className="divide-y divide-slate-100">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="py-6 flex justify-between items-center group">
                <div className="flex gap-6 items-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-black italic uppercase text-brand-dark block">{item.name}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Qty: {item.quantity} • Size: {item.options?.size}</span>
                  </div>
                </div>
                <span className="font-bold text-brand-dark">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-10 border-t-4 border-brand-dark space-y-4">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Subtotal</span>
              <span className="text-brand-dark">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between text-2xl font-black italic uppercase text-brand-dark pt-2">
              <span>Total Paid</span>
              <span className="text-brand-primary">{formatCurrency(order.total * 1.08)}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-24 flex flex-col sm:flex-row gap-6 justify-center">
        <Link href="/products" className="bg-brand-dark text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-primary transition-all">
          Back to Store
        </Link>
        <button className="border-2 border-slate-200 text-slate-500 px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-brand-dark hover:text-brand-dark transition-all">
          Print Receipt
        </button>
      </div>
    </div>
  );
}