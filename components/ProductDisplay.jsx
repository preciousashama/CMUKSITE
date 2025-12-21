'use client';

import React, { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { formatCurrency } from '../lib/utils';
import Link from 'next/link';

// We pass 'product' as a prop from the parent page component 
// which should handle the data fetching via the ID in the URL.
export default function ProductDisplay({ product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || 'White');
  const [quantity, setQuantity] = useState(1);

  if (!product) return <div className="p-20 text-center font-bold">Product not found.</div>;

  const handleAddToCart = () => {
    addToCart(product.id, quantity, {
      size: selectedSize,
      color: selectedColor,
      price: product.price,
      name: product.name,
      image: product.image
    });
    // Optional: Trigger a "Cart Sidebar" or toast notification here
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-16">
      
      {/* Left: Image Gallery */}
      <div className="space-y-4">
        <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
        {/* Thumbnails placeholder */}
        <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer opacity-50 hover:opacity-100" />
            ))}
        </div>
      </div>

      {/* Right: Purchase Controls */}
      <div className="flex flex-col justify-center">
        <nav className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
          <Link href="/products" className="hover:text-blue-600 transition-colors">Shop</Link> / {product.category}
        </nav>

        <h1 className="text-5xl font-black text-slate-900 leading-tight mb-2 uppercase italic tracking-tighter">
          {product.name}
        </h1>
        
        <p className="text-2xl font-black text-blue-600 mb-6">
          {formatCurrency(product.price)}
        </p>

        <div className="h-px bg-slate-100 w-full mb-8" />

        <p className="text-slate-500 leading-relaxed mb-8">
          {product.description || "Premium quality custom apparel. Designed for durability and style."}
        </p>

        {/* Size Selection */}
        <div className="mb-6">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Select Size</label>
          <div className="flex gap-3">
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 rounded-lg font-bold border-2 transition-all ${
                  selectedSize === size 
                  ? 'border-blue-600 bg-blue-50 text-blue-600' 
                  : 'border-slate-100 text-slate-400 hover:border-slate-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons Action Area */}
        <div className="flex flex-col gap-4 mt-4">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all transform hover:-translate-y-1 shadow-xl"
          >
            Add to Bag — {formatCurrency(product.price * quantity)}
          </button>
          
          <Link 
            href={`/designservice?baseId=${product.id}`}
            className="w-full border-2 border-blue-600 text-blue-600 text-center py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-50 transition-all"
          >
            Customize in 3D Studio 🎨
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-6 text-[10px] font-black text-slate-400 tracking-widest uppercase">
            <span className="flex items-center gap-2">🛡️ 2-Year Print Warranty</span>
            <span className="flex items-center gap-2">🚚 Fast UK Delivery</span>
        </div>
      </div>
    </div>
  );
}