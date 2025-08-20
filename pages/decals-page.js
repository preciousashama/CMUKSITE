import { useState, useEffect } from 'react';

// Mock product data (replace with your real product data or fetch it)
const products = [
  // Example products
  {
    id: 1,
    name: 'Decal A',
    price: 5.99,
    category: ['Decals', 'Small', 'Black'],
    image: '/images/decal-a.jpg',
  },
  {
    id: 2,
    name: 'Vinyl B',
    price: 8.99,
    category: ['Vinyls', 'Medium', 'White'],
    image: '/images/vinyl-b.jpg',
  },
  // Add more products here...
];

export default function Decals() {
  // State variables
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    // Track checked filters by category type (size, colour, etc.)
    // For example, size: ['Small', 'Medium'], colour: ['Black']
    size: [],
    colour: [],
  });
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Categories to filter for products listing
  const mainCategories = ['Decals', 'Vinyls'];

  // All possible filter options (to render checkboxes)
  const sizeOptions = ['Small', 'Medium', 'Large'];
  const colourOptions = ['Black', 'White', 'Blue', 'Red'];

  // Filter products based on filters and category
  function applyFiltersAndSort() {
    let filtered = products.filter((product) => {
      // Keep only products that are Decals or Vinyls
      const hasMainCategory =
        Array.isArray(product.category)
          ? product.category.some((c) => mainCategories.includes(c))
          : mainCategories.includes(product.category);
      if (!hasMainCategory) return false;

      // Check size filter
      if (filters.size.length > 0) {
        const hasSize = Array.isArray(product.category)
          ? product.category.some((c) => filters.size.includes(c))
          : filters.size.includes(product.category);
        if (!hasSize) return false;
      }

      // Check colour filter
      if (filters.colour.length > 0) {
        const hasColour = Array.isArray(product.category)
          ? product.category.some((c) => filters.colour.includes(c))
          : filters.colour.includes(product.category);
        if (!hasColour) return false;
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      // relevance or default = no sorting
    }

    setFilteredProducts(filtered);
  }

  // Handle filter checkbox toggling
  function toggleFilter(categoryType, value) {
    setCurrentPage(1); // Reset to page 1
    setFilters((prev) => {
      const prevValues = prev[categoryType];
      if (prevValues.includes(value)) {
        // Remove
        return {
          ...prev,
          [categoryType]: prevValues.filter((v) => v !== value),
        };
      } else {
        // Add
        return {
          ...prev,
          [categoryType]: [...prevValues, value],
        };
      }
    });
  }

  // Handle sort change
  function handleSortChange(e) {
    setSortBy(e.target.value);
  }

  // Handle items per page change
  function handleItemsPerPageChange(e) {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Change page
  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  // Format price helper
  function formatPrice(price) {
    return '£' + price.toFixed(2);
  }

  // Effect: recalc filteredProducts when filters or sort change
  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, sortBy]);

  // Calculate counts for filter labels
  function countProductsByFilter(categoryType, value) {
    return products.filter((product) => {
      // Only Decals & Vinyls
      const isMain = Array.isArray(product.category)
        ? product.category.some((c) => mainCategories.includes(c))
        : mainCategories.includes(product.category);
      if (!isMain) return false;

      // Count by categoryType (size or colour)
      if (Array.isArray(product.category)) {
        return product.category.includes(value);
      }
      return product.category === value;
    }).length;
  }

  return (
    <>
      <main className="products-page">
        <div className="container">
          {/* Products Header */}
          <div className="products-header">
            <h1 className="products-title">Decals & Vinyls</h1>
            <div className="sort-by-container">
              <div className="sort-options">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={handleSortChange}
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
                  onChange={handleItemsPerPageChange}
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
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
              {/* Size Filter */}
              <div className="filter-section">
                <h3 className="filter-heading">SIZE</h3>
                <ul className="filter-list">
                  {sizeOptions.map((size) => (
                    <li key={size}>
                      <input
                        type="checkbox"
                        id={`size-${size.toLowerCase()}`}
                        value={size}
                        checked={filters.size.includes(size)}
                        onChange={() => toggleFilter('size', size)}
                      />
                      <label htmlFor={`size-${size.toLowerCase()}`}>
                        {size}{' '}
                        <span className="count">
                          ({countProductsByFilter('size', size)})
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Colour Filter */}
              <div className="filter-section">
                <h3 className="filter-heading">COLOUR</h3>
                <ul className="filter-list">
                  {colourOptions.map((colour) => (
                    <li key={colour}>
                      <input
                        type="checkbox"
                        id={`colour-${colour.toLowerCase()}`}
                        value={colour}
                        checked={filters.colour.includes(colour)}
                        onChange={() => toggleFilter('colour', colour)}
                      />
                      <label htmlFor={`colour-${colour.toLowerCase()}`}>
                        {colour}{' '}
                        <span className="count">
                          ({countProductsByFilter('colour', colour)})
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Products Content */}
            <div className="products-content">
              <div className="products-grid" id="products-grid">
                {paginatedProducts.length === 0 ? (
                  <p className="no-products-message">
                    No products found matching your criteria.
                  </p>
                ) : (
                  paginatedProducts.map((product) => (
                    <div className="product-card" key={product.id}>
                      <div className="product-image">
                        <img
                          src={product.image || 'placeholder.jpg'}
                          alt={product.name}
                        />
                      </div>
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-price">{formatPrice(product.price)}</p>
                      <div className="product-actions">
                        <a
                          href={`/product-detail?id=${product.id}`}
                          className="view-product-btn"
                        >
                          VIEW PRODUCT
                        </a>
                        <div className="cart-wishlist-actions">
                          <button
                            className="add-to-cart-btn"
                            onClick={() =>
                              alert(`Add to cart functionality for product ${product.id}`)
                            }
                          >
                            ADD TO CART
                          </button>
                          <button
                            className="wishlist-btn"
                            onClick={() =>
                              alert(`Wishlist toggle for product ${product.id}`)
                            }
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
            {/* Previous */}
            {currentPage > 1 && (
              <a href="#" onClick={(e) => { e.preventDefault(); goToPage(currentPage - 1); }} className="page-item">
                «
              </a>
            )}

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <a
                key={pageNum}
                href="#"
                className={`page-item ${pageNum === currentPage ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(pageNum);
                }}
              >
                {pageNum}
              </a>
            ))}

            {/* Next */}
            {currentPage < totalPages && (
              <a href="#" onClick={(e) => { e.preventDefault(); goToPage(currentPage + 1); }} className="page-item">
                »
              </a>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
