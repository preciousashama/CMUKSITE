"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const Header = () => {
  const { cartCount } = useCart();
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');

  return (
    <header className="site-header">
      {/* 1. TOP BAR - High Contrast Announcement */}
      <div className="header-top-bar">
        SYSTEM_STATUS: STAGE_04_ARCHIVE_ACCESS_ACTIVE — GLOBAL_SHIPPING_ENABLED
      </div>

      {/* 2. MAIN HEADER - The Layout we built in CSS */}
      <div className="header-main">
        {/* LEFT: Search Terminal */}
        <div className="header-left">
          <div className="search-container">
            <form id="search-form">
              <input 
                type="search" 
                id="search-input" 
                placeholder="SEARCH_ARCHIVE..." 
              />
            </form>
          </div>
        </div>

        {/* CENTER: Branding */}
        <div className="header-fulllogo">
          <Link href="/">
             {/* Using text for now to ensure it works, replace with <img> if needed */}
             <h1 className="logo" style={{ letterSpacing: '8px', fontWeight: 900 }}>CMUK</h1>
          </Link>
        </div>

        {/* RIGHT: Utilities & Collection Count */}
        <div className="header-right">
          <div className="header-icons">
            <Link href="/login">
              <span>ACCOUNT</span>
            </Link>
            
            <Link href="/cart" className="collection-link">
              <span>COLLECTION ({cartCount})</span>
            </Link>

            {/* Currency Selector Logic */}
            <div className="currency-dropdown-wrapper">
              <button 
                className="currency-button" 
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              >
                <span className="currency-code">{currency}</span>
                <span className="arrow">▼</span>
              </button>
              
              {isCurrencyOpen && (
                <div className="currency-dropdown">
                  <button onClick={() => {setCurrency('USD'); setIsCurrencyOpen(false)}}>USD - $ (UNITED STATES)</button>
                  <button onClick={() => {setCurrency('GBP'); setIsCurrencyOpen(false)}}>GBP - £ (UNITED KINGDOM)</button>
                  <button onClick={() => {setCurrency('EUR'); setIsCurrencyOpen(false)}}>EUR - € (EUROPE)</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION - Triggering the Mega Menu */}
      <nav className="navbar">
        <ul className="nav-menu">
          
          {/* THE MEGA MENU ITEM */}
          <li className="nav-item has-dropdown">
            <Link href="/shop">COLLECTIONS</Link>
            <div className="dropdown-menu">
              <div className="dropdown-section">
                <span className="dropdown-heading">CORE_ARCHIVE</span>
                <ul>
                  <li><Link href="/shop/tees">OVERSIZED_TEES</Link></li>
                  <li><Link href="/shop/hoodies">HEAVY_HOODIES</Link></li>
                  <li><Link href="/shop/tanks">CORE_TANKS</Link></li>
                </ul>
              </div>
              <div className="dropdown-section">
                <span className="dropdown-heading">DEVELOPMENT</span>
                <ul>
                  <li><Link href="/studio">3D_DESIGN_STUDIO</Link></li>
                  <li><Link href="/prototypes">PROTOTYPE_SERIES</Link></li>
                  <li><Link href="/custom">BESPOKE_REQUEST</Link></li>
                </ul>
              </div>
              <div className="dropdown-section">
                <span className="dropdown-heading">METADATA</span>
                <ul>
                  <li><Link href="/gallery">COMMUNITY_GALLERY</Link></li>
                  <li><Link href="/lookbook">SEASON_04_LOOKBOOK</Link></li>
                  <li><Link href="/manifesto">BRAND_MANIFESTO</Link></li>
                </ul>
              </div>
            </div>
          </li>

          <li className="nav-item">
            <Link href="/studio">3D_STUDIO</Link>
          </li>
          <li className="nav-item">
            <Link href="/gallery">GALLERY</Link>
          </li>
          <li className="nav-item">
            <Link href="/manifesto">MANIFESTO</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;