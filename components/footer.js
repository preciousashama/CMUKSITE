import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1 */}
          <div className="footer-col">
            <h4>About Us</h4>
            <p className="tagline">
              Creative Merch UK offers premium designs, custom prints, and party essentials crafted with care.
            </p>
          </div>

          {/* Column 2 */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/apparel">Apparel</a></li>
              <li><a href="/stickers">Stickers</a></li>
              <li><a href="/party-occasions">Party Supplies</a></li>
              <li><a href="/all-reviews">Reviews</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-col">
            <h4>Contact</h4>
            <p>Email: support@cmuk.co.uk</p>
            <p>Instagram: @cmuk_official</p>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="copyright">
            © {new Date().getFullYear()} Creative Merch UK · All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
