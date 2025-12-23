'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Instagram, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

const FOOTER_LINKS = {
  shop: [
    { label: 'Shop Apparel', href: '/apparel' },
    { label: 'Design Studio', href: '/designservice' },
    { label: 'Custom Orders', href: '/party-occasions' },
    { label: 'The Archive', href: '/gallery' },
  ],
  support: [
    { label: 'Track Order', href: '/track' },
    { label: 'Send Items In', href: '/send-in' },
    { label: 'Subscriptions', href: '/subscriptions' },
    { label: 'All Reviews', href: '/all-reviews' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Returns', href: '/returns' },
  ]
};

export default function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="w-full bg-brand-dark text-slate-200 border-t border-white/5 pt-20 pb-10" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          
          {/* Brand & Newsletter Column */}
          <div className="md:col-span-5 space-y-8">
            <Link href="/" className="inline-block">
              <h4 className="text-white font-black uppercase italic tracking-tighter text-3xl leading-none">
                Customise<span className="text-brand-primary">Me</span> UK
              </h4>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed font-medium">
              Premium custom prints and bespoke apparel crafted in the UK. 
              Join the collective for early access to limited drops.
            </p>
            
            {/* Newsletter Input */}
            <form className="relative max-w-sm group">
              <input 
                type="email" 
                placeholder="ENTER EMAIL" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[10px] font-black tracking-widest text-white outline-none focus:border-brand-primary transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-brand-primary hover:bg-white text-brand-dark px-4 rounded-xl transition-all">
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* Navigation Grid */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
            <nav className="space-y-6">
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Shop</h4>
              <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                {FOOTER_LINKS.shop.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-brand-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="space-y-6">
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Support</h4>
              <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-brand-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-6 flex flex-col items-start sm:items-end">
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Social</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-brand-dark transition-all">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-brand-dark transition-all">
                  <Mail size={18} />
                </a>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-2 pt-4 opacity-30 grayscale pointer-events-none">
                <div className="flex gap-2">
                  <div className="bg-white px-2 py-0.5 rounded text-[8px] font-black text-black">VISA</div>
                  <div className="bg-white px-2 py-0.5 rounded text-[8px] font-black text-black">STRIPE</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            © {currentYear} CMUK™ COLLECTIVE. ALL RIGHTS RESERVED.
          </p>
          <ul className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            {FOOTER_LINKS.legal.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}