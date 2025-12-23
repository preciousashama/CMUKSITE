"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, ChevronRight, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      {/* TOP SECTION: NEWSLETTER / JOIN ARCHIVE */}
      <div style={styles.newsletterSection}>
        <div style={styles.newsletterInfo}>
          <h3 style={styles.footerHeading}>JOIN_THE_ARCHIVE_PROTOCOL</h3>
          <p style={styles.footerText}>RECEIVE_TECHNICAL_UPDATES_AND_NEW_RELEASE_LOGS.</p>
        </div>
        <div style={styles.inputWrapper}>
          <input 
            type="email" 
            placeholder="EMAIL_ADDRESS_TYPE_HERE..." 
            style={styles.input}
          />
          <button style={styles.subscribeBtn}>
            SUBSCRIBE <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* MIDDLE SECTION: LINKS */}
      <div style={styles.linksGrid}>
        <div style={styles.footerCol}>
          <span style={styles.colLabel}>NAVIGATION</span>
          <Link href="/shop" style={styles.footerLink}>ALL_PRODUCTS</Link>
          <Link href="/studio" style={styles.footerLink}>3D_STUDIO_V1</Link>
          <Link href="/gallery" style={styles.footerLink}>VISUAL_GALLERY</Link>
          <Link href="/account" style={styles.footerLink}>USER_PORTAL</Link>
        </div>

        <div style={styles.footerCol}>
          <span style={styles.colLabel}>LEGAL_DOCS</span>
          <Link href="/privacy" style={styles.footerLink}>PRIVACY_POLICY</Link>
          <Link href="/terms" style={styles.footerLink}>TERMS_OF_SERVICE</Link>
          <Link href="/shipping" style={styles.footerLink}>SHIPPING_LOGS</Link>
        </div>

        <div style={styles.footerCol}>
          <span style={styles.colLabel}>CONNECT</span>
          <div style={styles.socialRow}>
            <a href="#" style={styles.socialIcon}><Instagram size={18} /></a>
            <a href="#" style={styles.socialIcon}><Twitter size={18} /></a>
          </div>
          <p style={styles.statusText}>
            <ShieldCheck size={12} style={{ marginRight: '5px' }} />
            SECURE_ENCRYPTED_CONNECTION_ACTIVE
          </p>
        </div>
      </div>

      {/* BOTTOM SECTION: COPYRIGHT */}
      <div style={styles.bottomBar}>
        <div style={styles.logoSmall}>CMUK_ARCHIVE_SYSTEM</div>
        <div style={styles.copyright}>
          ©{currentYear} PROTOCOL_LTD // DESIGNED_IN_3D // {currentYear}_STABLE_BUILD
        </div>
      </div>
    </footer>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '80px 40px 40px 40px',
    borderTop: '2px solid #000',
    fontFamily: 'var(--font-inter), sans-serif',
  },
  newsletterSection: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: '60px',
    borderBottom: '1px solid #333',
    marginBottom: '60px',
    gap: '30px',
  },
  footerHeading: {
    fontSize: '24px',
    fontWeight: 900,
    letterSpacing: '-1px',
    margin: '0 0 10px 0',
  },
  footerText: {
    fontSize: '11px',
    color: '#888',
    letterSpacing: '1px',
    margin: 0,
  },
  inputWrapper: {
    display: 'flex',
    border: '1px solid #333',
    width: '100%',
    maxWidth: '450px',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: '15px',
    color: '#fff',
    fontSize: '10px',
    fontWeight: 700,
    outline: 'none',
  },
  subscribeBtn: {
    background: '#fff',
    color: '#000',
    border: 'none',
    padding: '0 25px',
    fontSize: '10px',
    fontWeight: 900,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  linksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '80px',
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  colLabel: {
    fontSize: '9px',
    fontWeight: 900,
    color: '#555',
    letterSpacing: '2px',
    marginBottom: '10px',
  },
  footerLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    transition: 'color 0.2s ease',
  },
  socialRow: {
    display: 'flex',
    gap: '20px',
  },
  socialIcon: {
    color: '#fff',
    transition: 'opacity 0.2s ease',
  },
  statusText: {
    marginTop: '20px',
    fontSize: '9px',
    color: '#00ff00',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 900,
  },
  bottomBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '30px',
    borderTop: '1px solid #1a1a1a',
    fontSize: '10px',
    color: '#444',
  },
  logoSmall: {
    fontWeight: 900,
    letterSpacing: '2px',
  },
  copyright: {
    letterSpacing: '1px',
  }
};