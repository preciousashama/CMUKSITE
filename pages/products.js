'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { products } from '../data/products';

/**
 * Expert Product Listing Page
 * Features: URL-synced state, Multi-threaded filtering, Search, 
 * Mobile-responsive sidebar, and Notification system.
 */

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- STATE ---
  const [productList] = useState(products || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState(new Set());
  const [toasts, setToasts] = useState([]);

  // --- URL STATE SYNC ---
  // We derive these directly from the URL to allow deep-linking
  const selectedCategories = searchParams.get('cat')?.split(',') || [];
  const selectedSizes = searchParams.get('size')?.split(',') || [];
  const selectedColors = searchParams.get('color')?.split(',') || [];
  const sortBy = searchParams.get('sort') || '';
  const itemsPerPage = Number(searchParams.get('limit')) || 12;
  const currentPage = Number(searchParams.get('page')) || 1;

  // Generic URL Update Handler
  const updateUrl = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else {
        params.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    });
    // Always reset to page 1 when changing filters
    if (!updates.page) params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // --- FILTER LOGIC ---
  const filteredProducts = useMemo(() => {
    let result = [...productList];

    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    // 2. Category Filter
    if (selectedCategories.length) {
      result = result.filter(p => {
        const pCats = Array.isArray(p.category) ? p.category : [p.category];
        return pCats.some(c => selectedCategories.includes(c));
      });
    }

    // 3. Size Filter
    if (selectedSizes.length) {
      result = result.filter(p => {
        const pSizes = Array.isArray(p.size) ? p.size : [p.size];
        return pSizes.some(s => selectedSizes.includes(s));
      });
    }

    // 4. Color Filter
    if (selectedColors.length) {
      result = result.filter(p => {
        const pCols = p.colors || (p.color ? [p.color] : []);
        return pCols.some(c => selectedColors.includes(c));
      });
    }

    // 5. Sorting
    const sortMethods = {
      'price-low': (a, b) => a.price - b.price,
      'price-high': (a, b) => b.price - a.price,
      'name': (a, b) => a.name.localeCompare(b.name),
      'newest': (a, b) => b.id - a.id // Assuming higher ID is newer
    };
    if (sortMethods[sortBy]) result.sort(sortMethods[sortBy]);

    return result;
  }, [productList, searchQuery, selectedCategories, selectedSizes, selectedColors, sortBy]);

  // --- PAGINATION ---
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // --- HANDLERS ---
  const toggleFilter = (key, currentValues, value) => {
    const next = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateUrl({ [key]: next });
  };

  const showNotification = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleWishlist = (id) => {
    setWishlist(prev => {
      const next = new Set(prev);
      const isRemoving = next.has(id);
      isRemoving ? next.delete(id) : next.add(id);
      showNotification(isRemoving ? "Removed from wishlist" : "Added to wishlist");
      return next;
    });
  };

  // --- DERIVED METADATA ---
  const filterOptions = useMemo(() => {
    const getOptions = (key, arrayKey) => {
      const set = new Set();
      productList.forEach(p => {
        const vals = Array.isArray(p[arrayKey || key]) ? p[arrayKey || key] : [p[arrayKey || key]];
        vals.forEach(v => v && set.add(v));
      });
      return [...set].sort();
    };
    return {
      categories: getOptions('category'),
      sizes: getOptions('size'),
      colors: getOptions('colors', 'colors') // Handling your 'colors' vs 'color' data
    };
  }, [productList]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Collection</h1>
          <p className="text-slate-500">{filteredProducts.length} items found</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <input 
            type="text" 
            placeholder="Search products..."
            className="px-4 py-2 border rounded-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            value={sortBy} 
            onChange={(e) => updateUrl({ sort: e.target.value })}
            className="p-2 border rounded-lg bg-white outline-none cursor-pointer"
          >
            <option value="">Sort By: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Filters</h2>
            <button 
              onClick={() => router.push(pathname)}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          <FilterGroup 
            title="Categories" 
            options={filterOptions.categories} 
            selected={selectedCategories} 
            onToggle={(val) => toggleFilter('cat', selectedCategories, val)} 
          />

          <FilterGroup 
            title="Sizes" 
            options={filterOptions.sizes} 
            selected={selectedSizes} 
            onToggle={(val) => toggleFilter('size', selectedSizes, val)} 
          />

          <FilterGroup 
            title="Colors" 
            options={filterOptions.colors} 
            selected={selectedColors} 
            onToggle={(val) => toggleFilter('color', selectedColors, val)} 
          />
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {paginated.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
              <p className="text-xl text-slate-400">No products match your criteria.</p>
              <button onClick={() => router.push(pathname)} className="mt-4 text-blue-600 font-bold">Reset Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {paginated.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isWishlisted={wishlist.has(product.id)}
                    onWishlist={() => handleWishlist(product.id)}
                    onView={() => router.push(`/productdetail?id=${product.id}`)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => updateUrl({ page: i + 1 })}
                      className={`w-10 h-10 rounded-lg font-bold transition-all 
                        ${currentPage === i + 1 
                          ? 'bg-slate-900 text-white' 
                          : 'bg-white text-slate-600 hover:bg-slate-100 border'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Toast Portal */}
      <div className="fixed bottom-6 right-6 space-y-3 z-[100]">
        {toasts.map(t => (
          <div key={t.id} className="bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-right-full">
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FilterGroup({ title, options, selected, onToggle }) {
  if (options.length === 0) return null;
  return (
    <div className="border-b pb-6">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">{title}</h3>
      <div className="space-y-3">
        {options.map(opt => (
          <label key={opt} className="flex items-center group cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
            />
            <span className={`ml-3 text-sm transition-colors ${selected.includes(opt) ? 'text-slate-900 font-bold' : 'text-slate-500 group-hover:text-slate-700'}`}>
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, isWishlisted, onWishlist, onView }) {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border transition-all hover:shadow-xl">
      <div className="aspect-square bg-slate-100 overflow-hidden relative cursor-pointer" onClick={onView}>
        <img 
          src={product.image || 'https://placehold.co/400x400'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button 
          onClick={(e) => { e.stopPropagation(); onWishlist(); }}
          className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-all 
            ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-slate-400 hover:text-red-500'}`}
        >
          {isWishlisted ? '❤️' : '♡'}
        </button>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
        <p className="text-blue-600 font-black text-xl mb-4">£{product.price.toFixed(2)}</p>
        <button 
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
          onClick={(e) => { e.stopPropagation(); /* cart logic */ }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}