'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/CartContext';
import { formatCurrency } from '@/lib/utils';
import { ChevronLeft, ShieldCheck, Truck, RotateCcw, Plus, Minus, Box } from 'lucide-react';

export default function ProductDisplay({ product }: { product: any }) {
  const { addToCart } = useCart();
  
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.image);

  const availableSizes = product.sizes || ['S', 'M', 'L', 'XL'];
  const totalPrice = useMemo(() => product.price * quantity, [product.price, quantity]);

  return (
    <article className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      {/* Navigation */}
      <nav className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">
        <Link href="/products" className="hover:text-brand-primary transition-colors flex items-center gap-2">
          <ChevronLeft size={14} /> Back to Archive
        </Link>
        <span className="opacity-20">/</span>
        <span className="text-brand-dark italic">{product.category}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">
        
        {/* Left: Gallery (Occupies 7/12 cols) */}
        <section className="lg:col-span-7 space-y-8">
          <div className="aspect-[4/5] relative bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200">
            <AnimatePresence mode="wait">
              <motion.div
                key={mainImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                <Image 
                  src={mainImage} 
                  alt={product.name} 
                  fill
                  priority
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {[product.image, ...(product.gallery || [])].map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setMainImage(img)}
                className={`relative w-28 h-28 rounded-3xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                  mainImage === img ? 'border-brand-primary' : 'border-transparent opacity-40'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* Right: Info (Occupies 5/12 cols) */}
        <section className="lg:col-span-5 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-6xl md:text-7xl font-black text-brand-dark leading-[0.85] uppercase italic tracking-tighter mb-6">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black text-brand-primary uppercase italic">
                {formatCurrency(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xl text-slate-300 font-bold line-through">
                  {formatCurrency(product.oldPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-10">
            <p className="text-slate-500 font-medium leading-relaxed max-w-md">
              {product.description}
            </p>

            {/* Configurator */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Size</span>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl font-black text-xs transition-all border-2 ${
                        selectedSize === size 
                          ? 'border-brand-dark bg-brand-dark text-white' 
                          : 'border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Qty</span>
                <div className="flex items-center justify-between bg-slate-50 p-1 rounded-xl border border-slate-100 w-32">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-slate-400"><Minus size={14}/></button>
                  <span className="font-black text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-slate-400"><Plus size={14}/></button>
                </div>
              </div>
            </div>

            {/* Primary Action */}
            <div className="space-y-4 pt-4">
              <button 
                onClick={() => addToCart({ ...product, quantity, size: selectedSize })}
                className="w-full bg-brand-dark text-white py-8 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-primary transition-all active:scale-[0.98] shadow-xl shadow-slate-200"
              >
                Add to Collection — {formatCurrency(totalPrice)}
              </button>
              
              <Link 
                href={`/designservice?baseId=${product.id}`}
                className="flex items-center justify-center gap-3 w-full border-2 border-brand-dark text-brand-dark py-8 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-50 transition-all"
              >
                <Box size={18} /> Launch 3D Studio
              </Link>
            </div>

            {/* Logistics */}
            <div className="flex flex-col gap-4 pt-10 border-t border-slate-100">
               <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <Truck size={16} className="text-brand-primary" />
                  <span>Free tracked shipping on orders over £150</span>
               </div>
               <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <ShieldCheck size={16} className="text-brand-primary" />
                  <span>Secure checkout via Stripe & Apple Pay</span>
               </div>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}