import { useState, useEffect, useMemo } from 'react';
// Replace with your actual products data import
import { products } from '../lib/products-manager';


// Stub WishlistManager and CartManager hooks for demo
function useWishlist() {
  const [wishlist, setWishlist] = useState(() => new Set());

  const isInWishlist = id => wishlist.has(id);
  const addToWishlist = id => setWishlist(new Set(wishlist).add(id));
  const removeFromWishlist = id => {
    const newSet = new Set(wishlist);
    newSet.delete(id);
    setWishlist(newSet);
  };

  return { wishlist, isInWishlist, addToWishlist, removeFromWishlist };
}

function useCart() {
  const addToCart = (id, qty) => {
    alert(`Added product ${id} qty ${qty} to cart (stub)`);
  };
  return { addToCart };
}

export default function BagsPage() {
  // Filters state
  const [selectedColors, setSelectedColors] = useState([]);
  // Sorting
  const [sortBy, setSortBy] = useState('relevance');
  // Items per page
  const [itemsPerPage, setItemsPerPage] = useState(12);
  // Pagination current page
  const [currentPage, setCurrentPage] = useState(1);

  // Wishlist and Cart hooks
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Filter color checkbox change handler
  const onColorChange = (color, checked) => {
    setCurrentPage(1); // reset to first page on filter change
    setSelectedColors(prev => {
      if (checked) return [...prev, color];
      return prev.filter(c => c !== color);
    });
  };

  // Filter products for Bags category only
  const bagProducts = useMemo(() => {
    return products.filter(product =>
      product.category === "Bags" ||
      (Array.isArray(product.category) && product.category.includes("Bags"))
    );
  }, []);

  // Filtered products based on selected colors
  const filteredProducts = useMemo(() => {
    let filtered = bagProducts;
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.color && !product.colors) return false;

        if (product.colors && Array.isArray(product.colors)) {
          return product.colors.some(c => selectedColors.includes(c));
        }
        if (product.color) {
          return selectedColors.includes(product.color);
        }
        return false;
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      // relevance or unknown: no sort
    }

    return filtered;
  }, [bagProducts, selectedColors, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Update filter counts for sidebar
  const filterCounts = useMemo(() => {
    const counts = {};
    ['Black', 'White', 'Blue', 'Red'].forEach(color => {
      counts[color] = bagProducts.filter(p => {
        if (p.colors && Array.isArray(p.colors)) return p.colors.includes(color);
        if (p.color) return p.color === color;
        return false;
      }).length;
    });
    return counts;
  }, [bagProducts]);

  // Handle wishlist toggle
  const toggleWishlist = (id) => {
    if (isInWishlist(id)) removeFromWishlist(id);
    else addToWishlist(id);
  };

  // Format price helper
  const formatPrice = (price) => {
    if (typeof price !== 'number') price = parseFloat(price) || 0;
    return '£' + price.toFixed(2);
  };

  // Toast system: simple alert stub for now (replace with your toast component)
  const showToast = (msg) => alert(msg);

  // Pagination controls handler
  const onPageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Color filter checkbox JSX
  const colorOptions = ['Black', 'White', 'Blue', 'Red'];

  return (
    <>
      <main className="products-page">
        <div className="container">
          <div className="products-header">
            <h1 className="products-title">Bags</h1>

            <div className="sort-by-container">
              <div className="sort-options">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
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
                  onChange={e => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                </select>
              </div>

              {/* Only grid view button included for now */}
              <div className="view-options">
                <button className="view-btn grid-view active" aria-pressed="true" disabled>
                  <i className="fas fa-th"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="products-main-area" style={{ display: 'flex' }}>
            {/* Filters Sidebar */}
            <aside className="filters-sidebar" style={{ minWidth: '200px', marginRight: '20px' }}>
              <div className="filter-section">
                <h3 className="filter-heading">COLOUR</h3>
                <ul className="filter-list" style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {colorOptions.map(color => (
                    <li key={color}>
                      <input
                        type="checkbox"
                        id={`colour-${color.toLowerCase()}`}
                        value={color}
                        checked={selectedColors.includes(color)}
                        onChange={e => onColorChange(color, e.target.checked)}
                      />
                      <label htmlFor={`colour-${color.toLowerCase()}`}>
                        {color} <span className="count">({filterCounts[color] || 0})</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Products Content */}
            <div className="products-content" style={{ flex: 1 }}>
              <div className="products-grid" id="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '16px' }}>
                {paginatedProducts.length === 0 ? (
                  <p className="no-products-message">No products found matching your criteria.</p>
                ) : (
                  paginatedProducts.map(product => (
                    <div className="product-card" key={product.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
                      <div className="product-image">
                        <img
                          src={product.image || '/placeholder.jpg'}
                          alt={product.name}
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      </div>
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-price">{formatPrice(product.price)}</p>

                      {/* Colors display */}
                      {(product.colors && product.colors.length > 0) ? (
                        <div className="product-colors">
                          <span>Colors: </span>
                          {product.colors.map(color => (
                            <span
                              key={color}
                              className="color-swatch"
                              style={{
                                backgroundColor: color.toLowerCase(),
                                display: 'inline-block',
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                marginRight: '4px',
                                border: '1px solid #ccc'
                              }}
                              title={color}
                            />
                          ))}
                        </div>
                      ) : product.color ? (
                        <div className="product-colors">
                          <span>Color: </span>
                          <span
                            className="color-swatch"
                            style={{
                              backgroundColor: product.color.toLowerCase(),
                              display: 'inline-block',
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              border: '1px solid #ccc'
                            }}
                            title={product.color}
                          />
                        </div>
                      ) : null}

                      <div className="product-actions" style={{ marginTop: '10px' }}>
                        <a href={`/product-detail?id=${product.id}`} className="view-product-btn" style={{ marginRight: '8px' }}>
                          VIEW PRODUCT
                        </a>
                        <div className="cart-wishlist-actions" style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            className="add-to-cart-btn"
                            onClick={() => {
                              addToCart(product.id, 1);
                              showToast('Product added to cart!');
                            }}
                          >
                            ADD TO CART
                          </button>
                          <button
                            className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                            onClick={() => {
                              toggleWishlist(product.id);
                              showToast(isInWishlist(product.id) ? 'Removed from wishlist' : 'Added to wishlist');
                            }}
                            aria-pressed={isInWishlist(product.id)}
                          >
                            <i className="fas fa-heart"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="pagination" aria-label="Page navigation" style={{ marginTop: '20px', textAlign: 'center' }}>
                  {/* Previous */}
                  <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous Page"
                  >
                    «
                  </button>

                  {/* Page numbers (show max 5) */}
                  {(() => {
                    const maxVisiblePages = 5;
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    const pages = [];
                    if (startPage > 1) {
                      pages.push(
                        <button key={1} onClick={() => onPageChange(1)}>1</button>
                      );
                      if (startPage > 2) {
                        pages.push(<span key="start-ellipsis">...</span>);
                      }
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => onPageChange(i)}
                          aria-current={currentPage === i ? 'page' : undefined}
                          style={{
                            fontWeight: currentPage === i ? 'bold' : 'normal',
                            textDecoration: currentPage === i ? 'underline' : 'none',
                          }}
                        >
                          {i}
                        </button>
                      );
                    }

                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(<span key="end-ellipsis">...</span>);
                      }
                      pages.push(
                        <button key={totalPages} onClick={() => onPageChange(totalPages)}>{totalPages}</button>
                      );
                    }

                    return pages;
                  })()}

                  {/* Next */}
                  <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next Page"
                  >
                    »
                  </button>
                </nav>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
