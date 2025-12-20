'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import React from 'react';

import { products } from '../data/products';
import { WishlistManager } from '../lib/wishlist-manager';
import { useCart } from '../lib/CartContext';

// Dynamic import for performance - 3D engines are heavy
const ThreeCanvas = dynamic(() => import('../components/ThreeCanvas'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center">Loading 3D Model...</div>
});

const COLOR_OPTIONS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Purple', hex: '#800080' },
];

const PLACEMENTS = ['left', 'right', 'centre', 'bottom right', 'bottom left'];

export default function ProductDetail() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  // --- Core State ---
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [sizeQuantities, setSizeQuantities] = useState({});
  const [placement, setPlacement] = useState('centre');
  const [uploadedArtworkSrc, setUploadedArtworkSrc] = useState('');
  const [toast, setToast] = useState(null);

  // --- Data Initialization ---
  useEffect(() => {
    const id = searchParams.get('id');
    const foundProduct = products.find(p => p.id === parseInt(id));

    if (foundProduct) {
      setProduct(foundProduct);
      
      // Default Color Setup
      const initialColor = COLOR_OPTIONS.find(c => c.name === foundProduct.colors?.[0]) || COLOR_OPTIONS[0];
      setSelectedColor(initialColor);

      // Dynamic Size Grid Setup
      const isBag = foundProduct.category?.toLowerCase().includes('bag');
      const availableSizes = isBag ? ['One Size'] : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      setSizeQuantities(availableSizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {}));
      
      document.title = `Configure - ${foundProduct.name}`;
    }
  }, [searchParams]);

  // --- Memoized Calculations ---
  const totalQuantity = useMemo(() => 
    Object.values(sizeQuantities).reduce((sum, qty) => sum + (parseInt(qty) || 0), 0)
  , [sizeQuantities]);

  const subtotal = useMemo(() => (product?.price || 0) * totalQuantity, [product, totalQuantity]);

  // --- Handlers ---
  const handleQuantityChange = useCallback((size, val) => {
    const quantity = Math.max(0, parseInt(val) || 0);
    setSizeQuantities(prev => ({ ...prev, [size]: quantity }));
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => setUploadedArtworkSrc(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const onAddToCart = () => {
    if (totalQuantity === 0) {
      triggerToast('Please select quantities first', 'error');
      return;
    }

    Object.entries(sizeQuantities).forEach(([size, qty]) => {
      if (qty > 0) {
        addToCart(product, qty, { 
          color: selectedColor.name, 
          size, 
          customArtwork: uploadedArtworkSrc ? 'Custom' : 'None',
          placement 
        });
      }
    });
    triggerToast(`Added ${totalQuantity} items to bag`, 'success');
  };

  const triggerToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!product) return <div className="p-20 text-center">Product Not Found</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* LEFT: 3D Visualization Visualizer */}
        <section className="w-full lg:w-3/5 bg-slate-50 relative sticky top-0 h-[60vh] lg:h-screen">
          <ThreeCanvas color={selectedColor.hex} />
          
          {/* Overlay Artwork Preview */}
          {uploadedArtworkSrc && (
            <div className={`absolute inset-0 pointer-events-none flex items-center justify-center p-20`}>
              <div className={`transition-all duration-500 artwork-container placement-${placement.replace(' ', '-')}`}>
                <img 
                  src={uploadedArtworkSrc} 
                  alt="Custom design" 
                  className="max-w-[150px] lg:max-w-[250px] object-contain shadow-2xl rounded-sm border-2 border-white/20"
                />
              </div>
            </div>
          )}

          {/* Configuration Summary Badge */}
          <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur px-4 py-2 rounded-full border text-xs font-bold tracking-widest uppercase">
            Live Preview: {selectedColor.name} | {placement}
          </div>
        </section>

        {/* RIGHT: Configuration Sidebar */}
        <section className="w-full lg:w-2/5 p-8 lg:p-12 overflow-y-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{product.name}</h1>
            <p className="text-2xl text-blue-600 font-light">
              {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(product.price)}
            </p>
          </header>

          <div className="space-y-12">
            
            {/* 1. Color Picker */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">1. Fabric Color</h3>
              <div className="flex flex-wrap gap-4">
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-12 h-12 rounded-full border-2 transition-all transform hover:scale-110 ${selectedColor.name === c.name ? 'border-blue-600 ring-4 ring-blue-100' : 'border-transparent'}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* 2. Custom Artwork Upload */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">2. Your Design</h3>
              <div className="flex items-center gap-4">
                <label className="flex-1 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                  <span className="text-sm font-bold text-slate-600">
                    {uploadedArtworkSrc ? 'Change Artwork' : 'Upload PNG/JPG'}
                  </span>
                </label>
                {uploadedArtworkSrc && (
                  <button onClick={() => setUploadedArtworkSrc('')} className="text-red-500 text-xs font-bold">Remove</button>
                )}
              </div>
            </div>

            {/* 3. Placement Selection */}
            {uploadedArtworkSrc && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">3. Logo Placement</h3>
                <div className="grid grid-cols-3 gap-2">
                  {PLACEMENTS.map(pos => (
                    <button
                      key={pos}
                      onClick={() => setPlacement(pos)}
                      className={`py-2 px-3 border rounded-lg text-[10px] font-bold uppercase transition-all ${placement === pos ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 hover:border-slate-400'}`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Multi-Size Quantity Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">4. Quantities</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {Object.keys(sizeQuantities).map(size => (
                  <div key={size} className="text-center">
                    <div className="text-[10px] font-black mb-1">{size}</div>
                    <input
                      type="number"
                      value={sizeQuantities[size]}
                      onChange={(e) => handleQuantityChange(size, e.target.value)}
                      className="w-full border rounded-md p-2 text-center text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Footer */}
          <footer className="mt-16 pt-8 border-t border-slate-100">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Total Items: {totalQuantity}</p>
                <p className="text-3xl font-black text-slate-900">
                  {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(subtotal)}
                </p>
              </div>
              <button 
                onClick={toggleWishlist}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                {WishlistManager.isInWishlist(product.id) ? '❤️' : '♡'}
              </button>
            </div>

            <button
              onClick={onAddToCart}
              disabled={totalQuantity === 0}
              className={`w-full py-5 rounded-2xl font-black tracking-widest uppercase transition-all ${totalQuantity > 0 ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
              Add to Bag
            </button>
          </footer>
        </section>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-8 py-4 rounded-2xl text-white font-bold shadow-2xl animate-in slide-in-from-bottom-5 duration-300 z-50 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-slate-900'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}