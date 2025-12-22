'use client';
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DesignCanvas from '../three/DesignCanvas';

const STEPS = [
  { id: 1, title: 'Studio', subtitle: '3D Configurator' },
  { id: 2, title: 'Discovery', subtitle: 'Strategy Call' },
  { id: 3, title: 'Review', subtitle: 'Artboard Drafts' },
  { id: 4, title: 'Delivery', subtitle: 'Final Assets' },
];

export default function DesignPipeline() {
  const [step, setStep] = useState(1);
  const [color, setColor] = useState('#ffffff');
  const [logo, setLogo] = useState<string | null>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.includes('image')) {
      if (logo) URL.revokeObjectURL(logo);
      setLogo(URL.createObjectURL(file));
    }
  }, [logo]);

  return (
    <div className="flex flex-col h-screen">
      {/* Step Nav - Preserving your design */}
      <nav className="h-20 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200">CM</div>
           <h1 className="text-sm font-black uppercase tracking-tighter text-brand-dark hidden md:block">Design Pipeline</h1>
        </div>
        
        <div className="flex gap-4">
          {STEPS.map(s => (
            <div key={s.id} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-colors ${step >= s.id ? 'bg-brand-dark border-brand-dark text-white' : 'border-slate-200 text-slate-300'}`}>
              {step > s.id ? '✓' : s.id}
            </div>
          ))}
        </div>

        <button 
          onClick={() => setStep(s => Math.min(s + 1, 4))}
          className="bg-brand-dark text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all"
        >
          Next Phase →
        </button>
      </nav>

      {/* Workspace */}
      <main className="flex-1 grid lg:grid-cols-12 overflow-hidden">
        {/* Left: 3D Viewport */}
        <section className="lg:col-span-8 relative bg-slate-50">
          <DesignCanvas color={color} logoUrl={logo} />
          
          {/* Color Picker Overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 bg-white/80 backdrop-blur p-3 rounded-3xl border border-white shadow-xl">
            {['#ffffff', '#0f172a', '#2563eb', '#dc2626', '#eab308'].map(c => (
              <button 
                key={c} 
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-10 h-10 rounded-xl border-2 transition-transform hover:scale-110 ${color === c ? 'border-brand-primary' : 'border-transparent'}`}
              />
            ))}
          </div>
        </section>

        {/* Right: Controls */}
        <aside className="lg:col-span-4 bg-white p-10 border-l overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Phase 01</span>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-brand-dark mb-8">Studio <span className="text-brand-primary">Draft</span></h2>
                
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-slate-200 rounded-4xl p-10 text-center hover:border-brand-primary transition-colors relative">
                    <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <p className="text-xs font-black uppercase tracking-widest">Drop Artwork Here</p>
                  </div>
                  
                  <div className="bg-brand-dark rounded-3xl p-6 text-white">
                    <h4 className="text-[10px] font-black text-brand-primary uppercase mb-4">Specs</h4>
                    <div className="flex justify-between text-xs font-bold border-b border-white/10 pb-2 mb-2">
                      <span>HEX</span>
                      <span className="text-brand-primary">{color.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-20 italic font-black text-slate-300">Phase Under Construction</div>
            )}
          </AnimatePresence>
        </aside>
      </main>
    </div>
  );
}