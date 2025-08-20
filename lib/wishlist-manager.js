// This file manages our wishlist functionality

const WishlistManager = {
    // Initialize wishlist array
    wishlist: [],
    
    // Function to add a product to the wishlist
    addToWishlist: function(productId) {
        // Check if product is already in wishlist
        if (this.wishlist.includes(productId)) {
            return false;
        }
        
        // Add to wishlist
        this.wishlist.push(productId);
        
        // Save to local storage
        this.saveWishlist();
        
        // Update the counter
        this.updateWishlistCounter();
        
        return true;
    },
    
    // Function to remove a product from the wishlist
    removeFromWishlist: function(productId) {
        const index = this.wishlist.indexOf(productId);
        
        if (index !== -1) {
            this.wishlist.splice(index, 1);
            this.saveWishlist();
            
            // Update the counter
            this.updateWishlistCounter();
            
            return true;
        }
        
        return false;
    },
    
    // Function to check if a product is in the wishlist
    isInWishlist: function(productId) {
        return this.wishlist.includes(productId);
    },
    
    // Function to get all wishlist items
    getWishlist: function() {
        return this.wishlist.map(productId => {
            return products.find(p => p.id === productId);
        }).filter(product => product !== undefined);
    },
    
    // Function to save wishlist to local storage
    saveWishlist: function() {
        localStorage.setItem('myShopWishlist', JSON.stringify(this.wishlist));
    },
    
    // Function to load wishlist from local storage
    loadWishlist: function() {
        const wishlistJson = localStorage.getItem('myShopWishlist');
        this.wishlist = wishlistJson ? JSON.parse(wishlistJson) : [];
        return this.wishlist;
    },
    
    // Function to update the wishlist counter in the header
    updateWishlistCounter: function() {
        const wishlistCountElement = document.querySelector('.wishlist-count');
        if (wishlistCountElement) {
            wishlistCountElement.textContent = this.wishlist.length;
        }
    }
    };
    
    // When the page loads, load wishlist from local storage
    document.addEventListener('DOMContentLoaded', () => {
    console.log('Wishlist manager loaded!');
    WishlistManager.loadWishlist();
    WishlistManager.updateWishlistCounter(); // Update the counter when page loads
    });