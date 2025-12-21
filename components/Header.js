'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { products } from '../data/products';

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  // Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // Currency States
  const [currency, setCurrency] = useState({ code: 'GBP', symbol: '£' });
  const [showCurrency, setShowCurrency] = useState(false);

  // Optimized Search: Only runs when searchTerm changes
  const searchResults = useMemo(() => {
    if (searchTerm.length < 2) return [];
    const s = searchTerm.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(s) || p.category?.toLowerCase().includes(s)
    ).slice(0, 5);
  }, [searchTerm]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* 1. Announcement Bar */}
      <div className="bg-slate-900 text-white text-[10px] font-bold tracking-[0.2em] py-2 text-center uppercase">
        Free Shipping on orders over £150
      </div>

      {/* 2. Main Navigation */}
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img src="/assets/icon.png" alt="CMUK" className="h-10 w-auto object-contain" />
        </Link>

        {/* Dynamic Search Bar */}
        <div className="hidden md:block flex-grow max-w-md relative">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search designs..."
              className="w-full bg-slate-50 border-none rounded-full py-2.5 px-6 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {/* Search Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white mt-2 shadow-2xl rounded-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                {searchResults.map(product => (
                  <Link 
                    key={product.id} 
                    href={`/productdetail?id=${product.id}`}
                    onClick={() => setSearchTerm('')}
                    className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b last:border-none"
                  >
                    <img src={product.image} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-400 uppercase">{product.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-6">
          {/* Currency Switcher */}
          <div className="relative">
             <button 
              onClick={() => setShowCurrency(!showCurrency)}
              className="flex flex-col items-center group"
             >
                <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-600 transition-colors">CURRENCY</span>
                <span className="text-xs font-bold">{currency.code}</span>
             </button>
          </div>

          <Link href="/wishlist" className="relative group">
            <img src="/assets/heart.png" className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </Link>

          <Link href="/cart" className="relative group">
            <img src="/assets/Basketicon.png" className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              0
            </span>
          </Link>

          {/* Auth State */}
          {status === 'authenticated' ? (
            <Link href="/account" className="flex items-center gap-2 pl-4 border-l border-slate-100">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 uppercase">
                {session.user?.name?.[0]}
              </div>
              <span className="hidden lg:block text-xs font-bold text-slate-900">
                {session.user?.name?.split(' ')[0]}
              </span>
            </Link>
          ) : (
            <Link href="/login" className="text-xs font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* 3. Category Bar */}
      <nav className="border-t border-slate-50 hidden lg:block">
        <ul className="flex justify-center gap-10 py-4">
          {['T-shirts', 'Hoodies', 'Accessories', 'Design Studio', 'Gallery'].map((item) => (
            <li key={item}>
              <Link 
                href={item === 'Design Studio' ? '/designservice' : `/products?category=${item.toLowerCase()}`}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}