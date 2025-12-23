'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/CartContext'; // Use the context we built earlier
import { motion, AnimatePresence } from 'framer-motion';

export default function AppInitializer({ products }: { products: any[] }) {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // 1. Toast Notification Auto-Hide
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // 2. Modern Global Click Handler
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.add-to-cart-btn') as HTMLButtonElement;
      
      if (btn) {
        const productId = btn.dataset.productId;
        const product = products.find(p => p.id === productId);
        
        if (product) {
          addToCart(product);
          setNotification({ 
            msg: `${product.name} added to your collection.`, 
            type: 'success' 
          });
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [products, addToCart]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-10 left-1/2 z-[200] px-8 py-4 bg-brand-dark border-2 border-brand-primary rounded-2xl shadow-2xl"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
            {notification.type === 'success' ? '✓' : '×'} {notification.msg}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}