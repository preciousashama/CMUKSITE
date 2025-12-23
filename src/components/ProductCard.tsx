"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductProps {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  isNew?: boolean;
}

const ProductCard = ({ id, name, price, category, imageUrl, isNew }: ProductProps) => {
  return (
    <Link href={`/product/${id}`} className="product-item">
      {/* Product Image Container */}
      <div className="product-image">
        {isNew && <span className="product-tag">NEW_ENTRY</span>}
        <Image 
          src={imageUrl} 
          alt={name} 
          width={400} 
          height={400} 
          className="archive-img"
          priority={false}
        />
      </div>

      {/* Product Metadata (The Manifest) */}
      <div className="product-meta">
        <div className="meta-top">
          <span className="product-category">{category}</span>
          <span className="product-id">REF_{id.substring(0, 6)}</span>
        </div>
        <h3 className="product-name">{name}</h3>
        <div className="meta-bottom">
          <span className="product-price">${price.toFixed(2)}</span>
          <span className="product-action">VIEW_DETAILS →</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;