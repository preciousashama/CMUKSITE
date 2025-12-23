import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import products from '@/lib/products.json';

// Importing the specific homepage styles
import "../styles/index.css";

export default function HomePage() {
  return (
    <div className="home-wrapper">
      
      {/* 1. CINEMATIC HERO SLIDER */}
      {/* This section uses the 90vh height and cubic-bezier transitions from our CSS */}
      <section className="main-image-slider">
        <div className="slider-container">
          <div className="slide">
            <img 
              src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop" 
              alt="CMUK_ARCHIVE_HERO" 
            />
            <div className="slide-buttons">
              <Link href="/shop">
                <button>ACCESS_COLLECTION</button>
              </Link>
              <Link href="/studio">
                <button>ENTER_3D_STUDIO</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BEST SELLERS (THE PRODUCT MANIFEST) */}
      <section className="best-sellers-section">
        <div className="container">
          <div className="best-sellers-title">
            <h1 className="brand-heading">ARCHIVE_BEST</h1>
          </div>
          
          {/* This grid uses the 2px gap "seam" effect from index.css */}
          <div className="best-sellers-images">
            {products.slice(0, 3).map((product) => (
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

      {/* 3. REVIEWS (THE SYSTEM FEEDBACK NODES) */}
      <section className="reviews-section">
        <div className="bubbles-wrapper">
          <div className="title-button-group">
            <h2 id="reviews-title" className="brand-heading">SYSTEM_FEEDBACK</h2>
            <p className="protocol-label" style={{ color: 'white', marginBottom: '20px' }}>
              VERIFIED_USER_DATA_STREAM
            </p>
            <Link href="/reviews" className="btn">VIEW_ALL_NODES</Link>
          </div>
          
          {/* These 'bubbles' are the floating square nodes we styled */}
          <div className="bubbles-container">
            <div className="bubble" style={{ top: '15%', left: '10%' }}>
              "THE_FIT_IS_ENGINEERED_PERFECTLY" <br/> - USER_882
            </div>
            <div className="bubble" style={{ top: '55%', left: '75%' }}>
              "RENDER_TO_REALITY_ACCURACY: 99%" <br/> - ARCHIVE_MEMBER
            </div>
            <div className="bubble" style={{ top: '20%', left: '80%' }}>
              "HEAVY_JERSEY_DENSITY_IS_ELITE" <br/> - REF_LOG
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER CALL TO ACTION */}
      <section style={{ padding: '100px 40px', textAlign: 'center', borderTop: '1px solid #eee' }}>
        <p className="protocol-label">ST_PROTOCOL_READY</p>
        <h2 className="brand-heading" style={{ fontSize: '3rem' }}>START_YOUR_ARCHIVE</h2>
        <Link href="/studio" className="primary-btn" style={{ marginTop: '30px' }}>
          OPEN_STUDIO_V.01
        </Link>
      </section>

    </div>
  );
}