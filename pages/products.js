import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { products } from '../data/products';

export default function ProductsPage() {
  const [productList] = useState(products || []);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState(new Set());
  const [toasts, setToasts] = useState([]);

  const router = useRouter();

  const goToProduct = (id) => {
    router.push(`/productdetail?id=${id}`);
  };

  const toggleFilter = (setState, selected, value) => {
    setState(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = [...productList];

    if (selectedCategories.length) {
      result = result.filter((p) =>
        Array.isArray(p.category)
          ? p.category.some((c) => selectedCategories.includes(c))
          : selectedCategories.includes(p.category)
      );
    }

    if (selectedSizes.length) {
      result = result.filter((p) =>
        Array.isArray(p.size)
          ? p.size.some((s) => selectedSizes.includes(s))
          : selectedSizes.includes(p.size)
      );
    }

    if (selectedColors.length) {
      result = result.filter((p) => {
        const cl = p.colors || (p.color ? [p.color] : []);
        return cl.some((c) => selectedColors.includes(c));
      });
    }

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [productList, selectedCategories, selectedSizes, selectedColors, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginated = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('Removed from wishlist');
      } else {
        next.add(id);
        showToast('Added to wishlist');
      }
      return next;
    });
  };

  const addToCart = (id) => {
    console.log(`Add to cart: ${id}`);
    showToast('Product added to cart');
  };

  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const allCategories = useMemo(() => {
    const set = new Set();
    productList.forEach((p) => {
      const categories = Array.isArray(p.category) ? p.category : [p.category];
      categories.forEach((c) => c && set.add(c));
    });
    return [...set];
  }, [productList]);

  const allSizes = useMemo(() => {
    const set = new Set();
    productList.forEach((p) => {
      const sizes = Array.isArray(p.size) ? p.size : [p.size];
      sizes.forEach((s) => s && set.add(s));
    });
    return [...set];
  }, [productList]);

  const allColors = useMemo(() => {
    const set = new Set();
    productList.forEach((p) => {
      const colors = p.colors || (p.color ? [p.color] : []);
      colors.forEach((c) => c && set.add(c));
    });
    return [...set];
  }, [productList]);

  const formatPrice = (p) => `£${p.toFixed(2)}`;

  return (
    <>
      <h1>All Products</h1>

      <div className="products-main-area">
        <aside className="filters-sidebar">
          <h2>Filters</h2>

          <div>
            <p>Categories:</p>
            {allCategories.map((cat) => (
              <label key={cat}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleFilter(setSelectedCategories, selectedCategories, cat)}
                />
                {cat}
              </label>
            ))}
          </div>

          <div>
            <p>Sizes:</p>
            {allSizes.map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={() => toggleFilter(setSelectedSizes, selectedSizes, size)}
                />
                {size}
              </label>
            ))}
          </div>

          <div>
            <p>Colors:</p>
            {allColors.map((color) => (
              <label key={color}>
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => toggleFilter(setSelectedColors, selectedColors, color)}
                />
                {color}
              </label>
            ))}
          </div>
        </aside>

        <main className="products-content">
          <div className="products-header">
            <label>
              Sort:
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Relevance</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
                <option value="name">Name</option>
              </select>
            </label>

            <label>
              Items per page:
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                {[12, 24, 48].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {paginated.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="products-grid">
              {paginated.map((p) => (
                <div
                  key={p.id}
                  className="product-card"
                  tabIndex="0"
                  onClick={() => goToProduct(p.id)}
                  onKeyDown={(e) => e.key === 'Enter' && goToProduct(p.id)}
                >
                  <div className="product-image">
                    <img
                      src={p.image || 'https://placehold.co/300x300?text=Product+Image'}
                      alt={p.name}
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300?text=No+Image';
                      }}
                    />
                  </div>
                  <h3>{p.name}</h3>
                  <p className="product-price">{formatPrice(p.price)}</p>
                  <div className="product-actions">
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p.id);
                      }}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="wishlist-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                    >
                      {wishlist.has(p.id) ? '♥' : '♡'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(i + 1)}
                  disabled={currentPage === i + 1}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Toasts */}
      <div className="toasts">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
}
