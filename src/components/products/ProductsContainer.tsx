'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

export default function ProductsContainer({ initialProducts = [] }) {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  // Logic for filtering and sorting
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];
    
    if (filter !== 'all') {
      result = result.filter(p => p.category?.toLowerCase() === filter.toLowerCase());
    }

    if (sort === 'low') result.sort((a, b) => a.price - b.price);
    if (sort === 'high') result.sort((a, b) => b.price - a.price);

    return result;
  }, [filter, sort, initialProducts]);

  return (
    <div className="space-y-12">
      {/* Dynamic Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-slate-100">
        <div className="flex gap-2">
          {['all', 'tees', 'hoodies', 'accessories'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === cat 
                ? 'bg-brand-primary text-white shadow-lg shadow-blue-200' 
                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select 
          onChange={(e) => setSort(e.target.value)}
          className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-slate-500"
        >
          <option value="newest">New Arrivals</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      {/* Animated Grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState onClear={() => setFilter('all')} />
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function ProductCard({ product }: any) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative"
    >
      <Link href={`/products/${product.id}`} className="block">
        {/* Image Frame */}
        <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-50 mb-6 border border-slate-100 shadow-sm">
          <img
            src={product.image || 'https://placehold.co/600x800'}
            alt={product.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
          />
          {product.isNew && (
            <span className="absolute top-6 left-6 bg-brand-primary text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
              New Drop
            </span>
          )}
        </div>

        {/* Text Details */}
        <div className="space-y-1 px-2">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-brand-dark group-hover:text-brand-primary transition-colors leading-none">
              {product.name}
            </h3>
            <span className="text-sm font-bold text-slate-400">{formatCurrency(product.price)}</span>
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">
            {product.category || 'Apparel'}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
      <p className="text-slate-400 font-black italic uppercase text-xl mb-6">No items match your vibe.</p>
      <button onClick={onClear} className="text-brand-primary font-black uppercase text-xs tracking-[0.2em] hover:underline">
        Reset Search
      </button>
    </div>
  );
}