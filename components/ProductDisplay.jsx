// src/components/ProductDisplay.jsx
import React from 'react';
import { products, formatPrice } from '../data/products.js';

function ProductDisplay() {
  const product = products[0]; // Just showing the first product for example

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{formatPrice(product.price)}</p>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
    </div>
  );
}

export default ProductDisplay;
