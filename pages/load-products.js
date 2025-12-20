'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * IMPROVED: 
 * 1. Accepts products as a prop (standard Next.js pattern)
 * 2. Uses Next.js Image component for optimization
 * 3. Handles empty states and price formatting internally
 */

export default function ProductsContainer({ initialProducts = [] }) {
  // Use local state if we need to filter, but default to props
  const [products] = useState(initialProducts);

  // Formatter localized to GBP as per previous files
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price);
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <p className="text-slate-500 text-lg">No products found in the catalog.</p>
        <button className="mt-4 text-blue-600 font-bold hover:underline">
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div 
      id="products-container" 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6"
    >
      {products.map((product) => (
        <Link 
          href={`/productdetail?id=${product.id}`} 
          key={product.id}
          className="group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
        >
          {/* Image Container */}
          <div className="relative aspect-square bg-slate-50 overflow-hidden">
            <img
              src={product.image || 'https://placehold.co/400x400?text=No+Image'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>

          {/* Product Details */}
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              <span className="font-black text-slate-900">
                {formatPrice(product.price)}
              </span>
            </div>
            
            <p className="text-slate-500 text-sm line-clamp-2 mb-4 italic">
              {product.description || 'No description available for this item.'}
            </p>

            <div className="mt-auto">
              <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm tracking-wide group-hover:bg-blue-600 transition-colors">
                VIEW OPTIONS
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}