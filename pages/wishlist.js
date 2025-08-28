// pages/wishlist.js
import { useEffect, useState, useContext } from 'react';
import { WishlistManager, initWishlistManager } from '../lib/wishlist-manager';
import { CartContext } from '../lib/CartContext.js/index.js';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    initWishlistManager(); // Ensures safe loading on client side
    const items = WishlistManager.getWishlist();
    setWishlistItems(items);
  }, []);

  const handleAddToCart = (productId) => {
    addToCart(productId, 1); // You may need to define quantity inside addToCart
    alert('Product added to cart!');
  };

  const handleRemoveFromWishlist = (productId) => {
    WishlistManager.removeFromWishlist(productId);
    setWishlistItems(WishlistManager.getWishlist());
  };

  if (wishlistItems.length === 0) {
    return (
      <div>
        <p>Your wishlist is empty.</p>
        <a href="/products">Go Shopping</a>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {wishlistItems.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p className="product-price">£{product.price.toFixed(2)}</p>
          <p className="product-category">Category: {product.category}</p>
          <div className="product-actions">
            <a href={`/product-detail?id=${product.id}`} className="btn view-btn">
              View Details
            </a>
            <button
              className="btn add-to-cart-btn"
              onClick={() => handleAddToCart(product.id)}
            >
              Add to Cart
            </button>
            <button
              className="btn remove-wishlist-btn"
              onClick={() => handleRemoveFromWishlist(product.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
