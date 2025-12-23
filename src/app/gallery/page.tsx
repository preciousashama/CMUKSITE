'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const GALLERY_IMAGES = [
  { id: 1, src: "/assets/gallery/all.png", desc: "Premium Bulk Prints", category: "Apparel" },
  { id: 2, src: "/assets/gallery/bags.png", desc: "Custom Tote Collection", category: "Accessories" },
  { id: 3, src: "/assets/gallery/hq720.png", desc: "High-Def Detail Work", category: "Prints" },
  { id: 4, src: "/assets/gallery/me.png", desc: "Studio Session", category: "BTS" },
  { id: 5, src: "/assets/gallery/Knorr1.png", desc: "Branded Merch Drop", category: "Corporate" },
  { id: 6, src: "/assets/gallery/party.png", desc: "Event Showcase", category: "Events" },
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const closeModal = useCallback(() => setSelectedImage(null), []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeModal]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <header className="mb-20 space-y-4">
        <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase text-brand-dark leading-[0.8]">
          The <span className="text-brand-primary">Archive</span>
        </h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
          Visual evidence of our print quality & culture
        </p>
      </header>

      {/* Modern Masonry Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
        {GALLERY_IMAGES.map((img) => (
          <motion.div 
            key={img.id} 
            layoutId={`img-${img.id}`}
            className="break-inside-avoid group relative cursor-zoom-in rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm"
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img.src}
              alt={img.desc}
              className="w-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Hover Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">{img.category}</span>
              <p className="text-white font-black italic uppercase text-lg leading-tight">{img.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 md:p-12 bg-brand-dark/95 backdrop-blur-xl"
            onClick={closeModal}
          >
            <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <motion.div 
              layoutId={`img-${selectedImage.id}`}
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
            >
              <img 
                src={selectedImage.src} 
                alt={selectedImage.desc}
                className="max-h-full max-w-full rounded-[2rem] shadow-2xl object-contain border border-white/10"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
            
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mt-8 space-y-2"
            >
              <p className="text-brand-primary font-black uppercase text-xs tracking-widest">{selectedImage.category}</p>
              <h2 className="text-white text-3xl font-black italic uppercase tracking-tighter">{selectedImage.desc}</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}