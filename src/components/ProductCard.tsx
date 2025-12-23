"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ProductProps {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  isNew?: boolean;
}

const ProductCard = ({ id, name, price, category, imageUrl, isNew }: ProductProps) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents navigating to the product page when clicking "Add"
    addToCart({
      id,
      name,
      price,
      imageUrl,
      quantity: 1
    });
    
    // Optional: Visual feedback
    const btn = e.currentTarget as HTMLButtonElement;
    const originalText = btn.innerText;
    btn.innerText = "ADDED_TO_ARCHIVE";
    btn.style.background = "#00ff00";
    btn.style.color = "#000";
    
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.background = "black";
      btn.style.color = "white";
    }, 1500);
  };

  return (
    <div className="product-card" style={styles.card}>
      <Link href={`/products/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        
        {/* IMAGE CONTAINER */}
        <div style={styles.imageWrapper}>
          {isNew && <span style={styles.newTag}>NEW_RELEASE</span>}
          <img 
            src={imageUrl} 
            alt={name} 
            style={styles.image} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>

        {/* INFO SECTION */}
        <div style={styles.info}>
          <div style={styles.meta}>
            <span style={styles.category}>{category}</span>
            <span style={styles.price}>${price.toFixed(2)}</span>
          </div>
          <h3 style={styles.name}>{name}</h3>
        </div>
      </Link>

      {/* QUICK ACTIONS */}
      <button 
        onClick={handleQuickAdd}
        style={styles.quickAddBtn}
      >
        ADD_TO_COLLECTION +
      </button>
    </div>
  );
};

// BRUTALIST INLINE STYLES (Syncs with CMUK Archive Aesthetic)
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    border: '1px solid #000',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.2s ease',
    height: '100%',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '3/4',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #000',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  newTag: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: '#000',
    color: '#fff',
    fontSize: '8px',
    fontWeight: 900,
    padding: '4px 8px',
    zIndex: 10,
    letterSpacing: '1px',
  },
  info: {
    padding: '15px',
    flexGrow: 1,
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  category: {
    fontSize: '9px',
    fontWeight: 900,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  price: {
    fontSize: '11px',
    fontWeight: 900,
  },
  name: {
    fontSize: '14px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  quickAddBtn: {
    width: '100%',
    padding: '15px',
    background: '#000',
    color: '#fff',
    border: 'none',
    borderTop: '1px solid #000',
    fontSize: '10px',
    fontWeight: 900,
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    transition: 'all 0.2s ease',
  }
};

export default ProductCard;