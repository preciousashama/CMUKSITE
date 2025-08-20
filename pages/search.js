import { useRouter } from 'next/router';
import { products } from '../lib/products-manager';
import Link from 'next/link';

export default function SearchPage() {
  const { q } = useRouter().query;
  const term = (q || '').toString().toLowerCase();
  const results = term
    ? products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.category && p.category.toString().toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (p.size && p.size.toLowerCase().includes(term)) ||
        (p.colors && p.colors.join('').toLowerCase().includes(term))
      )
    : [];

  return (
    <div>
      <h1>Search Results {q ? `for "${q}"` : ''}</h1>
      <p>{results.length} product{results.length !== 1 ? 's' : ''} found.</p>
      {results.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul>
          {results.map(p => (
            <li key={p.id}>
              <Link href={`/product/${p.id}`}>
                <img
                  src={p.image || '/placeholder.png'}
                  alt={p.name}
                  width={80}
                />
                <div>{p.name} – £{p.price.toFixed(2)}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
