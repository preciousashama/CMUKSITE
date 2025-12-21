'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Optimized Next.js Image component
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ShoppingBasket, Heart, Search, Menu, X, User } from 'lucide-react'; // Accessible icon library
import { products } from '../data/products';

// Custom hook for debouncing search input
function useDebounce(value, delay) {
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
  const searchRef = useRef(null);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchTerm('');
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
    { label: 'T-shirts', href: '/products?category=t-shirts' },
    { label: 'Hoodies', href: '/products?category=hoodies' },
    { label: 'Accessories', href: '/products?category=accessories' },
    { label: 'Design Studio', href: '/designservice' },
    { label: 'Gallery', href: '/gallery' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm" role="banner">
      {/* Announcement Bar */}
      <div className="bg-slate-950 text-white text-[10px] sm:text-xs font-bold tracking-[0.2em] py-2.5 text-center uppercase px-4">
        Free Shipping on UK orders over £150
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-slate-600" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 transition-opacity hover:opacity-80">
            <Image 
              src="/assets/icon.png" 
              alt="CustomiseMe UK Logo" 
              width={120} 
              height={40} 
              className="h-8 sm:h-10 w-auto object-contain"
              priority 
            />
          </Link>

          {/* Search Engine - Wrapped in ref for click-away */}
          <div className="hidden md:block flex-grow max-w-md relative" ref={searchRef}>
            <div className="relative">
              <label htmlFor="desktop-search" className="sr-only">Search products</label>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                id="desktop-search"
                type="search"
                placeholder="Search custom designs..."
                className="w-full bg-slate-50 border-transparent rounded-full py-2.5 pl-12 pr-6 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none border border-slate-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
              />
              
              {/* Search Dropdown with ARIA */}
              {searchResults.length > 0 && (
                <ul 
                  className="absolute top-full left-0 w-full bg-white mt-3 shadow-2xl rounded-2xl border border-slate-100 overflow-hidden ring-1 ring-black ring-opacity-5"
                  role="listbox"
                >
                  {searchResults.map(product => (
                    <li key={product.id} role="option">
                      <Link 
                        href={`/productdetail?id=${product.id}`}
                        className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none"
                        onClick={() => setSearchTerm('')}
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={product.image} alt="" fill className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{product.name}</span>
                          <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{product.category}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Utilities */}
          <div className="flex items-center gap-2 sm:gap-5">
            <Link href="/wishlist" aria-label="View Wishlist" className="p-2 text-slate-600 hover:text-blue-600 transition-colors hidden sm:block">
              <Heart size={22} />
            </Link>

            <Link href="/cart" aria-label="View Shopping Basket" className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
              <ShoppingBasket size={22} />
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                0
              </span>
            </Link>

            {status === 'authenticated' ? (
              <Link href="/account" className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-slate-200 ml-2">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs font-black uppercase ring-1 ring-blue-100">
                  {session.user?.name?.[0]}
                </div>
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Category Navigation */}
      <nav className="border-t border-slate-50 hidden lg:block bg-white" aria-label="Main Navigation">
        <ul className="flex justify-center gap-10 py-3.5">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link 
                href={item.href}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white p-6 animate-in slide-in-from-left duration-300">
          <div className="flex justify-between items-center mb-8">
            <span className="font-black italic uppercase tracking-tighter text-xl">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)}><X size={28} /></button>
          </div>
          <ul className="space-y-6">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link 
                  href={item.href} 
                  className="text-2xl font-black uppercase italic tracking-tighter text-slate-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}