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
            <img src="/assets/logo.png" alt="Logo" />
          </Link>
        </div>

        <div className="search-container">
          <form id="search-form">
            <input type="search" id="search-input" placeholder="Search products..." />
            <button id="search-button" type="submit">🔍</button>
          </form>
        </div>

        <div className="header-right header-icons">
          <Link href="/cart">
            <img src="/assets/icons/cart.svg" alt="Cart" className="icon-basket" />
          </Link>
          <Link href="/account">
            <span>Account</span>
          </Link>
        </div>
      </div>

      <nav className="navbar">
        <ul className="nav-menu">
          <li className="nav-item"><Link href="/products">Products</Link></li>
          <li className="nav-item"><Link href="/stickers">Stickers</Link></li>
          <li className="nav-item"><Link href="/apparel">Apparel</Link></li>
          <li className="nav-item"><Link href="/party-occasions">Party</Link></li>
          <li className="nav-item"><Link href="/subscriptions">Subscriptions</Link></li>
        </ul>
      </nav>
    </header>
  );
}
