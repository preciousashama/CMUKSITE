import Link from 'next/link';

export default function Header() {
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
<div className="search-container">
  <form id="search-form">
    <input
      type="search"
      id="search-input"
      placeholder="Search products..."
    />
    <button id="search-button" type="submit">
      <img
        src="/assets/search.png"
        alt="Search Icon"
        className="icon-search"
      />
    </button>
  </form>
</div>
    
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

<nav className="navbar">
  <ul className="nav-menu">
    <li className="nav-item has-dropdown">
      <Link href="/Shop">Shop</Link>

      <div className="dropdown-menu">
        {/* Apparel Section */}
        <div className="dropdown-section">
          <span className="dropdown-heading">Apparel</span>
          <ul>
            <li><Link href="/Shop/T-shirts">T-shirts</Link></li>
            <li><Link href="/Shop/Tops">Tops</Link></li>
            <li><Link href="/Shop/Jeans">Jeans</Link></li>
            <li><Link href="/Shop/Hoodies">Hoodies</Link></li>
          </ul>
        </div>

        {/* Accessories Section */}
        <div className="dropdown-section">
          <span className="dropdown-heading">Accessories</span>
          <ul>
            <li><Link href="/Shop/Hats">Hats</Link></li>
            <li><Link href="/Shop/Bags">Bags</Link></li>
          </ul>
        </div>
      </div>
    </li>

    {/* Other nav items */}
    <li className="nav-item"><Link href="/Design Artwork">Design Artwork</Link></li>
    <li className="nav-item"><Link href="/Send Items In">Send Items In</Link></li>
    <li className="nav-item"><Link href="/Installation">Installation</Link></li>
    <li className="nav-item"><Link href="/Subscriptions">Subscriptions</Link></li>
  </ul>
</nav>

    </header>
  );
}
