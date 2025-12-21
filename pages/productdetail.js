'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../lib/CartContext';
import { formatCurrency } from '../lib/utils';

// 3D Engine with specific fallback
const ThreeCanvas = dynamic(() => import('../components/ThreeCanvas'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-50 flex flex-col items-center justify-center text-slate-300">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
      <span className="font-black italic text-xs tracking-widest uppercase">Initializing 3D Engine</span>
    </div>
  )
});

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export default function ProductDetail({ initialProduct = { name: 'Loading...', price: 24.99, category: 'Apparel' } }) {
  const { addToCart } = useCart();
  
  // 1. Core State
  const [config, setConfig] = useState({
    color: { name: 'Pitch Black', hex: '#000000' },
    quantities: SIZES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {}),
    artwork: null,
    placement: 'center'
  });

  // 2. Cleanup Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (config.artwork?.previewUrl) URL.revokeObjectURL(config.artwork.previewUrl);
    };
  }, [config.artwork?.previewUrl]);

  // 3. Price Calculation Logic
  const totalQty = useMemo(() => 
    Object.values(config.quantities).reduce((a, b) => a + b, 0), 
  [config.quantities]);
  
  const discountInfo = useMemo(() => {
    let price = initialProduct.price;
    let label = "";
    if (totalQty >= 50) {
      price *= 0.80;
      label = "20% Bulk Discount";
    } else if (totalQty >= 12) {
      price *= 0.90;
      label = "10% Bulk Discount";
    }
    return { unitPrice: price, label };
  }, [totalQty, initialProduct.price]);

  // 4. Handlers
  const handleQtyChange = useCallback((size, value) => {
    const val = Math.max(0, Math.min(999, parseInt(value) || 0));
    setConfig(prev => ({ 
      ...prev, 
      quantities: { ...prev.quantities, [size]: val } 
    }));
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (config.artwork?.previewUrl) URL.revokeObjectURL(config.artwork.previewUrl);
      const previewUrl = URL.createObjectURL(file);
      setConfig(prev => ({ ...prev, artwork: { file, previewUrl } }));
    }
  };

  const onConfirm = () => {
    if (totalQty === 0) return;
    
    // Structure data to match your CartContext requirements
    const options = {
      color: config.color,
      artwork: config.artwork?.previewUrl,
      sizeBreakdown: config.quantities,
      unitPrice: discountInfo.unitPrice
    };

    addToCart(initialProduct.id, totalQty, options);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden">
      
      {/* VISUALIZER SECTION */}
      <section className="w-full lg:w-2/3 relative bg-[#fcfcfc] border-r border-slate-100">
        <ThreeCanvas 
          color={config.color.hex} 
          logoUrl={config.artwork?.previewUrl} 
          placement={config.placement}
        />

        <div className="absolute top-10 left-10 pointer-events-none">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">CustomiseMe UK Studio</h2>
          <div className="h-[2px] w-12 bg-blue-600 mt-2" />
        </div>

        <AnimatePresence>
          {totalQty > 0 && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="absolute bottom-10 left-10 bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl border border-white/10"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Live Estimate</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black italic tracking-tighter">
                  {formatCurrency(discountInfo.unitPrice * totalQty)}
                </span>
                {discountInfo.label && (
                  <span className="text-[10px] px-2 py-1 bg-green-500/20 text-green-400 rounded-md font-black uppercase">
                    {discountInfo.label}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* CONFIGURATION SIDEBAR */}
      <section className="w-full lg:w-1/3 overflow-y-auto px-8 py-12 lg:px-12 bg-white">
        <header className="mb-10">
          <span className="text-blue-600 font-bold uppercase text-[10px] tracking-widest">{initialProduct.category}</span>
          <h1 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-none mt-2">{initialProduct.name}</h1>
        </header>

        <div className="space-y-10">
          {/* STEP 1: COLOR */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phase 01: Colorway</h4>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Pitch Black', hex: '#000000' },
                { name: 'Arctic White', hex: '#FFFFFF' },
                { name: 'Royal Blue', hex: '#2563eb' },
                { name: 'Crimson', hex: '#dc2626' }
              ].map(c => (
                <button
                  key={c.hex}
                  onClick={() => setConfig(prev => ({ ...prev, color: c }))}
                  className={`w-12 h-12 rounded-2xl transition-all duration-300 border-2 ${config.color.hex === c.hex ? 'border-blue-600 scale-110 shadow-lg' : 'border-transparent'}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{config.color.name}</p>
          </div>

          {/* STEP 2: ARTWORK */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phase 02: Branding</h4>
            <div className="relative group">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center transition-all group-hover:border-blue-500 group-hover:bg-blue-50/50">
                {config.artwork ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={config.artwork.previewUrl} className="w-16 h-16 object-contain rounded-lg shadow-sm" alt="Preview" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Swap Artwork</span>
                  </div>
                ) : (
                  <div className="py-4">
                    <span className="text-3xl block mb-2">📤</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Logo (PNG/SVG)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* STEP 3: QUANTITIES */}
          <div className="space-y-4 pb-32">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phase 03: Sizing & Volume</h4>
            <div className="grid grid-cols-4 gap-3">
              {SIZES.map(size => (
                <div key={size} className="space-y-1">
                  <div className="text-[9px] font-black text-center text-slate-400 uppercase">{size}</div>
                  <input 
                    type="number" 
                    min="0"
                    value={config.quantities[size]} 
                    onChange={(e) => handleQtyChange(size, e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-3 text-center text-sm font-black focus:bg-white focus:border-blue-600 transition-all outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PERSISTENT ACTION FOOTER */}
        <div className="fixed bottom-0 right-0 w-full lg:w-1/3 bg-white/80 backdrop-blur-xl p-8 border-t border-slate-100 flex items-center justify-between z-20">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Unit Price</p>
            <p className="text-2xl font-black italic">{formatCurrency(discountInfo.unitPrice)}</p>
          </div>
          <button 
            disabled={totalQty === 0}
            onClick={onConfirm}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-600 disabled:bg-slate-100 disabled:text-slate-300 transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            Confirm Order
          </button>
        </div>
      </section>
    </div>
  );
}