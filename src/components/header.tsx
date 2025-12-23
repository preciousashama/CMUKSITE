"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, Menu, X, Globe } from 'lucide-react';

export default function Header() {
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for transparency
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'SHOP', path: '/shop' },
    { name: '3D_STUDIO', path: '/studio' },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'MANIFESTO', path: '/manifesto' },
  ];

  return (
    <header style={{
      ...styles.header,
      backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
      borderBottom: isScrolled ? '1px solid #000' : '1px solid transparent',
    }}>
      {/* UPPER BAR: SYSTEM INFO */}
      <div style={styles.upperBar}>
        <div style={styles.ticker}>
          <Globe size={10} style={{ marginRight: '5px' }} />
          STATUS: {pathname === '/studio' ? 'CONFIGURING_MODEL_V1' : 'BROWSING_ARCHIVE'} // 2025_CORE_SYSTEM
        </div>
      </div>

      {/* MAIN NAV */}
      <div style={styles.mainNav}>
        {/* LEFT: SEARCH */}
        <div style={styles.navSection}>
          <button style={styles.iconBtn}>
            <Search size={18} strokeWidth={2.5} />
            <span style={styles.iconLabel}>SEARCH</span>
          </button>
        </div>

        {/* CENTER: LOGO */}
        <div style={styles.logoSection}>
          <Link href="/" style={styles.logoLink}>
            <h1 style={styles.logoText}>CMUK</h1>
          </Link>
        </div>

        {/* RIGHT: CART/COLLECTION */}
        <div style={styles.navSection}>
          <Link href="/cart" style={styles.cartLink}>
            <span style={styles.iconLabel}>COLLECTION</span>
            <div style={styles.cartIconWrapper}>
              <ShoppingBag size={18} strokeWidth={2.5} />
              {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
            </div>
          </Link>
          
          <button 
            style={styles.mobileToggle} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* SUB-MENU: CATEGORIES */}
      <nav style={styles.subnav}>
        <ul style={styles.navList}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link 
                href={link.path} 
                style={{
                  ...styles.navItem,
                  color: pathname === link.path ? '#000' : '#888',
                  textDecoration: pathname === link.path ? 'underline' : 'none'
                }}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div style={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path} 
              onClick={() => setIsMobileMenuOpen(false)}
              style={styles.mobileLink}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  upperBar: {
    background: '#000',
    color: '#fff',
    padding: '4px 20px',
    fontSize: '8px',
    fontWeight: 900,
    letterSpacing: '1.5px',
    display: 'flex',
    justifyContent: 'center',
  },
  ticker: {
    display: 'flex',
    alignItems: 'center',
    opacity: 0.8,
  },
  mainNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    borderBottom: '1px solid #eee',
  },
  navSection: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  logoSection: {
    flex: 0,
    textAlign: 'center',
  },
  logoText: {
    fontSize: '28px',
    fontWeight: 950,
    letterSpacing: '-2px',
    margin: 0,
    color: '#000',
  },
  logoLink: {
    textDecoration: 'none',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: 0,
  },
  iconLabel: {
    fontSize: '10px',
    fontWeight: 900,
    letterSpacing: '1px',
    display: 'none', // Hidden on small screens
  },
  cartLink: {
    marginLeft: 'auto',
    textDecoration: 'none',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  cartIconWrapper: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#00ff00',
    color: '#000',
    fontSize: '8px',
    fontWeight: 950,
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #000',
  },
  subnav: {
    padding: '10px 40px',
    borderBottom: '1px solid #000',
    background: 'white',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
  },
  navItem: {
    fontSize: '10px',
    fontWeight: 900,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    transition: 'color 0.2s ease',
  },
  mobileToggle: {
    display: 'none', // Toggle visibility in media queries
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    background: 'white',
    padding: '20px',
    borderBottom: '2px solid black',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  mobileLink: {
    fontSize: '18px',
    fontWeight: 900,
    textDecoration: 'none',
    color: 'black',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  }
};