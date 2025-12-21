'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Send } from 'lucide-react'; // Standardizing icon library
import Cookies from 'js-cookie'; // Preferred for reliable browser cookie handling

const POPUP_COOKIE_NAME = 'newsletter_subscribed_v1';
const DISPLAY_DELAY = 5000; // Increased to 5s for better UX/SEO

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const modalRef = useRef(null);

  // Close handler with cookie persistence
  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Set cookie for 30 days so we don't annoy returning customers
    Cookies.set(POPUP_COOKIE_NAME, 'true', { expires: 30, sameSite: 'lax' });
  }, []);

  // Keyboard support (Escape key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  useEffect(() => {
    const hasSeenPopup = Cookies.get(POPUP_COOKIE_NAME);
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => setIsOpen(true), DISPLAY_DELAY);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Logic for Prisma/API route integration
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setTimeout(handleClose, 2000);
      } else {
        throw new Error();
      }
    } catch (err) {
      setStatus('error');
    }
  };

  // Prevent rendering on SSR or if closed
  if (!isOpen) return null;

  // Use a Portal to ensure the modal is at the top of the DOM tree
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={handleClose} 
      />

      {/* Modal Content */}
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
      >
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-900"
          aria-label="Close newsletter"
        >
          <X size={24} />
        </button>

        <div className="p-8 sm:p-12">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Send size={32} />
          </div>
          
          <h2 id="modal-title" className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">
            Join the <span className="text-blue-600">Inner Circle</span>
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Get early access to custom drops, 3D design tips, and 10% off your first order.
          </p>

          {status === 'success' ? (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl font-bold text-center animate-in slide-in-from-bottom-2">
              Welcome to the family! Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  required
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 disabled:bg-slate-300 transition-all shadow-xl shadow-slate-200"
              >
                {status === 'loading' ? 'Syncing...' : 'Get My Discount →'}
              </button>
              {status === 'error' && (
                <p className="text-xs text-red-500 font-bold text-center">Something went wrong. Try again?</p>
              )}
            </form>
          )}
          
          <p className="mt-6 text-[10px] text-center text-slate-400 uppercase tracking-widest">
            No spam. Just heat. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}