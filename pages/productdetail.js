'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../lib/CartContext';
import { formatCurrency } from '../lib/utils'; // Using the utility we created earlier

// 3D Engine with specific fallback for SEO
const ThreeCanvas = dynamic(() => import('../components/ThreeCanvas'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-50 animate-pulse flex items-center justify-center text-slate-300 font-black italic">INITIALIZING 3D ENGINE...</div>
});

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export default function ProductDetail({ initialProduct }) {
  const { addToCart } = useCart();
  
  // 1. Unified Configuration State
  const [config, setConfig] = useState({
    color: { name: 'Pitch Black', hex: '#000000' },
    quantities: SIZES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {}),
    artwork: null, // Stores { file, previewUrl, scale, position }
    placement: 'center'
  });

  // 2. Business Logic: Bulk Discount Tiers
  const totalQty = useMemo(() => Object.values(config.quantities).reduce((a, b) => a + b, 0), [config.quantities]);
  
  const unitPrice = useMemo(() => {
    let price = initialProduct?.price || 24.99;
    if (totalQty >= 50) price *= 0.80; // 20% off for 50+
    else if (totalQty >= 12) price *= 0.90; // 10% off for 12+
    return price;
  }, [totalQty, initialProduct]);

  // 3. Handlers
  const handleQtyChange = (size, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    setConfig(prev => ({ ...prev, quantities: { ...prev.quantities, [size]: val } }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setConfig(prev => ({ ...prev, artwork: { file, previewUrl } }));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden">
      
      {/* VISUALIZER SECTION */}
      <section className="w-full lg:w-2/3 relative bg-[#f8f9fa] border-r border-slate-100">
        <div className="absolute inset-0">
          <ThreeCanvas 
            color={config.color.hex} 
            logoUrl={config.artwork?.previewUrl} 
            placement={config.placement}
          />
        </div>

        {/* Brand Overlay */}
        <div className="absolute top-10 left-10 pointer-events-none">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">CustomiseMe UK Studio</h2>
          <div className="h-[2px] w-12 bg-blue-600 mt-2" />
        </div>

        {/* Dynamic Pricing Badge */}
        <AnimatePresence shadow>
          {totalQty > 0 && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              className="absolute bottom-10 left-10 bg-slate-900 text-white p-6 rounded-3xl shadow-2xl"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Live Estimate</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black italic tracking-tighter">{formatCurrency(unitPrice * totalQty)}</span>
                {totalQty >= 12 && <span className="text-xs text-green-400 font-bold">Bulk Applied</span>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* CONFIGURATION SIDEBAR */}
      <section className="w-full lg:w-1/3 overflow-y-auto px-8 py-12 lg:px-12 scrollbar-hide">
        <header className="mb-12">
          <span className="text-blue-600 font-bold uppercase text-[10px] tracking-widest">{initialProduct.category}</span>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none mt-2">{initialProduct.name}</h1>
          <p className="mt-4 text-slate-500 leading-relaxed text-sm">{initialProduct.description}</p>
        </header>

        <div className="space-y-12">
          {/* STEP 1: COLOR */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phase 01: Garment Color</h4>
            <div className="flex flex-wrap gap-3">
              {['#000000', '#FFFFFF', '#2563eb', '#dc2626'].map(hex => (
                <button
                  key={hex}
                  onClick={() => setConfig(prev => ({ ...prev, color: { hex } }))}
                  className={`w-12 h-12 rounded-2xl transition-all duration-300 ${config.color.hex === hex ? 'ring-4 ring-blue-100 scale-110 shadow-lg' : 'opacity-80'}`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          {/* STEP 2: ARTWORK */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phase 02: Brand Identity</h4>
            <div className="relative group">
              <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center transition-all group-hover:border-blue-500 group-hover:bg-blue-50/50">
                {config.artwork ? (
                  <div className="flex items-center justify-center gap-4">
                    <img src={config.artwork.previewUrl} className="w-12 h-12 object-contain rounded-lg" />
                    <span className="text-xs font-black uppercase tracking-widest">Artwork Loaded</span>
                  </div>
                ) : (
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600">Drop Logo File</span>
                )}
              </div>
            </div>
          </div>

          {/* STEP 3: QUANTITIES */}
          <div className="space-y-4 pb-24">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phase 03: Inventory Selection</h4>
            <div className="grid grid-cols-4 gap-2">
              {SIZES.map(size => (
                <div key={size} className="space-y-2">
                  <div className="text-[10px] font-black text-center">{size}</div>
                  <input 
                    type="number" 
                    value={config.quantities[size]} 
                    onChange={(e) => handleQtyChange(size, e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-center text-sm font-black focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PERSISTENT ACTION FOOTER */}
        <div className="fixed bottom-0 right-0 w-full lg:w-1/3 bg-white/90 backdrop-blur-md p-8 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Unit Price</p>
            <p className="text-xl font-black italic">{formatCurrency(unitPrice)}</p>
          </div>
          <button 
            disabled={totalQty === 0}
            onClick={() => addToCart(initialProduct, config)}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-xl shadow-blue-100"
          >
            Confirm Order
          </button>
        </div>
      </section>
    </div>
  );
}