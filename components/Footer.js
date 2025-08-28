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
              <li><a href="/apparel">SHOP</a></li>
              <li><a href="/stickers">DESIGN STUDIO</a></li>
              <li><a href="/party-occasions">SEND ITEMS IN</a></li>
              <li><a href="/all-reviews">INSTALLATIONS</a></li>
              <li><a href="/all-reviews">SUBSCRIPTIONS</a></li>
              <li><a href="/all-reviews">SIGN IN/SIGN UP</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-col">
            <h4>Contact</h4>
            <p>Email: hello@customisemeuk.com</p>
            <p>Instagram: @customisemeuk</p>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="copyright">
            © {new Date().getFullYear()} Customise Me UK - Since 2023· All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
