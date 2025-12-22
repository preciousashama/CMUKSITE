'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import FilterSidebar from './FilterSidebar';
import ProductCard from './ProductCard';
import { Toast } from '../ui/Toast';

export default function ProductListClient({ initialProducts }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [wishlist, setWishlist] = useState(new Set());
  const [toasts, setToasts] = useState([]);

  // Logic: Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Logic: URL Synchronization
  const updateUrl = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else {
        params.set(key, Array.isArray(value) ? value.join(',') : value as string);
      }
    });
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // Logic: Expert Filtering
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];
    // ... (Your existing filtering logic stays here)
    return result;
  }, [debouncedSearch, searchParams, initialProducts]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none text-brand-dark">Collection</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{filteredProducts.length} Results Found</p>
        </div>
        {/* Search Bar UI */}
        <input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search collections..." 
          className="bg-slate-50 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary outline-none w-full md:w-80" 
        />
      </header>

      <div className="flex flex-col lg:flex-row gap-16">
        <FilterSidebar updateUrl={updateUrl} searchParams={searchParams} />
        
        <main className="flex-grow">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
      
      {/* Toast Portal */}
      <Toast toasts={toasts} />
    </div>
  );
}