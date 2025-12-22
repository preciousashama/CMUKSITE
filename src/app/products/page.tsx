import ProductListClient from '@/components/products/ProductListClient';
import { products } from '@/data/products'; // Soon this will be a database call

export default function ProductsPage() {
  return (
    <div className="bg-white min-h-screen">
      <ProductListClient initialProducts={products} />
    </div>
  );
}