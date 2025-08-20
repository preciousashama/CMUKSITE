// pages/apparel.js
import { useEffect } from 'react';

export default function ApparelPage({ products, ReviewManager, CartManager }) {
  useEffect(() => {
    console.log('Welcome to My Shop! The website is loaded and ready.');

    // Newsletter form functionality
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');

    if (newsletterForm) {
      const submitHandler = (event) => {
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
      };
      newsletterForm.addEventListener('submit', submitHandler);
      return () => newsletterForm.removeEventListener('submit', submitHandler);
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
      const clickHandler = () => {
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3')?.textContent;
        const product = products.find(p => p.name === productName);
        if (product) {
          CartManager.addToCart(product.id, 1);
          alert(`${productName} has been added to your cart!`);
        }
      };
      button.addEventListener('click', clickHandler);
      // Clean up event listener on unmount
      return () => button.removeEventListener('click', clickHandler);
    });
  }, [products, ReviewManager, CartManager]);

  return (
    <>
      {/* Header placeholder */}
      <div id="header-placeholder"></div>

      {/* Main content */}
      <main className="products-page">
        <div className="container">
          {/* Products Header */}
          <div className="products-header">
            <h1 className="products-title">Apparel</h1>
            <div className="sort-by-container">
              <div className="sort-options">
                <label htmlFor="sort-select">Sort by:</label>
                <select id="sort-select">
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              <div className="items-per-page">
                <label htmlFor="items-per-page-select">Items per page:</label>
                <select id="items-per-page-select">
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                </select>
              </div>

              <div className="view-options">
                <button className="view-btn grid-view active"><i className="fas fa-th"></i></button>
              </div>
            </div>
          </div>

          <div className="products-main-area">
            {/* Filters Sidebar */}
            <aside className="filters-sidebar">
              {/* SIZE Filter */}
              <div className="filter-section">
                <h3 className="filter-heading">SIZE</h3>
                <ul className="filter-list">
                  <li>
                    <input type="checkbox" id="size-Adult" value="Adult" />
                    <label htmlFor="size-Adult">Adult <span className="count"></span></label>
                  </li>
                  <li>
                    <input type="checkbox" id="size-Junior" value="Junior" />
                    <label htmlFor="size-Junior">Junior & Kids <span className="count"></span></label>
                  </li>
                  <li>
                    <input type="checkbox" id="size-Toddlers" value="Toddlers" />
                    <label htmlFor="size-Toddlers">Toddlers & Baby <span className="count"></span></label>
                  </li>
                </ul>
              </div>

              {/* Colour Filter */}
              <div className="filter-section">
                <h3 className="filter-heading">COLOUR</h3>
                <ul className="filter-list">
                  <li>
                    <input type="checkbox" id="colour-black" value="Black" />
                    <label htmlFor="colour-black">Black <span className="count"></span></label>
                  </li>
                  <li>
                    <input type="checkbox" id="colour-white" value="White" />
                    <label htmlFor="colour-white">White <span className="count"></span></label>
                  </li>
                  <li>
                    <input type="checkbox" id="colour-blue" value="Blue" />
                    <label htmlFor="colour-blue">Blue <span className="count"></span></label>
                  </li>
                  <li>
                    <input type="checkbox" id="colour-red" value="Red" />
                    <label htmlFor="colour-red">Red <span className="count"></span></label>
                  </li>
                </ul>
              </div>
            </aside>

            {/* Products Content */}
            <div className="products-content">
              <div className="products-grid" id="products-grid">
                {/* Products will be loaded here by JavaScript */}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="pagination">
            {/* Pagination will be generated by JavaScript */}
          </div>
        </div>
      </main>

      {/* Footer placeholder */}
      <div id="footer-placeholder"></div>
    </>
  );
}
