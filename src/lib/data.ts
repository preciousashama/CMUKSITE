import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 'cmuk-001',
    name: 'Essential Oversized Tee',
    slug: 'essential-oversized-tee',
    price: 45.00,
    oldPrice: 60.00,
    currency: 'GBP',
    image: '/assets/products/tee-black-front.png',
    gallery: [
      '/assets/products/tee-black-back.png',
      '/assets/products/tee-black-detail.png'
    ],
    category: 'T-Shirts',
    tags: [
      { label: 'Limited Drop', type: 'edition' },
      { label: '400GSM Cotton', type: 'fabric' }
    ],
    description: 'A heavyweight, boxy silhouette designed for the CMUK Archive.',
    features: [
      '100% Organic Cotton',
      'Dropped shoulders',
      'High-density screen print'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pitch Black', hex: '#000000' },
      { name: 'Bone White', hex: '#F5F5F0' }
    ],
    stockStatus: 'low-stock',
    isCustomizable: true,
    threeDModelPath: '/models/tshirt.glb'
  }
];