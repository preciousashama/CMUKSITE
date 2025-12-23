"use client";
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="site-header">
      <div className="header-main">
        <div className="header-left">SEARCH</div>
        <div className="header-fulllogo">
          <Link href="/"><h1>CMUK</h1></Link>
        </div>
        <div className="header-right">
          <Link href="/cart">COLLECTION ({cartCount})</Link>
        </div>
      </div>
      <nav className="navbar">
        <ul className="nav-menu">
          <li><Link href="/shop">SHOP</Link></li>
          <li><Link href="/studio">3D_STUDIO</Link></li>
          <li><Link href="/gallery">GALLERY</Link></li>
        </ul>
      </nav>
    </header>
  );
}