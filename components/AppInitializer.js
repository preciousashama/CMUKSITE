'use client';
import React, { useState, useEffect, useMemo } from 'react';

// 1. Sub-component for Review Cards (Clean & Secure)
const ReviewCard = ({ review, product }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`star ${i < review.rating ? 'full' : 'empty'}`}>
      {i < review.rating ? '★' : '☆'}
    </span>
  ));

  return (
    <div className="featured-review-card">
      <div className="review-header">
        <div className="review-rating">{stars}</div>
        <div className="review-title">{review.title}</div>
      </div>
      <div className="review-content">
        <p>{review.comment.length > 150 ? review.comment.substring(0, 150) + '...' : review.comment}</p>
      </div>
      <div className="review-meta">
        <span className="review-author">By {review.username}</span>
        <span className="review-product">
          for <a href={`/product-detail?id=${product.id}`}>{product.name}</a>
        </span>
      </div>
      {review.image && (
        <div className="review-image">
          <img src={review.image} alt="Review" />
        </div>
      )}
    </div>
  );
};

export default function AppInitializer({ products, ReviewManager, CartManager }) {
  const [status, setStatus] = useState({ message: '', type: '' });

  // 2. Logic for top reviews (Memoized for performance)
  const topReviews = useMemo(() => {
    if (!ReviewManager?.reviews) return [];
    return [...ReviewManager.reviews]
      .sort((a, b) => b.rating - a.rating || b.helpful - a.helpful)
      .slice(0, 3);
  }, [ReviewManager?.reviews]);

  useEffect(() => {
    // 3. Newsletter Handler
    const handleNewsletter = (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email')?.value;
      
      console.log('Newsletter signup:', email);
      setStatus({ message: 'Thank you for subscribing!', type: 'success' });
      e.target.reset();

      setTimeout(() => setStatus({ message: '', type: '' }), 3000);
    };

    // 4. Global Event Delegation for "Add to Cart"
    // Better than querySelectorAll because it handles items added to the page later
    const handleGlobalClick = (e) => {
      const btn = e.target.closest('.add-to-cart-btn');
      if (btn) {
        const productId = btn.dataset.productId;
        const product = products.find(p => p.id === productId);
        if (product) {
          CartManager.addToCart(product.id, 1);
          alert(`${product.name} added to cart!`);
        }
      }
    };

    const form = document.getElementById('newsletter-form');
    form?.addEventListener('submit', handleNewsletter);
    document.addEventListener('click', handleGlobalClick);

    // CLEANUP: Removes listeners when component unmounts
    return () => {
      form?.removeEventListener('submit', handleNewsletter);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [products, CartManager]);

  // Note: For the Review Cards to appear, you would typically 
  // render them here or use a React Portal. 
  // If you must inject into a legacy div:
  return (
    <>
      {/* This renders the message into the existing DOM flow if you place this component correctly */}
      {status.message && (
        <style>{`
          #newsletter-message { display: block; color: ${status.type === 'success' ? 'green' : 'red'}; }
        `}</style>
      )}
    </>
  );
}