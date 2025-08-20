// pages/party.js
import { useState, useEffect } from 'react';

import { products } from '../lib/products-manager';

export default function PartyPage() {
  // Filters state
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState('grid');
  
  // Filtered & paginated products
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // For counts in filters
  const categories = ['Party', 'Occasions'];
  const partyOccasionProducts = products.filter(p => {
    if (Array.isArray(p.category)) {
      return p.category.some(c => categories.includes(c));
    } else {
      return categories.includes(p.category);
    }
  });
  
  // Update filteredProducts whenever filters, sorting, pagination changes
  useEffect(() => {
    let filtered = partyOccasionProducts;

    // Apply type filters
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(p => {
        if (Array.isArray(p.category)) {
          return p.category.some(cat => selectedTypes.includes(cat));
        } else {
          return selectedTypes.includes(p.category);
        }
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered = filtered.slice().sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = filtered.slice().sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered = filtered.slice().sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'relevance':
      default:
        // no sorting or custom relevance logic
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page on filter/sort change
  }, [selectedTypes, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Paginated products for current page
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle checkbox change
  function onTypeFilterChange(e) {
    const { value, checked } = e.target;
    setSelectedTypes(prev => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter(v => v !== value);
      }
    });
  }

  // Format price helper
  function formatPrice(price) {
    return '£' + price.toFixed(2);
  }

  // Pagination controls
  function changePage(page) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  // Filter counts for each type
  function getCountForType(type) {
    return partyOccasionProducts.filter(p => {
      if (Array.isArray(p.category)) {
        return p.category.includes(type);
      } else {
        return p.category === type;
      }
    }).length;
  }

  return (
    <>
      <main className="products-page">
        <div className="container">
          <div className="products-header">
            <h1 className="products-title">Party & Occasions</h1>

            <div className="sort-by-container">
              <div className="sort-options">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              <div className="items-per-page">
                <label htmlFor="items-per-page-select">Items per page:</label>
                <select
                  id="items-per-page-select"
                  value={itemsPerPage}
                  onChange={e => setItemsPerPage(parseInt(e.target.value))}
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>

              <div className="view-options">
                <button
                  className={`view-btn grid-view ${view === 'grid' ? 'active' : ''}`}
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                >
                  <i className="fas fa-th"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="products-main-area">
            <aside className="filters-sidebar">
              <div className="filter-section">
                <h3 className="filter-heading">TYPE</h3>
                <ul className="filter-list">
                  {['Party', 'Occasions'].map(type => (
                    <li key={type}>
                      <input
                        type="checkbox"
                        id={`type-${type.toLowerCase()}`}
                        value={type}
                        checked={selectedTypes.includes(type)}
                        onChange={onTypeFilterChange}
                      />
                      <label htmlFor={`type-${type.toLowerCase()}`}>
                        {type} <span className="count">({getCountForType(type)})</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <div className={`products-content ${view === 'grid' ? 'grid-view' : 'list-view'}`}>
              <div className="products-grid" id="products-grid">
                {paginatedProducts.length === 0 ? (
                  <p className="no-products-message">No products found matching your criteria.</p>
                ) : (
                  paginatedProducts.map(product => (
                    <div className="product-card" key={product.id}>
                      <div className="product-image">
                        <img src={product.image || 'placeholder.jpg'} alt={product.name} />
                      </div>
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-price">{formatPrice(product.price)}</p>
                      <div className="product-actions">
                        <a href={`/product-detail?id=${product.id}`} className="view-product-btn">
                          VIEW PRODUCT
                        </a>
                        <div className="cart-wishlist-actions">
                          <button
                            className="add-to-cart-btn"
                            onClick={() => {
                              // Add to cart logic here
                              // Replace with your CartManager if available
                              alert(`Added ${product.name} to cart!`);
                            }}
                          >
                            ADD TO CART
                          </button>
                          <button
                            className="wishlist-btn"
                            onClick={() => {
                              // Wishlist toggle logic here
                              alert(`Toggled wishlist for ${product.name}`);
                            }}
                            aria-label="Toggle wishlist"
                          >
                            <i className="fas fa-heart"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="pagination">
            {totalPages > 1 && (
              <>
                <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
                  &laquo;
                </button>

                {/* Show max 5 pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    page =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                  )
                  .map(page => (
                    <button
                      key={page}
                      className={page === currentPage ? 'active' : ''}
                      onClick={() => changePage(page)}
                    >
                      {page}
                    </button>
                  ))}

                <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
                  &raquo;
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
