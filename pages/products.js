'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [wishlist, setWishlist] = useState(new Set());
  const [toasts, setToasts] = useState([]);

  // 1. Search Debounce Logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. URL State Derivation
  const selectedCategories = useMemo(() => searchParams.get('cat')?.split(',') || [], [searchParams]);
  const selectedSizes = useMemo(() => searchParams.get('size')?.split(',') || [], [searchParams]);
  const selectedColors = useMemo(() => searchParams.get('color')?.split(',') || [], [searchParams]);
  const sortBy = searchParams.get('sort') || '';
  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = 12;

  const updateUrl = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else {
        params.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    });
    if (!updates.page) params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // 3. Expert Filter Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    if (selectedCategories.length) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedSizes.length) {
      result = result.filter(p => p.size?.some(s => selectedSizes.includes(s)));
    }

    const sortMethods = {
      'price-low': (a, b) => a.price - b.price,
      'price-high': (a, b) => b.price - a.price,
      'name': (a, b) => a.name.localeCompare(b.name),
    };
    if (sortMethods[sortBy]) result.sort(sortMethods[sortBy]);

    return result;
  }, [debouncedSearch, selectedCategories, selectedSizes, sortBy]);

  const paginated = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleWishlist = (id) => {
    setWishlist(prev => {
      const next = new Set(prev);
      const removing = next.has(id);
      removing ? next.delete(id) : next.add(id);
      
      const idToast = Date.now();
      setToasts(t => [...t, { id: idToast, message: removing ? "Removed from Wishlist" : "Added to Wishlist" }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== idToast)), 3000);
      
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header with Glassmorphism Search */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">The Collection</h1>
          <p className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">Showing {filteredProducts.length} Results</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <input 
              type="text" 
              placeholder="Search apparel..."
              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="bg-slate-900 text-white rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-blue-600 transition-colors"
            value={sortBy}
            onChange={(e) => updateUrl({ sort: e.target.value })}
          >
            <option value="">Sort: Newest</option>
            <option value="price-low">Price: Low</option>
            <option value="price-high">Price: High</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Modern Filter Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-10">
           <FilterSection 
             title="Style" 
             options={['T-Shirts', 'Hoodies', 'Sweatshirts']} 
             selected={selectedCategories} 
             onToggle={(v) => {
               const next = selectedCategories.includes(v) ? selectedCategories.filter(x => x !== v) : [...selectedCategories, v];
               updateUrl({ cat: next });
             }}
           />
           <FilterSection 
             title="Sizes" 
             options={['S', 'M', 'L', 'XL', 'XXL']} 
             selected={selectedSizes} 
             onToggle={(v) => {
                const next = selectedSizes.includes(v) ? selectedSizes.filter(x => x !== v) : [...selectedSizes, v];
                updateUrl({ size: next });
             }}
           />
        </aside>

        {/* Product Grid with AnimatePresence */}
        <main className="flex-grow">
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12"
          >
            <AnimatePresence mode="popLayout">
              {paginated.map((product, idx) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={idx}
                  isLiked={wishlist.has(product.id)}
                  onWishlist={() => handleWishlist(product.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-20 flex justify-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateUrl({ page: i + 1 })}
                  className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Toast Portal */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3"
            >
              <span className="text-blue-400">●</span> {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Sub Components ---

function FilterSection({ title, options, selected, onToggle }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">{title}</h4>
      <div className="flex flex-col gap-3">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`flex items-center gap-3 text-sm font-bold transition-all ${selected.includes(opt) ? 'text-blue-600 translate-x-1' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <div className={`w-2 h-2 rounded-full ${selected.includes(opt) ? 'bg-blue-600' : 'bg-slate-200'}`} />
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, index, isLiked, onWishlist }) {
  const router = useRouter();
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="relative aspect-[4/5] bg-slate-50 rounded-[2.5rem] overflow-hidden mb-6 cursor-pointer" onClick={() => router.push(`/productdetail?id=${product.id}`)}>
        <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
        <button 
          onClick={(e) => { e.stopPropagation(); onWishlist(); }}
          className={`absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all ${isLiked ? 'bg-red-500 text-white shadow-lg' : 'bg-white/80 text-slate-900 hover:bg-white'}`}
        >
          {isLiked ? '❤️' : '♡'}
        </button>
      </div>
      <div>
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-black uppercase italic tracking-tighter text-xl text-slate-900">{product.name}</h3>
          <span className="font-black text-blue-600 italic">£{product.price}</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{product.category}</p>
      </div>
    </motion.div>
  );
}