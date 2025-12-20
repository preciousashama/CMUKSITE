'use client';
import { useState, useEffect, useCallback } from 'react';

// 1. Data moved outside to prevent unnecessary re-calculating
const GALLERY_IMAGES = [
  { id: 1, src: "/assets/gallery/all.png", desc: "Beautiful mountain landscape" },
  { id: 2, src: "assets/gallery/bags.png", desc: "Sunset over the beach" },
  { id: 3, src: "/assets/gallery/hq720.png", desc: "City skyline at night" },
  { id: 4, src: "/assets/gallery/me.png", desc: "Snowy forest path" },
  { id: 5, src: "/assets/gallery/Knorr1.png", desc: "Waterfall in lush forest" },
  { id: 6, src: "/assets/gallery/party.png", desc: "Vibrant flower" },
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);

  // 2. Close modal handler (Memoized for performance)
  const closeModal = useCallback(() => setSelectedImage(null), []);

  // 3. Accessibility: Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeModal]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Our Gallery</h1>
        <p className="text-gray-500">A collection of our finest moments</p>
      </header>

      {/* 4. Modern Masonry using CSS Columns */}
      <div style={{
        columns: '1px 2', // 2 columns on mobile
        columnGap: '1rem',
        WebkitColumns: '250px 4', // Up to 4 columns on desktop
      }}>
        {GALLERY_IMAGES.map((img) => (
          <div 
            key={img.id} 
            className="mb-4 break-inside-avoid group relative cursor-zoom-in"
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img.src}
              alt={img.desc}
              className="w-full rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end p-4">
              <p className="text-white text-sm font-medium">{img.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 5. State-Driven Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 transition-colors"
            onClick={closeModal}
          >
            &times;
          </button>

          <img 
            src={selectedImage.src} 
            alt={selectedImage.desc}
            className="max-h-[85vh] max-w-full rounded shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
          />
          
          <p className="mt-6 text-white text-xl font-light tracking-wide text-center">
            {selectedImage.desc}
          </p>
        </div>
      )}
    </div>
  );
}