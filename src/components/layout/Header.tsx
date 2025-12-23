'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ShoppingBasket, Heart, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/lib/data';

// Debounce hook remains the same (essential for performance)
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Header() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchTerm('');
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (debouncedSearch.length < 2) return [];
    const s = debouncedSearch.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(s) || p.category?.toLowerCase().includes(s)
    ).slice(0, 5);
  }, [debouncedSearch]);

  const navItems = [
    { label: 'Drops', href: '/products' },
    { label: 'Design Studio', href: '/designservice' },
    { label: 'Send Items In', href: '/send-in' },
    { label: 'The Archive', href: '/gallery' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100" role="banner">
      {/* Announcement Bar - High Contrast */}
      <div className="bg-brand-dark text-white text-[9px] font-black tracking-[0.3em] py-2 text-center uppercase">
        Next Drop: <span className="text-brand-primary">Custom Utility Jackets</span> — Jan 2026
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* Logo - Bold & Italic */}
          <Link href="/" className="flex-shrink-0 transition-transform active:scale-95">
             <h1 className="text-2xl font-black italic uppercase tracking-tighter text-brand-dark leading-none">
                CMUK<span className="text-brand-primary">.</span>
             </h1>
          </Link>

          {/* Desktop Nav - Centered */}
          <nav className="hidden lg:block">
            <ul className="flex gap-8">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-dark transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Search Engine */}
          <div className="hidden md:block flex-grow max-w-xs relative" ref={searchRef}>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors" size={16} />
              <input
                type="search"
                placeholder="SEARCH ARCHIVE..."
                className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-6 text-[10px] font-black tracking-widest focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.ul 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-[400px] bg-white mt-4 shadow-2xl rounded-2xl border border-slate-100 overflow-hidden"
                  >
                    {searchResults.map(product => (
                      <li key={product.id}>
                        <Link href={`/products/${product.id}`} className="flex items-center gap-4 p-3 hover:bg-slate-50" onClick={() => setSearchTerm('')}>
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100">
                            <Image src={product.image} alt="" fill className="object-cover grayscale hover:grayscale-0" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase italic tracking-tighter">{product.name}</span>
                            <span className="text-[9px] text-brand-primary font-black uppercase">{product.category}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/wishlist" className="p-2 text-slate-400 hover:text-brand-dark transition-colors hidden sm:block">
              <Heart size={20} />
            </Link>

            <Link href="/cart" className="relative p-2 text-brand-dark group">
              <ShoppingBasket size={22} />
              <span className="absolute top-0 right-0 bg-brand-primary text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                2
              </span>
            </Link>

            {status === 'authenticated' ? (
              <Link href="/account" className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-[10px] font-black uppercase">
                {session.user?.name?.[0]}
              </Link>
            ) : (
              <button className="lg:hidden p-2 text-brand-dark" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24} />
              </button>
            )}
            
            <Link href="/login" className="hidden lg:block text-[9px] font-black uppercase tracking-widest border-2 border-brand-dark px-6 py-2.5 rounded-full hover:bg-brand-dark hover:text-white transition-all">
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Simplified for space) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 z-[100] bg-brand-dark p-8 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">Menu<span className="text-brand-primary">.</span></h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white"><X size={32}/></button>
            </div>
            <ul className="space-y-8">
              {navItems.map(item => (
                <li key={item.label}>
                  <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="text-5xl font-black uppercase italic tracking-tighter text-white hover:text-brand-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">© 2026 CMUK COLLECTIVE</p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}