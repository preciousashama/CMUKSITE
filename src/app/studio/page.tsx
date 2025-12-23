'use client';

import React, { useState } from 'react';
import ThreeCanvas from '@/components/studio/ThreeCanvas';
import StudioControls from '@/components/studio/StudioControls';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Share2, Download, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function DesignStudioPage() {
  // 1. Centralized State for the Custom Design
  const [color, setColor] = useState('#ffffff');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [decalProps, setDecalProps] = useState({
    position: [0, 0.04, 0.15],
    rotation: [0, 0, 0],
    scale: 0.15,
  });

  // 2. Handlers to be passed to StudioControls
  const handleColorChange = (newColor: string) => setColor(newColor);
  const handleLogoUpload = (url: string | null) => setLogoUrl(url);
  const handleDecalChange = (props: any) => setDecalProps(props);

  return (
    <main className="relative min-h-screen bg-slate-50 overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="absolute top-0 left-0 w-full z-40 p-6 flex justify-between items-center">
        <Link 
          href="/products" 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-brand-dark transition-colors"
        >
          <ChevronLeft size={16} /> Exit Studio
        </Link>

        <div className="flex gap-4">
          <button className="p-3 bg-white rounded-full shadow-xl border border-slate-100 text-slate-400 hover:text-brand-dark transition-all">
            <Share2 size={18} />
          </button>
          <button className="p-3 bg-white rounded-full shadow-xl border border-slate-100 text-slate-400 hover:text-brand-dark transition-all">
            <Download size={18} />
          </button>
        </div>
      </nav>

      {/* Main Studio Layout */}
      <div className="flex flex-col lg:flex-row h-screen">
        
        {/* Left Side: The 3D Viewport */}
        <section className="flex-grow relative h-[60vh] lg:h-full lg:w-[calc(100%-384px)]">
          <div className="w-full h-full flex items-center justify-center p-4 lg:p-20">
            <ThreeCanvas 
              color={color} 
              logoUrl={logoUrl} 
              decalProps={decalProps} 
            />
          </div>

          {/* Interactive Status Indicator */}
          <div className="absolute bottom-10 left-10 pointer-events-none hidden lg:block">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                Live_Render_Engine v1.0
              </span>
            </div>
          </div>
        </section>

        {/* Right Side: Control Sidebar */}
        <aside className="w-full lg:w-96 bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.02)] z-30">
          <StudioControls 
            currentColor={color}
            currentLogoUrl={logoUrl}
            currentDecalProps={decalProps}
            onColorChange={handleColorChange}
            onLogoUpload={handleLogoUpload}
            onDecalPropsChange={handleDecalChange}
          />
        </aside>
      </div>

      {/* Mobile Sticky Footer (Add to Bag) */}
      <div className="fixed bottom-0 left-0 w-full p-6 lg:hidden bg-white/80 backdrop-blur-md border-t border-slate-100 z-50">
        <button className="w-full bg-brand-dark text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3">
          <ShoppingBag size={18} />
          Save Design
        </button>
      </div>
    </main>
  );
}