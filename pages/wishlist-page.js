// pages/wishlist-page.js

import { useEffect, useState } from 'react';
import { WishlistManager } from '../lib/wishlist-manager'; // adjust if needed
import { CartManager } from '../lib/cart-manager'; // adjust if needed
import { products } from '../data/products'; // adjust if needed

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const items = WishlistManager.getWishlist();
      setWishlistItems(items);
    }
  }, []);

  const handleAddToCart = (productId) => {
    CartManager.addToCart(productId, 1);
    const product = products.find(p => p.id === productId);
    if (product) {
      alert(`${product.name} has been added to your cart!`);
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    WishlistManager.removeFromWishlist(productId);
    const updatedItems = WishlistManager.getWishlist();
    setWishlistItems(updatedItems);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="empty-wishlist">
        <p>Your wishlist is empty.</p>
        <a href="/products" className="btn">Go Shopping</a>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {wishlistItems.map(product => (
        <div className="product-card" key={product.id}>
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-category">Category: {product.category}</p>
          <div className="product-actions">
            <a href={`/product-detail?id=${product.id}`} className="btn view-btn">View Details</a>
            <button className="btn add-to-cart-btn" onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
            <button className="btn remove-wishlist-btn" onClick={() => handleRemoveFromWishlist(product.id)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}
