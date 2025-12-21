'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../lib/CartContext';
import { formatCurrency } from '../lib/utils';
import { ChevronLeft, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';

export default function ProductDisplay({ product }) {
  const { addToCart } = useCart();
  
  // Guard clause for missing data
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-slate-400">Product not found.</p>
        <Link href="/products" className="text-blue-600 underline">Return to Shop</Link>
      </div>
    );
  }

  // State Management
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.image);

  // Derived Values
  const availableSizes = product.sizes || ['S', 'M', 'L', 'XL', 'XXL'];
  const totalPrice = useMemo(() => product.price * quantity, [product.price, quantity]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      quantity,
      attributes: {
        size: selectedSize,
        color: product.colors?.[0] || 'Default',
      }
    });
    // Implementation note: useCart should handle toast/ui feedback
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      {/* Breadcrumbs for SEO */}
      <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
        <Link href="/products" className="hover:text-blue-600 flex items-center gap-1">
          <ChevronLeft size={12} /> Shop
        </Link>
        <span>/</span>
        <span className="text-slate-900">{product.category}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
        
        {/* Left: Image Gallery with Next.js Optimization */}
        <section className="space-y-6">
          <div className="aspect-[4/5] relative bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 group">
            <Image 
              src={mainImage} 
              alt={product.name} 
              fill
              priority
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[product.image, ...(product.gallery || [])].map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setMainImage(img)}
                className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                  mainImage === img ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-100 opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`Preview ${idx}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* Right: Purchase Details */}
        <section className="flex flex-col">
          <header className="mb-8">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] uppercase italic tracking-tighter mb-4">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-4">
              <ins className="text-3xl font-black text-blue-600 no-underline">
                {formatCurrency(product.price)}
              </ins>
              {product.oldPrice && (
                <del className="text-xl text-slate-300 font-bold">
                  {formatCurrency(product.oldPrice)}
                </del>
              )}
            </div>
          </header>

          <div className="space-y-8">
            <div className="prose prose-slate prose-sm">
              <p className="text-slate-500 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {/* Size Selection - Accessible Radio Pattern */}
            <fieldset>
              <legend className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                Select Size
              </legend>
              <div className="flex flex-wrap gap-3" role="radiogroup">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    role="radio"
                    aria-checked={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3.5rem] h-14 px-4 rounded-xl font-black text-sm transition-all border-2 ${
                      selectedSize === size 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-slate-100 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Quantity Selector - Crucial for Bulk Orders */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
                Quantity
              </label>
              <div className="flex items-center gap-1 w-fit bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-white rounded-xl transition-colors text-slate-600"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-black text-slate-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-white rounded-xl transition-colors text-slate-600"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTA Actions */}
            <div className="flex flex-col gap-4 pt-4">
              <button 
                onClick={handleAddToCart}
                className="group relative w-full bg-slate-950 text-white py-6 rounded-2xl font-black uppercase tracking-widest overflow-hidden hover:bg-blue-600 transition-all active:scale-[0.98]"
              >
                <span className="relative z-10">Add to Bag — {formatCurrency(totalPrice)}</span>
              </button>
              
              <Link 
                href={`/designservice?baseId=${product.id}`}
                className="w-full border-2 border-blue-600 text-blue-600 text-center py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
              >
                Launch 3D Design Studio 🎨
              </Link>
            </div>

            {/* Trust Badges - Semantic List */}
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
              {[
                { icon: ShieldCheck, text: "2-Year Print Warranty" },
                { icon: Truck, text: "Free UK Delivery > £50" },
                { icon: RotateCcw, text: "30-Day Easy Returns" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[10px] font-black text-slate-400 tracking-widest uppercase">
                  <item.icon size={18} className="text-blue-600" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </article>
  );
}