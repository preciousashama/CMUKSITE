"use client";

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      {/* 1. NEWSLETTER / SYSTEM JOIN */}
      <div className="footer-top">
        <div className="footer-container">
          <div className="newsletter-block">
            <span className="protocol-label">JOIN_THE_NETWORK</span>
            <h3 className="footer-heading">GET_ARCHIVE_UPDATES</h3>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="ENTER_EMAIL_ADDRESS" required />
              <button type="submit">SUBSCRIBE_</button>
            </form>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER LINKS */}
      <div className="footer-main">
        <div className="footer-container footer-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-col">
            <h2 className="footer-logo">CMUK</h2>
            <p className="footer-bio">
              HIGH-END 3D GARMENT ARCHIVE. <br />
              ESTABLISHED FOR THE DIGITAL AGE. <br />
              LONDON // GLOBAL ACCESS.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="footer-col">
            <span className="footer-label">DIRECTORY</span>
            <ul className="footer-links">
              <li><Link href="/shop">ALL_COLLECTIONS</Link></li>
              <li><Link href="/studio">3D_STUDIO_V1</Link></li>
              <li><Link href="/gallery">GALLERY_FEED</Link></li>
              <li><Link href="/manifesto">MANIFESTO</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="footer-col">
            <span className="footer-label">SUPPORT</span>
            <ul className="footer-links">
              <li><Link href="/shipping">SHIPPING_LOGISTICS</Link></li>
              <li><Link href="/returns">RETURNS_PROTOCOL</Link></li>
              <li><Link href="/contact">CONTACT_SYSTEM</Link></li>
              <li><Link href="/privacy">DATA_PRIVACY</Link></li>
            </ul>
          </div>

          {/* Column 4: Social/System */}
          <div className="footer-col">
            <span className="footer-label">NETWORK</span>
            <ul className="footer-links">
              <li><a href="https://instagram.com" target="_blank">INSTAGRAM</a></li>
              <li><a href="https://discord.com" target="_blank">DISCORD_SERVER</a></li>
              <li><a href="https://twitter.com" target="_blank">X_FEED</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BAR - Legal & System Meta */}
      <div className="footer-bottom">
        <div className="footer-container bottom-flex">
          <span className="legal-text">© {currentYear} CMUK_ARCHIVE_SYSTEM. ALL_RIGHTS_RESERVED.</span>
          <div className="system-status">
            <span className="status-dot"></span>
            <span>SYSTEM_STATUS: OPERATIONAL</span>
          </div>
          <span className="timestamp">LAST_UPDATE: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;