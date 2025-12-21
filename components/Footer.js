'use client';

import React, { useMemo } from 'react';
import Link from 'next/link'; // Improved performance with client-side routing
import { Instagram, Mail, ShieldCheck } from 'lucide-react'; // Light-weight icons

// Define navigation structure outside for better maintainability and potential i18n
const FOOTER_LINKS = {
  shop: [
    { label: 'Shop Apparel', href: '/apparel' },
    { label: 'Design Studio', href: '/designservice' },
    { label: 'Custom Orders', href: '/party-occasions' },
  ],
  company: [
    { label: 'Installations', href: '/installations' },
    { label: 'Subscriptions', href: '/subscriptions' },
    { label: 'Customer Reviews', href: '/all-reviews' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Return Policy', href: '/returns' },
  ]
};

export default function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="w-full bg-slate-950 text-slate-200 border-t border-slate-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-black uppercase italic tracking-tighter text-xl">
              Customise<span className="text-blue-500">Me</span> UK
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Premium designs, custom prints, and party essentials crafted with care in the UK. Bringing your creative vision to life since 2023.
            </p>
            <div className="flex gap-4 mt-2">
              <a 
                href="https://instagram.com/customisemeuk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="mailto:hello@customisemeuk.com"
                className="hover:text-blue-500 transition-colors"
                aria-label="Email our support team"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links Nav */}
          <nav className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Shop & Service</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company Nav */}
          <nav className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Helpful Links</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Trust/Newsletter Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Secure Payments</h4>
            <div className="flex flex-wrap gap-2 opacity-70">
              {/* These would be SVG icons in a real project */}
              <div className="bg-slate-800 px-2 py-1 rounded text-[10px] font-bold">VISA</div>
              <div className="bg-slate-800 px-2 py-1 rounded text-[10px] font-bold">STRIPE</div>
              <div className="bg-slate-800 px-2 py-1 rounded text-[10px] font-bold">APPLE PAY</div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>PCI Compliant & Secure Checkout</span>
            </div>
          </div>
        </div>

        <hr className="my-10 border-slate-800" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-500">
          <p>© {currentYear} Customise Me UK. All rights reserved.</p>
          <ul className="flex flex-wrap justify-center gap-6">
            {FOOTER_LINKS.legal.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-slate-300">
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