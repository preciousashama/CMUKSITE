'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Optional: for form submission
import { products } from '../data/products';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 1) {
      const lower = term.toLowerCase();
      const results = products.filter((p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.category && p.category.toLowerCase().includes(lower)) ||
        (p.description && p.description.toLowerCase().includes(lower)) ||
        (p.size && p.size.toLowerCase().includes(lower)) ||
        (p.colors && p.colors.join('').toLowerCase().includes(lower))
      );
      setFilteredResults(results.slice(0, 5)); // Limit to 5
      setShowDropdown(true);
    } else {
      setFilteredResults([]);
      setShowDropdown(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <header className="site-header">
      <div className="header-top-bar">
        FREE SHIPPING ON ORDERS OVER £150
      </div>
      <div className="contact-us-bar">
        Need help? Contact us at info@customisemeuk.com | 07588770901 | 10am - 7pm
      </div>

      <div className="header-main">
        <div className="header-left logo">
          <Link href="/">
            <img src="assets/icon.png" alt="Logo" />
          </Link>
        </div>

        {/* SEARCH BAR */}
        <div className="search-container">
          <form id="search-form" onSubmit={handleSubmit}>
            <input
              type="search"
              id="search-input"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => searchTerm.length > 1 && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // delay to allow click
            />
            <button id="search-button" type="submit">
              <img
                src="/assets/search.png"
                alt="Search Icon"
                className="icon-search"
              />
            </button>
          </form>

          {showDropdown && (
            <div className="search-results">
              {filteredResults.length > 0 ? (
                filteredResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="search-result-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <img
                      src={product.image || '/placeholder.png'}
                      alt={product.name}
                      className="search-result-image"
                    />
                    <div className="search-result-info">
                      <div className="search-result-name">{product.name}</div>
                      <div className="search-result-details">
                        <div className="search-result-price">£{product.price}</div>
                        <div className="search-result-category">{product.category}</div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="no-results">No matching products</div>
              )}
            </div>
          )}
        </div>

        {/* HEADER ICONS */}
        <div className="header-right header-icons">
          <Link href="/currency">
            <img src="/assets/globe.png" alt="currency" className="icon-currency" />
          </Link>
          <Link href="/wishlist">
            <img src="/assets/heart.png" alt="wishlist" className="icon-wishlist" />
          </Link>
          <Link href="/cart">
            <img src="/assets/Basketicon.png" alt="Cart" className="icon-basket" />
          </Link>
          <Link href="/account">
            <span>Sign In / Sign Up</span>
          </Link>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <nav className="navbar">
        <ul className="nav-menu">
          <li className="nav-item has-dropdown">
            <Link href="/Shop">Shop</Link>

            <div className="dropdown-menu">
              {/* Apparel Section */}
              <div className="dropdown-section">
                <span className="dropdown-heading">APPAREL</span>
                <ul>
                  <li><Link href="/Shop/T-shirts">T-shirts</Link></li>
                  <li><Link href="/Shop/Tops">Tops</Link></li>
                  <li><Link href="/Shop/Jeans">Jeans</Link></li>
                  <li><Link href="/Shop/Hoodies">Hoodies</Link></li>
                </ul>
              </div>

              {/* Accessories Section */}
              <div className="dropdown-section">
                <span className="dropdown-heading">ACCESSORIES</span>
                <ul>
                  <li><Link href="/Shop/Hats">Hats</Link></li>
                  <li><Link href="/Shop/Bags">Bags</Link></li>
                </ul>
              </div>

              {/* Party Section */}
              <div className="dropdown-section">
                <span className="dropdown-heading">PARTY</span>
                <ul>
                  <li><Link href="/Shop/T-shirts">T-shirts</Link></li>
                  <li><Link href="/Shop/Tops">Tops</Link></li>
                  <li><Link href="/Shop/Jeans">Jeans</Link></li>
                  <li><Link href="/Shop/Hoodies">Hoodies</Link></li>
                </ul>
              </div>

              {/* Events Section */}
              <div className="dropdown-section">
                <span className="dropdown-heading">EVENTS</span>
                <ul>
                  <li><Link href="/Shop/T-shirts">T-shirts</Link></li>
                  <li><Link href="/Shop/Tops">Tops</Link></li>
                  <li><Link href="/Shop/Jeans">Jeans</Link></li>
                  <li><Link href="/Shop/Hoodies">Hoodies</Link></li>
                </ul>
              </div>

              {/* Corporate Section */}
              <div className="dropdown-section">
                <span className="dropdown-heading">CORPORATE</span>
                <ul>
                  <li><Link href="/Shop/T-shirts">T-shirts</Link></li>
                  <li><Link href="/Shop/Tops">Tops</Link></li>
                  <li><Link href="/Shop/Jeans">Jeans</Link></li>
                  <li><Link href="/Shop/Hoodies">Hoodies</Link></li>
                </ul>
              </div>
            </div>
          </li>

          {/* Other nav items */}
          <li className="nav-item"><Link href="/Design Artwork">Design Artwork</Link></li>
          <li className="nav-item"><Link href="/Send Items In">Send Items In</Link></li>
          <li className="nav-item"><Link href="/Installation">Installation</Link></li>
          <li className="nav-item"><Link href="/Subscriptions">Subscriptions</Link></li>
          <li className="nav-item"><Link href="/Gallery">Gallery</Link></li>
        </ul>
      </nav>
    </header>
  );
}
