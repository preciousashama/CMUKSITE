'use client';
import { useEffect } from 'react';

export default function AppInitializer({ products, ReviewManager, CartManager }) {
  useEffect(() => {
    console.log('Welcome to My Shop! The website is loaded and ready.');

    // Newsletter form functionality
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');

    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('newsletter-email').value;

        console.log('Newsletter signup:', email);
        newsletterMessage.textContent = 'Thank you for subscribing!';
        newsletterMessage.className = 'newsletter-message success';
        newsletterForm.reset();

        setTimeout(() => {
          newsletterMessage.textContent = '';
          newsletterMessage.className = 'newsletter-message';
        }, 3000);
      });
    }

    // Featured reviews functionality
    const featuredReviewsContainer = document.getElementById('featured-reviews-container');
    if (featuredReviewsContainer && ReviewManager?.reviews?.length) {
      const topReviews = ReviewManager.reviews
        .sort((a, b) => b.rating - a.rating || b.helpful - a.helpful)
        .slice(0, 3);

      if (topReviews.length === 0) {
        featuredReviewsContainer.innerHTML = '<p>No reviews yet.</p>';
      } else {
        featuredReviewsContainer.innerHTML = '';

        topReviews.forEach(review => {
          const product = products.find(p => p.id === review.productId);
          if (!product) return;

          let starsHtml = '';
          for (let i = 0; i < 5; i++) {
            starsHtml += i < review.rating
              ? '<span class="star full">★</span>'
              : '<span class="star empty">☆</span>';
          }

          const reviewCard = document.createElement('div');
          reviewCard.className = 'featured-review-card';
          reviewCard.innerHTML = `
            <div class="review-header">
              <div class="review-rating">${starsHtml}</div>
              <div class="review-title">${review.title}</div>
            </div>
            <div class="review-content">
              <p>${review.comment.length > 150 ? review.comment.substring(0, 150) + '...' : review.comment}</p>
            </div>
            <div class="review-meta">
              <span class="review-author">By ${review.username}</span>
              <span class="review-product">for <a href="/product-detail?id=${product.id}">${product.name}</a></span>
            </div>
            ${review.image ? `<div class="review-image"><img src="${review.image}" alt="Review image"></div>` : ''}
          `;
          featuredReviewsContainer.appendChild(reviewCard);
        });
      }
    }

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.product-card .btn');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', () => {
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3')?.textContent;
        const product = products.find(p => p.name === productName);
        if (product) {
          CartManager.addToCart(product.id, 1);
          alert(`${productName} has been added to your cart!`);
        }
      });
    });

  }, [products, ReviewManager, CartManager]);

  return null; // No UI — just JS behavior
}
