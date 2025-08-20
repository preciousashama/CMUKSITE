import { useEffect, useState } from 'react';

export default function ProductsContainer() {
  const [products, setProducts] = useState([]);

  // Assume window.products and window.formatPrice exist, or you can pass them as props or import
  useEffect(() => {
    if (typeof window !== 'undefined' && window.products) {
      setProducts(window.products);
    }
  }, []);

  // Use your window.formatPrice or provide a fallback
  const formatPrice = (price) => {
    if (typeof window !== 'undefined' && window.formatPrice) {
      return window.formatPrice(price);
    }
    return `£${price.toFixed(2)}`; // fallback
  };

  return (
    <div id="products-container">
      {products.map((product) => (
        <div key={product.id} className="product">
          <img src={product.image} alt={product.name} width={150} />
          <h3>{product.name}</h3>
          <p>{formatPrice(product.price)}</p>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}
