'use client';

import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
// Assuming your product data is now in a central lib or fetched from an API
import { products } from '@/lib/data'; 

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const term = query.toLowerCase();

  // 1. ADVANCED FILTERING LOGIC
  const results = term
    ? products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.colors?.some(c => c.toLowerCase().includes(term))
      )
    : [];

  return (
    <main className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      {/* Header Section */}
      <header className="mb-16">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
          Search Discovery
        </p>
        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-brand-dark">
          {query ? (
            <>Results for <span className="text-brand-primary">"{query}"</span></>
          ) : (
            <>Explore the <span className="text-brand-primary">Archive</span></>
          )}
        </h1>
        <p className="mt-4 text-sm font-bold text-slate-500">
          {results.length} item{results.length !== 1 ? 's' : ''} found in the collection.
        </p>
      </header>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {results.length > 0 ? (
            results.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-[4/5] bg-slate-100 rounded-[2rem] overflow-hidden mb-4 border border-slate-100 shadow-sm">
                    <img
                      src={product.image || '/placeholder.png'}
                      alt={product.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-black italic uppercase tracking-tighter text-brand-dark group-hover:text-brand-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {product.category}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <h2 className="text-2xl font-black italic uppercase text-slate-300 mb-4">No drops found matching that vibe.</h2>
              <Link href="/products" className="text-brand-primary font-black uppercase text-[10px] tracking-widest hover:underline">
                View All Products
              </Link>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}