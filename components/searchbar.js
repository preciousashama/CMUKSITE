import { useState, useEffect, useRef } from 'react';
import products from '../data/products';  // import your products list
import { useRouter } from 'next/router';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const resultsRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const term = query.toLowerCase();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      (p.category && p.category.toString().toLowerCase().includes(term)) ||
      (p.description && p.description.toLowerCase().includes(term)) ||
      (p.size && p.size.toLowerCase().includes(term)) ||
      (p.colors && p.colors.some(c => c.toLowerCase().includes(term)))
    );
    setResults(filtered.slice(0, 8));
    setActiveIndex(-1);
  }, [query]);

  const select = (prod) => {
    router.push(`/product/${prod.id}`);
  };

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      select(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setResults([]);
    }
  };

  return (
    <div>
      <form onSubmit={e => { e.preventDefault(); if (results[0]) select(results[0]); }}>
        <input
          id="search-input"
          type="text"
          value={query}
          placeholder="Search..."
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          autoComplete="off"
        />
      </form>

      {results.length > 0 && (
        <div id="search-results" ref={resultsRef}>
          {results.map((prod, idx) => (
            <div
              key={prod.id}
              style={{ background: idx === activeIndex ? '#eef' : undefined }}
              onClick={() => select(prod)}
            >
              <img
                src={prod.image || '/placeholder.png'}
                alt={prod.name}
                width={40}
                onError={(e) => (e.target.src = '/placeholder.png')}
              />
              <span>{prod.name}</span>
              <span>£{prod.price.toFixed(2)}</span>
            </div>
          ))}
          {results.length >= 8 && (
            <div onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}>
              See all {results.length} results
            </div>
          )}
        </div>
      )}
    </div>
  );
}
