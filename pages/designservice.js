'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeCanvas from '../components/ThreeCanvas'; // Ensure path is correct
import ErrorBoundary from '../components/ErrorBoundary';

const STEPS = [
  { id: 1, title: 'Studio', subtitle: '3D Configurator', icon: '🎨' },
  { id: 2, title: 'Discovery', subtitle: 'Strategy Call', icon: '📞' },
  { id: 3, title: 'Review', subtitle: 'Artboard Drafts', icon: '👁️' },
  { id: 4, title: 'Delivery', subtitle: 'Final Assets', icon: '📦' },
];

export default function DesignService() {
  const [currentStep, setCurrentStep] = useState(1);
  const [shirtColor, setShirtColor] = useState('#ffffff');
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calculate Progress %
  const progressPercent = useMemo(() => ((currentStep - 1) / (STEPS.length - 1)) * 100, [currentStep]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local URL for the 3D texture
      const url = URL.createObjectURL(file);
      setUploadedLogo(url);
    }
  };

  const nextStep = () => {
    setLoading(true);
    // Simulate saving to Database
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 1. STICKY PROGRESS HEADER */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black italic">
              PK
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 leading-none">CustomiseMe UK</p>
              <h2 className="font-bold text-slate-900">Design Pipeline</h2>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {STEPS.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all
                  ${currentStep >= step.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${currentStep === step.id ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          <button 
            disabled={currentStep === 4}
            onClick={nextStep}
            className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-30 transition-all shadow-lg shadow-blue-100"
          >
            {loading ? 'Syncing...' : 'Next Phase →'}
          </button>
        </div>
        {/* Progress Line */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-700" style={{ width: `${progressPercent}%` }} />
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-3 gap-12"
            >
              {/* 3D STUDIO CANVAS */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[3rem] p-4 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                  <ErrorBoundary>
                    <ThreeCanvas color={shirtColor} logoUrl={uploadedLogo} />
                  </ErrorBoundary>
                  
                  {/* Overlay Controls */}
                  <div className="absolute bottom-8 left-8 flex gap-4">
                    <div className="bg-white/90 backdrop-blur p-2 rounded-2xl shadow-xl flex gap-2 border border-slate-100">
                      {['#ffffff', '#111111', '#2563eb', '#dc2626', '#16a34a'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setShirtColor(c)}
                          style={{ backgroundColor: c }}
                          className={`w-10 h-10 rounded-xl border-2 transition-all ${shirtColor === c ? 'border-blue-600 scale-110' : 'border-transparent'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SIDEBAR CONTROLS */}
              <aside className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Step 01: <span className="text-blue-600">The Visual</span></h3>
                  <p className="text-slate-500 text-sm mb-8">Upload your assets and choose your base garment color to begin the design process.</p>

                  <div className="space-y-6">
                    <div className="relative group">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Upload Artwork</label>
                      <input 
                        type="file" 
                        onChange={handleLogoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center group-hover:border-blue-500 group-hover:bg-blue-50 transition-all">
                        <span className="text-3xl block mb-2">📤</span>
                        <p className="text-xs font-bold text-slate-600 uppercase">Click to browse</p>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 text-white">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4">Design Specs</h4>
                       <div className="space-y-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Garment:</span>
                            <span className="font-bold">Premium T-Shirt</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Color:</span>
                            <span className="font-bold uppercase">{shirtColor}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </aside>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl mx-auto text-center py-20"
            >
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-8">📞</div>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">Discovery Call</h2>
              <p className="text-slate-500 mb-12 text-lg">We've received your design draft! Now, let's jump on a 10-minute strategy call to finalize the technical specs.</p>
              
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                {/* Calendly embed or custom scheduler would go here */}
                <p className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-4">Select a Time</p>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={nextStep} className="p-4 border-2 border-slate-100 rounded-2xl hover:border-blue-600 transition-all font-bold">Mon 10:00 AM</button>
                  <button onClick={nextStep} className="p-4 border-2 border-slate-100 rounded-2xl hover:border-blue-600 transition-all font-bold">Mon 02:00 PM</button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep > 2 && (
            <motion.div className="text-center py-40">
              <h2 className="text-3xl font-black uppercase italic">Future steps processing...</h2>
              <button onClick={() => setCurrentStep(1)} className="mt-4 text-blue-600 font-bold underline">Restart Journey</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}