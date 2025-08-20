'use client';
import { useEffect } from 'react';
import Head from 'next/head';
import '/public/css/global.css';
import '/public/css/components.css';
import '/public/css/header.css';
import '/public/css/footer.css';
import '/public/css/all-reviews.css';
import '/public/css/responsive.css';

export default function AllReviewsPage() {
  useEffect(() => {
    // === Paste your entire all-reviews.js content here ===
    // (Already provided above; just paste it inside this block)
    console.log('All reviews page loaded!');
    // ...
  }, []);

  return (
    <>
      <Head>
        <title>My Shop - All Reviews</title>
      </Head>

      <div id="header-placeholder"></div>

      <main>
        <section className="all-reviews-header">
          <h1>Customer Reviews</h1>

          <div className="review-filters">
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="product-filter">Filter by Product:</label>
                <select id="product-filter">
                  <option value="all">All Products</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="rating-filter">Filter by Rating:</label>
                <select id="rating-filter">
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="review-sort">Sort by:</label>
                <select id="review-sort">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
            </div>
          </div>

          <div className="add-review-container">
            <button id="add-review-btn" className="add-review-btn">Write a Review</button>
          </div>

          <div id="review-form-container" className="review-form-container" style={{ display: 'none' }}>
            <form id="review-form" className="review-form">
              <h3>Write Your Review</h3>

              <div className="form-group">
                <label htmlFor="review-product-select">Product:</label>
                <select id="review-product-select" required>
                  <option value="">Select a product</option>
                </select>
              </div>

              <div className="form-group">
                <label>Rating:</label>
                <div className="rating-input">
                  {[5, 4, 3, 2, 1].map(star => (
                    <span key={star}>
                      <input type="radio" id={`star${star}`} name="rating" value={star} required={star === 5} />
                      <label htmlFor={`star${star}`}>★</label>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="review-title">Title:</label>
                <input type="text" id="review-title" placeholder="Summarize your review" required />
              </div>

              <div className="form-group">
                <label htmlFor="review-comment">Review:</label>
                <textarea id="review-comment" rows="5" placeholder="What did you like or dislike about this product?" required />
              </div>

              <div className="form-group">
                <label htmlFor="review-images">Add Images (optional):</label>
                <input type="file" id="review-images" accept="image/*" multiple />
                <div id="image-preview" className="image-preview"></div>
                <div className="selected-images-count">0 images selected</div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-review-btn">Submit Review</button>
                <button type="button" id="cancel-review-btn" className="cancel-review-btn">Cancel</button>
              </div>
            </form>
          </div>
        </section>

        <section id="all-reviews-list" className="all-reviews-list">
          <div className="reviews-grid">
            <p className="loading-message">Loading reviews...</p>
          </div>
        </section>

        <button id="back-to-top" className="back-to-top-btn" aria-label="Back to top">↑</button>

        <div id="image-modal" className="image-modal">
          <span className="close-modal">&times;</span>
          <img className="modal-image" id="modal-image" />
        </div>
      </main>

      <div id="footer-placeholder"></div>
    </>
  );
}
