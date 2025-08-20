// components/Header.js
import { useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  useEffect(() => {
    // Equivalent of the updateActiveNavigation from your JS
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a, .nav-item > a');

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      link.closest('.nav-item')?.classList.remove('active');

      if (
        linkPath === currentPath ||
        (currentPath === '/' && linkPath === '/') ||
        (currentPath.includes(linkPath) && linkPath !== '/')
      ) {
        link.closest('.nav-item')?.classList.add('active');
      }
    });

    // If you need to trigger any global user/cart logic,
    // move those into React context or run them here
    if (typeof window !== 'undefined') {
      if (window.UserManager) window.UserManager.updateUI?.();
      if (window.CartManager) window.CartManager.updateCartCount?.();
      if (window.WishlistManager) window.WishlistManager.updateWishlistCounter?.();
      if (window.initializeSearchBar) window.initializeSearchBar();
    }
  }, []);

  return (
    <header className="site-header">
      <nav className="nav-menu">
        <ul>
          <li className="nav-item">
            <Link href="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link href="/apparel">Apparel</Link>
          </li>
          <li className="nav-item">
            <Link href="/stickers">Stickers</Link>
          </li>
          <li className="nav-item">
            <Link href="/party-occasions">Party</Link>
          </li>
          {/* Add more nav items if you had them in header.html */}
        </ul>
      </nav>
    </header>
  );
}
