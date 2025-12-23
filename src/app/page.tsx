import React from 'react';
import Link from 'next/link';
import products from '@/lib/products.json';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  // 1. DATA VALIDATION
  const hasProducts = products && products.length > 0;

  return (
    <div style={styles.pageWrapper}>
      {/* SYSTEM STATUS HEADER - Confirms you are on the NEW site */}
      <div style={styles.statusHeader}>
        SYSTEM_STATUS: ONLINE // ARCHIVE_ACCESS_GRANTED // PORT_3000
      </div>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.mainTitle}>
            CMUK<br />
            <span style={{ color: '#888' }}>ARCHIVE</span><br />
            SYSTEM_V4
          </h1>
          <p style={styles.heroSubtext}>
            CORE_DEVELOPMENT_AND_DIGITAL_MANUFACTURING_PROTOCOL. 
            ESTABLISHED_2025. GLOBAL_DISTRIBUTION_ACTIVE.
          </p>
          <div style={styles.heroActions}>
            <Link href="/studio">
              <button style={styles.primaryBtn}>ENTER_3D_STUDIO_V1</button>
            </Link>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID SECTION */}
      <section style={styles.gridSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>LATEST_ARCHIVE_ENTRIES</h2>
          <span style={styles.entryCount}>TOTAL_ITEMS: {products.length}</span>
        </div>

        {hasProducts ? (
          <div style={styles.productGrid}>
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div style={styles.errorState}>
            CRITICAL_ERROR: NO_DATA_FOUND_IN_PRODUCTS.JSON
          </div>
        )}
      </section>

      {/* TECHNICAL MANIFESTO FOOTER BLOCK */}
      <section style={styles.manifestoBlock}>
        <div style={styles.manifestoContent}>
          <h3 style={styles.manifestoTitle}>MANUFACTURE_PROTOCOL</h3>
          <p style={styles.manifestoText}>
            ALL GARMENTS ARE DIGITALLY RENDERED IN OUR 3D STUDIO PRIOR TO PHYSICAL ARCHIVING. 
            WE UTILIZE HIGH-GSM FABRICS AND REACTIVE TEXTURES.
          </p>
          <Link href="/manifesto" style={styles.manifestoLink}>READ_FULL_MANIFESTO_</Link>
        </div>
      </section>
    </div>
  );
}

// BRUTALIST INLINE STYLING
const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: {
    backgroundColor: '#fff',
    color: '#000',
    minHeight: '100vh',
    paddingTop: '60px', // Space for fixed header
    fontFamily: 'var(--font-inter), sans-serif',
  },
  statusHeader: {
    background: '#00ff00',
    color: '#000',
    fontSize: '9px',
    fontWeight: 900,
    textAlign: 'center',
    padding: '8px 0',
    letterSpacing: '2px',
    borderBottom: '1px solid #000',
  },
  hero: {
    padding: '100px 40px',
    borderBottom: '2px solid #000',
    display: 'flex',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 'clamp(3rem, 12vw, 10rem)',
    fontWeight: 950,
    lineHeight: 0.85,
    letterSpacing: '-0.06em',
    margin: 0,
  },
  heroSubtext: {
    maxWidth: '500px',
    fontSize: '11px',
    fontWeight: 700,
    lineHeight: 1.6,
    textTransform: 'uppercase',
    marginTop: '30px',
    letterSpacing: '1px',
  },
  primaryBtn: {
    marginTop: '40px',
    padding: '20px 40px',
    background: '#000',
    color: '#fff',
    border: 'none',
    fontSize: '14px',
    fontWeight: 900,
    cursor: 'pointer',
    letterSpacing: '2px',
    transition: 'transform 0.2s ease',
  },
  gridSection: {
    padding: '80px 40px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '40px',
    borderBottom: '1px solid #eee',
    paddingBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 900,
    margin: 0,
    letterSpacing: '2px',
  },
  entryCount: {
    fontSize: '10px',
    fontWeight: 900,
    color: '#888',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '40px',
  },
  errorState: {
    padding: '100px',
    textAlign: 'center',
    border: '2px dashed red',
    color: 'red',
    fontWeight: 900,
  },
  manifestoBlock: {
    padding: '120px 40px',
    background: '#000',
    color: '#fff',
  },
  manifestoTitle: {
    fontSize: '40px',
    fontWeight: 950,
    marginBottom: '20px',
    letterSpacing: '-1px',
  },
  manifestoText: {
    maxWidth: '600px',
    fontSize: '14px',
    lineHeight: 1.6,
    opacity: 0.7,
    marginBottom: '30px',
  },
  manifestoLink: {
    color: '#00ff00',
    fontSize: '12px',
    fontWeight: 900,
    textDecoration: 'none',
  }
};