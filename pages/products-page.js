// pages/products.js
import { useEffect, useState, useMemo } from 'react';
import { products } from '../lib/products-manager';

export default function ProductsPage() {
  const [products] = useState(productsData || []);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState(new Set());
  const [toasts, setToasts] = useState([]);

  const toggleFilter = (setState, selected, value) => {
    if (selected.includes(value)) {
      setState(selected.filter(v => v !== value));
    } else {
      setState([...selected, value]);
    }
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

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
  }, [products, selectedCategories, selectedSizes, selectedColors, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginated = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleWishlist = id => {
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

  const addToCart = id => {
    console.log(`Add to cart: ${id}`);
    showToast('Product added to cart');
  };

  const showToast = (message = '', type = '') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const allCategories = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (Array.isArray(p.category)) p.category.forEach(c => set.add(c));
      else if (p.category) set.add(p.category);
    });
    return [...set];
  }, [products]);

  const allSizes = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (Array.isArray(p.size)) p.size.forEach(s => set.add(s));
      else if (p.size) set.add(p.size);
    });
    return [...set];
  }, [products]);

  const allColors = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (Array.isArray(p.colors)) p.colors.forEach(c => set.add(c));
      else if (p.color) set.add(p.color);
    });
    return [...set];
  }, [products]);

  const formatPrice = p => `£${p.toFixed(2)}`;

  return (
    <>
      <h1>All Products</h1>

      <div>
        <h2>Filters</h2>

        <div>
          <p>Categories:</p>
          {allCategories.map(cat => (
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
          {allSizes.map(size => (
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
          {allColors.map(color => (
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

        <div>
          <label>
            Sort:
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="">Relevance</option>
              <option value="price-low">Price Low to High</option>
              <option value="price-high">Price High to Low</option>
              <option value="name">Name</option>
            </select>
          </label>

          <label>
            Items per page:
            <select value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))}>
              {[12, 24, 48].map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div>
        {paginated.length === 0 ? (
          <p>No products found.</p>
        ) : (
          paginated.map(p => (
            <div key={p.id}>
              <img
                src={p.image || 'https://placehold.co/300x300?text=Product+Image'}
                alt={p.name}
                onError={e => {
                  e.target.src = 'https://placehold.co/300x300?text=No+Image';
                }}
              />
              <h3>{p.name}</h3>
              <p>{formatPrice(p.price)}</p>
              <button onClick={() => addToCart(p.id)}>Add to Cart</button>
              <button onClick={() => toggleWishlist(p.id)}>
                {wishlist.has(p.id) ? '♥ In Wishlist' : '♡ Wishlist'}
              </button>
            </div>
          ))
        )}
      </div>

      <div>
        {totalPages > 1 &&
          Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              disabled={currentPage === i + 1}
            >
              {i + 1}
            </button>
          ))}
      </div>

      <div>
        {toasts.map(toast => (
          <div key={toast.id}>{toast.message}</div>
        ))}
      </div>
    </>
  );
}
