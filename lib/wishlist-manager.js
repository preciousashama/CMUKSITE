// lib/wishlist-manager.js
import { products } from './products-manager'; // Needed for getWishlist

const WishlistManager = {
  wishlist: [],

  addToWishlist: function (productId) {
    if (this.wishlist.includes(productId)) return false;

    this.wishlist.push(productId);
    if (typeof window !== 'undefined') {
      this.saveWishlist();
      this.updateWishlistCounter();
    }

    return true;
  },

  removeFromWishlist: function (productId) {
    const index = this.wishlist.indexOf(productId);
    if (index !== -1) {
      this.wishlist.splice(index, 1);
      if (typeof window !== 'undefined') {
        this.saveWishlist();
        this.updateWishlistCounter();
      }
      return true;
    }
    return false;
  },

  isInWishlist: function (productId) {
    return this.wishlist.includes(productId);
  },

  getWishlist: function () {
    // Ensure wishlist is loaded before returning items
    if (typeof window !== 'undefined' && this.wishlist.length === 0) {
      this.loadWishlist();
    }

    return this.wishlist
      .map(productId => products.find(p => p.id === productId))
      .filter(Boolean);
  },

  saveWishlist: function () {
    if (typeof window !== 'undefined') {
      localStorage.setItem('myShopWishlist', JSON.stringify(this.wishlist));
    }
  },

  loadWishlist: function () {
    if (typeof window !== 'undefined') {
      const wishlistJson = localStorage.getItem('myShopWishlist');
      this.wishlist = wishlistJson ? JSON.parse(wishlistJson) : [];
    }
    return this.wishlist;
  },

  updateWishlistCounter: function () {
    if (typeof document !== 'undefined') {
      const wishlistCountElement = document.querySelector('.wishlist-count');
      if (wishlistCountElement) {
        wishlistCountElement.textContent = this.wishlist.length;
      }
    }
  }
};

// Don't execute DOM code at the top level
// Instead, expose an init function
export function initWishlistManager() {
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Wishlist manager loaded!');
      WishlistManager.loadWishlist();
      WishlistManager.updateWishlistCounter();
    });
  }
}

export { WishlistManager };
