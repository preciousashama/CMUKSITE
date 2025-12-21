'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Updated for Next.js 13+
import Image from 'next/image';
import products from '../data/products';
import { useDebounce } from '../hooks/useDebounce'; // Custom hook recommended

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  
  const router = useRouter();
  const searchRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300); // 300ms delay

  // Handle Search Logic
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setTotalCount(0);
      return;
    }

    const term = debouncedQuery.toLowerCase();
    const allMatches = products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );

    setTotalCount(allMatches.length);
    setResults(allMatches.slice(0, 6)); // Show fewer for cleaner UI
    setIsOpen(true);
  }, [debouncedQuery]);

  // Click Outside to Close
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = useCallback((product) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/product/${product.id}`);
  }, [router]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) handleSelect(results[activeIndex]);
        else if (results.length > 0) handleSelect(results[0]);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative w-full max-w-lg" ref={searchRef}>
      <form 
        role="search"
        onSubmit={e => e.preventDefault()}
        className="relative"
      >
        <input
          id="search-input"
          type="search"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-activedescendant={activeIndex >= 0 ? `result-item-${activeIndex}` : undefined}
          className="w-full bg-slate-100 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-3 px-5 text-sm outline-none transition-all font-medium"
          placeholder="Search apparel, designs..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          autoComplete="off"
        />
      </form>

      {isOpen && results.length > 0 && (
        <div 
          id="search-results"
          role="listbox"
          className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2"
        >
          {results.map((prod, idx) => (
            <div
              key={prod.id}
              id={`result-item-${idx}`}
              role="option"
              aria-selected={idx === activeIndex}
              className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${
                idx === activeIndex ? 'bg-blue-50' : 'hover:bg-slate-50'
              }`}
              onClick={() => handleSelect(prod)}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                <Image
                  src={prod.image || '/placeholder.png'}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-bold text-slate-900">{prod.name}</p>
                <p className="text-xs text-slate-400 uppercase tracking-tighter">{prod.category}</p>
              </div>
              <span className="text-sm font-black text-blue-600">£{prod.price.toFixed(2)}</span>
            </div>
          ))}

          {totalCount > 6 && (
            <button
              onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}
              className="w-full p-4 bg-slate-50 text-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors border-t border-slate-100"
            >
              See all {totalCount} results
            </button>
          )}
        </div>
      )}
    </div>
  );
}