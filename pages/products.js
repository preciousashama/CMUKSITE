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
    if (selected.includes(value)) {
      setState(selected.filter(v => v !== value));
    } else {
      setState([...selected, value]);
    }
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = [...productList];

    if (selectedCategories.length) {
      result = result.filter(p => {
        const cat = p.category;
        return Array.isArray(cat)
          ? cat.some(c => selectedCategories.includes(c))
          : selectedCategories.includes(cat);
      });
    }

    if (selectedSizes.length) {
      result = result.filter(p => {
        const sz = p.size;
        return Array.isArray(sz)
          ? sz.some(s => selectedSizes.includes(s))
          : selectedSizes.includes(sz);
      });
    }

    if (selectedColors.length) {
      result = result.filter(p => {
        const cl = p.colors || (p.color ? [p.color] : []);
        return cl.some(c => selectedColors.includes(c));
      });
    }

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [productList, selectedCategories, selectedSizes, selectedColors, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginated = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleWishlist = (id) => {
    setWishlist(prev => {
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
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const allCategories = useMemo(() => {
    const set = new Set();
    productList.forEach(p => {
      if (Array.isArray(p.category)) p.category.forEach(c => set.add(c));
      else if (p.category) set.add(p.category);
    });
    return [...set];
  }, [productList]);

  const allSizes = useMemo(() => {
    const set = new Set();
    productList.forEach(p => {
      if (Array.isArray(p.size)) p.size.forEach(s => set.add(s));
      else if (p.size) set.add(p.size);
    });
    return [...set];
  }, [productList]);

  const allColors = useMemo(() => {
    const set = new Set();
    productList.forEach(p => {
      const colorsArr = p.colors || (p.color ? [p.color] : []);
      colorsArr.forEach(c => set.add(c));
    });
    return [...set];
  }, [productList]);

  const formatPrice = (p) => `£${p.toFixed(2)}`;

  return (
    <>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '700' }}>All Products</h1>

      <div className="products-main-area" style={{ display: 'flex', gap: '1rem' }}>
        {/* Sidebar Filters */}
        <aside className="filters-sidebar" style={{ flex: '0 0 250px' }}>
          <h2>Filters</h2>

          <div>
            <p>Categories:</p>
            {allCategories.map(cat => (
              <label key={cat} style={{ display: 'block' }}>
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
            {allSizes.map(size => (
              <label key={size} style={{ display: 'block' }}>
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
            {allColors.map(color => (
              <label key={color} style={{ display: 'block' }}>
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

        {/* Main Product Listing */}
        <main className="products-content" style={{ flex: 1 }}>
          {/* Sort & Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem' }}>
            <label>
              Sort:&nbsp;
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Relevance</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
                <option value="name">Name</option>
              </select>
            </label>

            <label>
              Items per page:&nbsp;
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                {[12, 24, 48].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Product Grid */}
          {paginated.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {paginated.map(p => (
                <article
                  key={p.id}
                  className="product-card"
                  tabIndex="0"
                  onClick={() => goToProduct(p.id)}
                  onKeyDown={(e) => e.key === 'Enter' && goToProduct(p.id)}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '1rem',
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <div className="product-image" style={{ marginBottom: '1rem' }}>
                    <img
                      src={p.image || 'https://placehold.co/300x300?text=Product+Image'}
                      alt={p.name}
                      onError={e => {
                        e.target.src = 'https://placehold.co/300x300?text=No+Image';
                      }}
                      style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                  </div>
                  <h3>{p.name}</h3>
                  <p style={{ fontWeight: 'bold' }}>{formatPrice(p.price)}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p.id);
                      }}
                      style={{ flex: 1, backgroundColor: 'black', color: 'white', padding: '0.5rem', borderRadius: '4px' }}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                      aria-label={wishlist.has(p.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      style={{ width: '40px', border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                      {wishlist.has(p.id) ? '♥' : '♡'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav style={{ marginTop: '1rem', textAlign: 'center' }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  disabled={currentPage === i + 1}
                  style={{
                    margin: '0 4px',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    backgroundColor: currentPage === i + 1 ? '#000' : '#eee',
                    color: currentPage === i + 1 ? '#fff' : '#000',
                    border: 'none',
                    cursor: currentPage === i + 1 ? 'default' : 'pointer',
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          )}
        </main>
      </div>

      {/* Toast Notifications */}
      <div className="toasts" style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999 }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              backgroundColor: '#333',
              color: '#fff',
              padding: '0.75rem 1rem',
              borderRadius: '4px',
              marginBottom: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
}
