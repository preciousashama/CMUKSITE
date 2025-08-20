import { useState, useEffect } from 'react';

export default function LabelsPage() {
  // State variables
  const [products, setProducts] = useState([]); // Your full product list; replace with your data source
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Categories of interest
  const categoriesOfInterest = ['Labels', 'Stickers'];

  // For demo, use an example products array or get it from a global or props.
  useEffect(() => {
    // Replace this with your real data fetch or import
    const loadProducts = async () => {
      // Example: fetch('/api/products') or import
      // For demo: dummy data:
      const demoProducts = [
        // Fill with your product objects with id, name, price, category, image, etc.
        // Example:
        { id: 1, name: 'Label A', price: 1.5, category: 'Labels', image: '/images/label-a.jpg' },
        { id: 2, name: 'Sticker B', price: 2.0, category: 'Stickers', image: '/images/sticker-b.jpg' },
        // Add more products...
      ];
      setProducts(demoProducts);
    };
    loadProducts();
  }, []);

  // Update filtered products whenever filters or sorting or pagination change
  useEffect(() => {
    let filtered = products.filter(product => {
      // Only Labels and Stickers
      if (Array.isArray(product.category)) {
        return product.category.some(cat => categoriesOfInterest.includes(cat));
      } else {
        return categoriesOfInterest.includes(product.category);
      }
    });

    // Filter by selected types if any
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(product => {
        if (Array.isArray(product.category)) {
          return product.category.some(cat => selectedTypes.includes(cat));
        } else {
          return selectedTypes.includes(product.category);
        }
      });
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      // 'relevance' or default: no sorting
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset page when filters or sorting change
  }, [products, selectedTypes, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const toggleTypeFilter = (type) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleSortChange = (e) => setSortBy(e.target.value);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  // Format price helper
  const formatPrice = (price) => `£${price.toFixed(2)}`;

  // Dummy WishlistManager & CartManager placeholders
  const WishlistManager = {
    isInWishlist: (id) => false,
    addToWishlist: (id) => {},
    removeFromWishlist: (id) => {},
  };

  const CartManager = {
    addToCart: (id, qty) => {},
  };

  // Show toast helper (basic)
  const showToast = (msg, type = 'default') => {
    alert(msg); // Replace with better UI in your app
  };

  return (
    <>
      <head>
        <title>CMUK - Labels & Stickers</title>
        <link rel="stylesheet" href="/css/global.css" />
        <link rel="stylesheet" href="/css/components.css" />
        <link rel="stylesheet" href="/css/header.css" />
        <link rel="stylesheet" href="/css/footer.css" />
        <link rel="stylesheet" href="/css/labels-stickers.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
      </head>

      <div id="header-placeholder">{/* Your header component here */}</div>

      <main className="products-page">
        <div className="container">
          {/* Products Header */}
          <div className="products-header">
            <h1 className="products-title">Labels & Stickers</h1>

            <div className="sort-by-container">
              <div className="sort-options">
                <label htmlFor="sort-select">Sort by:</label>
                <select id="sort-select" value={sortBy} onChange={handleSortChange}>
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
                  onChange={handleItemsPerPageChange}
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                </select>
              </div>

              <div className="view-options">
                <button className="view-btn grid-view active">
                  <i className="fas fa-th"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="products-main-area">
            {/* Filters Sidebar */}
            <aside className="filters-sidebar">
              <div className="filter-section">
                <h3 className="filter-heading">TYPE</h3>
                <ul className="filter-list">
                  {['Labels', 'Stickers'].map((type) => {
                    // Calculate count for each type
                    const count = products.filter(p => {
                      if (Array.isArray(p.category)) {
                        return p.category.includes(type);
                      }
                      return p.category === type;
                    }).length;

                    return (
                      <li key={type}>
                        <input
                          type="checkbox"
                          id={`type-${type.toLowerCase()}`}
                          value={type}
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleTypeFilter(type)}
                        />
                        <label htmlFor={`type-${type.toLowerCase()}`}>
                          {type} <span className="count">({count})</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* Products Content */}
            <div className="products-content">
              <div className="products-grid" id="products-grid">
                {paginatedProducts.length === 0 && (
                  <p className="no-products-message">
                    No products found matching your criteria.
                  </p>
                )}

                {paginatedProducts.map(product => {
                  const isInWishlist = WishlistManager.isInWishlist(product.id);
                  return (
                    <div key={product.id} className="product-card">
                      <div className="product-image">
                        <img
                          src={product.image || 'placeholder.jpg'}
                          alt={product.name}
                        />
                      </div>
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-price">{formatPrice(product.price)}</p>
                      <div className="product-actions">
                        <a href={`product-detail.html?id=${product.id}`} className="view-product-btn">
                          VIEW PRODUCT
                        </a>
                        <div className="cart-wishlist-actions">
                          <button
                            className="add-to-cart-btn"
                            onClick={() => {
                              CartManager.addToCart(product.id, 1);
                              showToast('Product added to cart!', 'success');
                            }}
                          >
                            ADD TO CART
                          </button>
                          <button
                            className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                            onClick={() => {
                              if (isInWishlist) {
                                WishlistManager.removeFromWishlist(product.id);
                                showToast('Removed from wishlist', 'info');
                              } else {
                                WishlistManager.addToWishlist(product.id);
                                showToast('Added to wishlist', 'success');
                              }
                              // Force re-render? Depends on your wishlist implementation
                            }}
                          >
                            <i className="fas fa-heart"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="pagination">
            {totalPages > 1 && (
              <>
                {currentPage > 1 && (
                  <a
                    href="#"
                    className="page-item"
                    onClick={e => {
                      e.preventDefault();
                      goToPage(currentPage - 1);
                    }}
                  >
                    «
                  </a>
                )}

                {/* Pages with ellipsis logic */}
                {(() => {
                  const pages = [];
                  const maxVisiblePages = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }

                  if (startPage > 1) {
                    pages.push(
                      <a
                        key="first"
                        href="#"
                        className="page-item"
                        onClick={e => {
                          e.preventDefault();
                          goToPage(1);
                        }}
                      >
                        1
                      </a>
                    );
                    if (startPage > 2) {
                      pages.push(
                        <span key="start-ellipsis" className="page-separator">
                          ...
                        </span>
                      );
                    }
                  }

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <a
                        key={i}
                        href="#"
                        className={`page-item ${i === currentPage ? 'active' : ''}`}
                        onClick={e => {
                          e.preventDefault();
                          goToPage(i);
                        }}
                      >
                        {i}
                      </a>
                    );
                  }

                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span key="end-ellipsis" className="page-separator">
                          ...
                        </span>
                      );
                    }
                    pages.push(
                      <a
                        key="last"
                        href="#"
                        className="page-item"
                        onClick={e => {
                          e.preventDefault();
                          goToPage(totalPages);
                        }}
                      >
                        {totalPages}
                      </a>
                    );
                  }

                  return pages;
                })()}

                {currentPage < totalPages && (
                  <a
                    href="#"
                    className="page-item"
                    onClick={e => {
                      e.preventDefault();
                      goToPage(currentPage + 1);
                    }}
                  >
                    »
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <div id="footer-placeholder">{/* Your footer component here */}</div>
    </>
  );
}
