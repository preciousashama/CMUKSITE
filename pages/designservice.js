'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeCanvas from '../components/ThreeCanvas';
import ErrorBoundary from '../components/ErrorBoundary';

const STEPS = [
  { id: 1, title: 'Studio', subtitle: '3D Configurator' },
  { id: 2, title: 'Discovery', subtitle: 'Strategy Call' },
  { id: 3, title: 'Review', subtitle: 'Artboard Drafts' },
  { id: 4, title: 'Delivery', subtitle: 'Final Assets' },
];

export default function DesignService() {
  const [currentStep, setCurrentStep] = useState(1);
  const [shirtColor, setShirtColor] = useState('#ffffff');
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. Memory Cleanup: Prevent ObjectURL leaks
  useEffect(() => {
    return () => {
      if (uploadedLogo) URL.revokeObjectURL(uploadedLogo);
    };
  }, [uploadedLogo]);

  const progressPercent = useMemo(() => 
    ((currentStep - 1) / (STEPS.length - 1)) * 100, 
  [currentStep]);

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate File Type for Security
    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
      alert("Please upload a high-res PNG, JPG or SVG.");
      return;
    }

    if (uploadedLogo) URL.revokeObjectURL(uploadedLogo);
    const url = URL.createObjectURL(file);
    setUploadedLogo(url);
  }, [uploadedLogo]);

  const handleNextPhase = async () => {
    setIsSyncing(true);
    try {
      // API call to persist design choice before moving to scheduler
      // await saveDesignToDrafts({ shirtColor, uploadedLogo });
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    } catch (err) {
      console.error("Pipeline sync failed", err);
    } finally {
      setIsSyncing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* STEPS NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200">
               CM
             </div>
             <h1 className="text-sm font-black uppercase tracking-tighter text-slate-900 hidden sm:block">
               Design Pipeline
             </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            {STEPS.map((step) => (
              <div key={step.id} className="flex items-center gap-2 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all duration-500
                  ${currentStep >= step.id ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest hidden lg:block ${currentStep === step.id ? 'text-slate-900' : 'text-slate-300'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          <button 
            disabled={isSyncing || currentStep === 4}
            onClick={handleNextPhase}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 disabled:bg-slate-200 transition-all active:scale-95"
          >
            {isSyncing ? 'Processing...' : 'Next Phase →'}
          </button>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-blue-600 transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }} />
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {currentStep === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-12 gap-8"
            >
              <section className="lg:col-span-8 bg-white rounded-[3rem] p-4 shadow-2xl shadow-slate-200/50 border border-slate-100 relative min-h-[600px] flex items-center justify-center">
                 <ErrorBoundary>
                    {/* Maintain 3D context by conditional CSS instead of unmounting if possible */}
                    <ThreeCanvas color={shirtColor} logoUrl={uploadedLogo} />
                 </ErrorBoundary>
                 
                 {/* Color Picker Overlay */}
                 <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-lg p-3 rounded-3xl shadow-2xl border border-white flex gap-3">
                    {['#ffffff', '#0f172a', '#2563eb', '#dc2626', '#eab308'].map((c) => (
                      <button
                        key={c}
                        aria-label={`Select color ${c}`}
                        onClick={() => setShirtColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-12 h-12 rounded-2xl border-2 transition-all transform hover:scale-110 active:scale-90 ${shirtColor === c ? 'border-blue-600 ring-4 ring-blue-50' : 'border-transparent'}`}
                      />
                    ))}
                 </div>
              </section>

              <aside className="lg:col-span-4 space-y-6">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 h-full">
                  <header className="mb-8">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Phase 01</span>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 mt-2">Visual <span className="text-blue-600">Draft</span></h2>
                  </header>

                  <div className="space-y-8">
                    <div className="relative group">
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-4 block">Upload Artwork (SVG/PNG)</label>
                      <div className="relative border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center transition-all group-hover:border-blue-500 group-hover:bg-blue-50/50">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="pointer-events-none">
                          <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">🖼️</span>
                          <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Drop logo here</p>
                          <p className="text-[10px] text-slate-400 mt-2">Maximum file size: 5MB</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950 rounded-[2rem] p-8 text-white relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10">
                         <span className="text-8xl">📐</span>
                       </div>
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6">Technical Specs</h4>
                       <dl className="space-y-4 relative z-10">
                          <div className="flex justify-between border-b border-white/10 pb-2">
                             <dt className="text-[10px] uppercase text-slate-400 font-bold">Base</dt>
                             <dd className="text-xs font-bold uppercase tracking-widest">Premium Heavy Cotton</dd>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-2">
                             <dt className="text-[10px] uppercase text-slate-400 font-bold">HEX Code</dt>
                             <dd className="text-xs font-mono font-bold text-blue-400">{shirtColor.toUpperCase()}</dd>
                          </div>
                       </dl>
                    </div>
                  </div>
                </div>
              </aside>
            </motion.div>
          ) : (
            <motion.div 
              key="fallback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto py-20 px-6 bg-white rounded-[3rem] text-center shadow-xl"
            >
               <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8 shadow-inner italic font-black">?</div>
               <h2 className="text-5xl font-black uppercase italic tracking-tighter">Under Construction</h2>
               <p className="text-slate-500 mt-6 max-w-md mx-auto">This phase of the pipeline is currently being integrated with our technical artboard team.</p>
               <button onClick={() => setCurrentStep(1)} className="mt-10 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em]">Go Back to Studio</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}