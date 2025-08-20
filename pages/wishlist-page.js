// wishlist-page.js

document.addEventListener('DOMContentLoaded', () => {
  console.log('Wishlist page loaded!');

  const wishlistItemsElement = document.getElementById('wishlist-items');

  function displayWishlistItems() {
    const wishlistItems = WishlistManager.getWishlist();

    if (wishlistItems.length === 0) {
      wishlistItemsElement.innerHTML = `
        <div class="empty-wishlist">
          <p>Your wishlist is empty.</p>
          <a href="/products" class="btn">Go Shopping</a>
        </div>
      `;
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'product-grid';

    wishlistItems.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';

      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <p class="product-category">Category: ${product.category}</p>
        <div class="product-actions">
          <a href="/product-detail?id=${product.id}" class="btn view-btn">View Details</a>
          <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
          <button class="btn remove-wishlist-btn" data-id="${product.id}">Remove</button>
        </div>
      `;

      grid.appendChild(productCard);
    });

    wishlistItemsElement.innerHTML = '';
    wishlistItemsElement.appendChild(grid);

    // Add to Cart handlers
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const productId = parseInt(event.target.dataset.id);
        CartManager.addToCart(productId, 1);
        const product = products.find(p => p.id === productId);
        if (product) {
          alert(`${product.name} has been added to your cart!`);
        }
      });
    });

    // Remove from Wishlist handlers
    document.querySelectorAll('.remove-wishlist-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const productId = parseInt(event.target.dataset.id);
        WishlistManager.removeFromWishlist(productId);
        displayWishlistItems(); // Re-render the updated list
      });
    });
  }

  displayWishlistItems();
});
