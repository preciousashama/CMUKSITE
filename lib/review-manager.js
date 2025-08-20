// lib/reviewManager.js
import { getCurrentUser, isLoggedIn } from './userManager';

let reviews = [];

// Helper: Save to localStorage
function saveReviews() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('myShopReviews', JSON.stringify(reviews));
  }
}

// Helper: Load from localStorage
function loadReviews() {
  if (typeof window !== 'undefined') {
    const reviewsJson = localStorage.getItem('myShopReviews');
    reviews = reviewsJson ? JSON.parse(reviewsJson) : [];

    // Ensure backward compatibility
    reviews.forEach(review => {
      if (!review.images) {
        review.images = review.image ? [review.image] : [];
      }
    });
  }
  return reviews;
}

// Add a review
function addReview(productId, reviewData, callback) {
  const user = isLoggedIn() ? getCurrentUser() : null;

  const review = {
    id: Date.now(),
    productId,
    userId: user ? user.id : null,
    username: user ? user.username : reviewData.guestName,
    rating: reviewData.rating,
    title: reviewData.title,
    comment: reviewData.comment,
    images: reviewData.images || [],
    date: new Date().toISOString(),
    helpful: 0,
    notHelpful: 0
  };

  if (review.images.length === 0 && reviewData.image) {
    review.images = [reviewData.image];
    review.image = reviewData.image;
  } else if (review.images.length > 0) {
    review.image = review.images[0];
  }

  reviews.push(review);
  saveReviews();

  if (typeof callback === 'function') {
    callback(review);
  }

  if (typeof window !== 'undefined') {
    document.dispatchEvent(new CustomEvent('reviewAdded', { detail: { review } }));
  }

  return review;
}

// Delete a review
function deleteReview(reviewId) {
  const index = reviews.findIndex(r => r.id === reviewId);
  if (index !== -1) {
    reviews.splice(index, 1);
    saveReviews();

    if (typeof window !== 'undefined') {
      document.dispatchEvent(new CustomEvent('reviewDeleted', { detail: { reviewId } }));
    }

    return true;
  }
  return false;
}

// Get all reviews for a product
function getProductReviews(productId) {
  return reviews.filter(r => r.productId === productId);
}

// Calculate average rating
function getProductAverageRating(productId) {
  const productReviews = getProductReviews(productId);
  if (productReviews.length === 0) return 0;
  const total = productReviews.reduce((sum, r) => sum + r.rating, 0);
  return total / productReviews.length;
}

// Mark as helpful
function markReviewHelpful(reviewId) {
  const review = reviews.find(r => r.id === reviewId);
  if (review) {
    review.helpful++;
    saveReviews();
    return true;
  }
  return false;
}

// Mark as not helpful
function markReviewNotHelpful(reviewId) {
  const review = reviews.find(r => r.id === reviewId);
  if (review) {
    review.notHelpful++;
    saveReviews();
    return true;
  }
  return false;
}

// Add sample reviews (for testing/demo)
function addSampleReviews() {
  if (reviews.length > 0) return;

  // Add a few sample reviews (same as your original)
  reviews = [
    {
      id: 1001,
      productId: 1,
      userId: null,
      username: 'JohnDoe',
      rating: 5,
      title: 'Great T-Shirt!',
      comment: 'Super comfy. Still looks new after many washes.',
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'],
      date: '2023-05-15T10:30:00.000Z',
      helpful: 12,
      notHelpful: 2
    },
    {
      id: 1002,
      productId: 1,
      userId: null,
      username: 'SarahM',
      rating: 4,
      title: 'Good quality but runs small',
      comment: 'Runs small. Size up.',
      images: [],
      date: '2023-06-20T14:45:00.000Z',
      helpful: 8,
      notHelpful: 1
    }
  ];

  saveReviews();
}

export const ReviewManager = {
  addReview,
  deleteReview,
  getProductReviews,
  getProductAverageRating,
  markReviewHelpful,
  markReviewNotHelpful,
  loadReviews,
  addSampleReviews
};
