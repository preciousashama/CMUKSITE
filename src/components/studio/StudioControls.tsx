'use client';

import React, { useState, useRef, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider'; // Assuming you have a UI slider component (shadcn/ui or similar)
import Image from 'next/image';

const PRESET_COLORS = [
  '#2C3E50', // Deep Navy (Brand Dark)
  '#FF5733', // Orange (Brand Primary)
  '#ECF0F1', // Light Gray (Silver)
  '#1ABC9C', // Turquoise
  '#F1C40F', // Yellow
  '#E74C3C', // Red
  '#9B59B6', // Amethyst
  '#3498DB', // Peter River Blue
];

export default function StudioControls({
  onColorChange,
  onLogoUpload,
  onDecalPropsChange,
  currentColor,
  currentLogoUrl,
  currentDecalProps,
}) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setLogoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          onLogoUpload(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload an image file.');
      }
    }
  }, [onLogoUpload]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleClearLogo = useCallback(() => {
    setLogoFile(null);
    onLogoUpload(null);
    onDecalPropsChange({ position: [0, 0.04, 0.15], rotation: [0, 0, 0], scale: 0.15 });
  }, [onLogoUpload, onDecalPropsChange]);

  const handleDecalScaleChange = useCallback((value: number[]) => {
    onDecalPropsChange({ ...currentDecalProps, scale: value[0] });
  }, [currentDecalProps, onDecalPropsChange]);

  const handleDecalRotationChange = useCallback((value: number[]) => {
    onDecalPropsChange({ ...currentDecalProps, rotation: [0, 0, value[0]] });
  }, [currentDecalProps, onDecalPropsChange]);

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 h-full w-full md:w-96 bg-white border-l border-slate-100 shadow-2xl z-50 p-8 overflow-y-auto"
    >
      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-brand-dark mb-8">
        Studio <span className="text-brand-primary">Controls</span>
      </h2>

      {/* Shirt Color Section */}
      <section className="mb-10">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Base Color</h3>
        <HexColorPicker 
          color={currentColor} 
          onChange={onColorChange} 
          className="w-full !h-auto" // Override inline style for full width
        />
        <div className="flex flex-wrap gap-2 mt-4">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-full border border-slate-100 shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: color, outline: currentColor === color ? '2px solid var(--brand-primary)' : 'none', outlineOffset: '2px' }}
              onClick={() => onColorChange(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </section>

      {/* Logo Uploader Section */}
      <section className="mb-10">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Custom Logo</h3>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
            isDragging ? 'border-brand-primary bg-brand-primary/10' : 'border-slate-200 hover:border-brand-primary/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            accept="image/*"
          />
          <UploadCloud size={32} className="text-slate-400 mb-3" />
          <p className="text-xs font-bold text-slate-500 text-center">
            Drag & Drop or <span className="text-brand-primary">Click to Upload</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, SVG up to 5MB</p>
          <AnimatePresence>
            {currentLogoUrl && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-brand-dark/90 rounded-2xl"
              >
                <Image src={currentLogoUrl} alt="Uploaded Logo Preview" width={80} height={80} className="object-contain" />
                <button 
                  onClick={(e) => { e.stopPropagation(); handleClearLogo(); }}
                  className="absolute top-3 right-3 p-1 bg-white/20 hover:bg-white/40 rounded-full text-white"
                >
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Decal Controls Section */}
      {currentLogoUrl && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mb-10"
        >
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Logo Adjustments</h3>
          
          <div className="space-y-6">
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                <span>Scale</span>
                <span className="text-brand-primary text-sm">{Math.round(currentDecalProps.scale * 100)}%</span>
              </label>
              <Slider
                value={[currentDecalProps.scale]}
                onValueChange={handleDecalScaleChange}
                max={0.3}
                min={0.05}
                step={0.01}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                <span>Rotation</span>
                <span className="text-brand-primary text-sm">{(currentDecalProps.rotation[2] * (180 / Math.PI)).toFixed(0)}°</span>
              </label>
              <Slider
                value={[currentDecalProps.rotation[2]]}
                onValueChange={handleDecalRotationChange}
                max={Math.PI} // Full circle in radians
                min={-Math.PI}
                step={0.01}
                className="w-full"
              />
            </div>

            <button
              onClick={() => onDecalPropsChange({ position: [0, 0.04, 0.15], rotation: [0, 0, 0], scale: 0.15 })}
              className="flex items-center justify-center gap-2 w-full py-4 bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors"
            >
              <RotateCw size={16} /> Reset Logo Position
            </button>
          </div>
        </motion.section>
      )}

      {/* Final Call to Action (Example) */}
      <div className="pt-8 border-t border-slate-100 mt-10">
        <button className="w-full py-6 bg-brand-primary text-brand-dark text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all active:scale-[0.98]">
          Save Custom Design
        </button>
      </div>
    </motion.div>
  );
}