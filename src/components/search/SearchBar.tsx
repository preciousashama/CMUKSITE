'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { products } from '@/lib/data';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setTotalCount(0);
      return;
    }

    const term = debouncedQuery.toLowerCase();
    const allMatches = products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term)
    );

    setTotalCount(allMatches.length);
    setResults(allMatches.slice(0, 5));
    setIsOpen(true);
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = useCallback((product: any) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/products/${product.id}`);
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={searchRef}>
      <div className="relative group">
        <Search 
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors" 
          size={18} 
        />
        <input
          type="search"
          className="w-full bg-white border-2 border-slate-100 focus:border-brand-dark rounded-full py-4 pl-14 pr-12 text-[11px] font-black uppercase tracking-widest outline-none transition-all shadow-sm focus:shadow-xl"
          placeholder="EXPLORE THE ARCHIVE..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          autoComplete="off"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-dark"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 w-full mt-4 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[100]"
          >
            <div className="p-2">
              {results.map((prod, idx) => (
                <div
                  key={prod.id}
                  className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all ${
                    idx === activeIndex ? 'bg-brand-dark text-white' : 'hover:bg-slate-50'
                  }`}
                  onClick={() => handleSelect(prod)}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
                    <Image
                      src={prod.image}
                      alt=""
                      fill
                      className={`object-cover ${idx === activeIndex ? 'grayscale-0' : 'grayscale'}`}
                    />
                  </div>
                  <div className="flex-grow">
                    <p className={`text-[11px] font-black uppercase italic tracking-tighter ${idx === activeIndex ? 'text-white' : 'text-brand-dark'}`}>
                      {prod.name}
                    </p>
                    <p className={`text-[9px] font-bold uppercase tracking-widest ${idx === activeIndex ? 'text-brand-primary' : 'text-slate-400'}`}>
                      {prod.category}
                    </p>
                  </div>
                  <div className="text-right pr-2">
                    <p className={`text-xs font-black ${idx === activeIndex ? 'text-white' : 'text-brand-dark'}`}>
                      £{prod.price}
                    </p>
                    {idx === activeIndex && <ArrowUpRight size={14} className="ml-auto mt-1 text-brand-primary" />}
                  </div>
                </div>
              ))}
            </div>

            {totalCount > 5 && (
              <button
                onClick={() => router.push(`/search?q=${query}`)}
                className="w-full py-4 bg-slate-50 text-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-brand-dark hover:bg-brand-primary transition-all border-t border-slate-100"
              >
                View Full Results ({totalCount})
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}