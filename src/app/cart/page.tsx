'use client';

import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import CartItem from '@/components/cart/CartItem';

export default function CartPage() {
  const { cart, subtotal } = useCart(); // Assuming subtotal is calculated in context

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
        <div className="space-y-2">
          <h1 className="text-6xl font-black italic tracking-tighter uppercase text-brand-dark">
            Bag
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
            {cart.length === 0 ? 'Your bag is empty' : `${cart.length} Items Selected`}
          </p>
        </div>
      </header>

      {cart.length === 0 ? (
        <EmptyCartState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* List of Items */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <CartItem key={`${item.productId}-${item.options?.size}`} item={item} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4">
            <div className="bg-brand-dark text-white rounded-[2.5rem] p-10 sticky top-10 shadow-2xl shadow-slate-200">
              <h2 className="text-xl font-black italic uppercase mb-8 tracking-tight text-white/90">Summary</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subtotal</span>
                  <span className="font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shipping</span>
                  <span className="text-emerald-400 font-black uppercase text-[10px]">Calculated at checkout</span>
                </div>
                
                <div className="h-px bg-slate-800 w-full" />
                
                <div className="flex justify-between items-end pt-2">
                  <span className="text-lg font-black italic uppercase">Total</span>
                  <span className="text-3xl font-black italic text-brand-primary">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="group relative flex items-center justify-center w-full mt-10 bg-brand-primary text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] overflow-hidden transition-all hover:scale-[1.02] active:scale-95"
              >
                <span className="relative z-10">Proceed to Checkout</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function EmptyCartState() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200"
    >
      <p className="text-slate-400 font-black italic uppercase text-2xl mb-8">Your bag is empty</p>
      <Link href="/products" className="bg-brand-dark text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-primary transition-colors">
        Browse Collection
      </Link>
    </motion.div>
  );
}