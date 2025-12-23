import React from 'react';
import ProductCard from '@/components/ProductCard';
import products from '@/lib/products.json';
import Link from 'next/link';

// NOTE: Ensure your global index.css is imported in layout.tsx or here
import "../styles/index.css";

export default function HomePage() {
  return (
    <div className="home-wrapper">
      
      {/* 1. CINEMATIC HERO SLIDER */}
      <section className="main-image-slider">
        <div className="slider-container">
          <div className="slide">
            <img src="https://placehold.co/1920x1080/000000/FFFFFF/png?text=CMUK+STILL_01" alt="Hero 1" />
            <div className="slide-buttons">
              <button>VIEW_COLLECTION</button>
              <button>STUDIO_ACCESS</button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BEST SELLERS (THE MANIFEST GRID) */}
      <section className="best-sellers-section">
        <div className="container">
          <div className="best-sellers-title">
            <h1 className="brand-heading">ARCHIVE_BEST</h1>
          </div>
          
          <div className="best-sellers-images">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                category={product.category}
                imageUrl={product.imageUrl}
                isNew={product.isNew}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. REVIEWS (THE SYSTEM NODES) */}
      <section className="reviews-section">
        <div className="bubbles-wrapper">
          <div className="title-button-group">
            <h2 id="reviews-title">SYSTEM_FEEDBACK</h2>
            <Link href="/reviews" className="btn">VIEW_ALL_NODES</Link>
          </div>
          
          {/* Static placeholders for the animated nodes we styled */}
          <div className="bubbles-container">
            <div className="bubble" style={{ top: '10%', left: '15%' }}>"ELITE QUALITY" - REF_042</div>
            <div className="bubble" style={{ top: '60%', left: '70%' }}>"3D RENDERING ACCURATE" - REF_099</div>
          </div>
        </div>
      </section>

    </div>
  );
}