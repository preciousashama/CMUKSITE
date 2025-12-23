import Link from 'next/link';
import products from '@/lib/products.json';
import ProductCard from '@/components/ProductCard';
import "@/styles/index.css";

export default function HomePage() {
  return (
    <div className="home-wrapper">
      <section className="main-image-slider">
        <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000" alt="Hero" />
        <div className="slide-buttons">
          <Link href="/studio"><button className="primary-btn">START_DESIGNING</button></Link>
        </div>
      </section>

      <section className="container">
        <h2 className="brand-heading">LATEST_ARCHIVE</h2>
        <div className="best-sellers-images" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px' }}>
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>
    </div>
  );
}