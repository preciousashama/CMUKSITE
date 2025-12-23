"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  return (
    <header className="site-header">
      {/* 1. Top Announcement Bar */}
      <div className="header-top-bar">
        FREE ARCHIVE ACCESS FOR GLOBAL MEMBERS — STAGE_04 READY
      </div>

      {/* 2. Main Header Section */}
      <div className="header-main">
        {/* Left: Search Command */}
        <div className="header-left">
          <div className="search-container">
            <input 
              type="search" 
              id="search-input" 
              placeholder="SEARCH_ARCHIVE..." 
              onFocus={() => setIsSearchOpen(true)}
            />
          </div>
        </div>

        {/* Center: Branding */}
        <div className="header-fulllogo">
          <Link href="/">
            <h4 className="brand-heading">CMUK</h4>
          </Link>
        </div>

        {/* Right: Utilities */}
        <div className="header-right">
          <div className="header-icons">
            <Link href="/account">
              <span className="icon-text">ACCOUNT</span>
            </Link>
            <Link href="/wishlist">
              <span className="icon-text">WISHLIST</span>
            </Link>
            <Link href="/cart">
              <span className="icon-text">COLLECTION (0)</span>
            </Link>
            
            {/* Currency Selector */}
            <div className="currency-dropdown-wrapper">
              <button 
                className="currency-button"
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              >
                {currency} ▼
              </button>
              {isCurrencyOpen && (
                <div className="currency-dropdown">
                  <button onClick={() => {setCurrency('USD'); setIsCurrencyOpen(false)}}>USD - $</button>
                  <button onClick={() => {setCurrency('GBP'); setIsCurrencyOpen(false)}}>GBP - £</button>
                  <button onClick={() => {setCurrency('EUR'); setIsCurrencyOpen(false)}}>EUR - €</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation & Mega Menu */}
      <nav className="navbar">
        <ul className="nav-menu">
          <li className="nav-item has-dropdown">
            <Link href="/shop">COLLECTIONS</Link>
            {/* The Mega Menu Wrapper */}
            <div className="dropdown-menu">
              <div className="dropdown-section">
                <span className="dropdown-heading">BASICS_01</span>
                <ul>
                  <li><Link href="/shop/tees">OVERSIZED TEES</Link></li>
                  <li><Link href="/shop/hoodies">HEAVY HOODIES</Link></li>
                  <li><Link href="/shop/tanks">CORE TANKS</Link></li>
                </ul>
              </div>
              <div className="dropdown-section">
                <span className="dropdown-heading">ARCHIVE_SERIES</span>
                <ul>
                  <li><Link href="/shop/limited">2024 DROP A</Link></li>
                  <li><Link href="/shop/concepts">CONCEPT WEAR</Link></li>
                  <li><Link href="/shop/prototypes">PROTOTYPES</Link></li>
                </ul>
              </div>
              <div className="dropdown-section">
                <span className="dropdown-heading">DESIGN_STUDIO</span>
                <ul>
                  <li><Link href="/studio">3D CUSTOMIZER</Link></li>
                  <li><Link href="/design-service">BESPOKE SERVICE</Link></li>
                </ul>
              </div>
              <div className="dropdown-section">
                <span className="dropdown-heading">META_DATA</span>
                <ul>
                  <li><Link href="/lookbook">LOOKBOOK</Link></li>
                  <li><Link href="/gallery">COMMUNITY GALLERY</Link></li>
                </ul>
              </div>
            </div>
          </li>
          <li className="nav-item"><Link href="/studio">3D_STUDIO</Link></li>
          <li className="nav-item"><Link href="/gallery">GALLERY</Link></li>
          <li className="nav-item"><Link href="/about">MANIFESTO</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;