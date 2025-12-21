/**
 * src/lib/utils.js 
 */

// Optimization: Memoize the formatter to prevent re-instantiation in loops
const formatters = new Map();

export const formatCurrency = (amount, currency = 'GBP', locale = 'en-GB') => {
  const key = `${locale}-${currency}`;
  if (!formatters.has(key)) {
    formatters.set(key, new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }));
  }
  return formatters.get(key).format(amount);
};

/**
 * src/types/product.ts (Conceptual - Using JSDoc for JS context)
 * Senior Note: In Next.js 13, we define the schema via Prisma.
 */

/*
// prisma/schema.prisma
model Product {
  id             String    @id @default(cuid())
  sku            String    @unique
  name           String
  slug           String    @unique
  basePrice      Decimal
  description    String
  customizable   Boolean   @default(true)
  printAreas     String[]  // ['front', 'back']
  categoryParent String
  categorySub    String
  variants       Variant[]
  createdAt      DateTime  @default(now())
}
*/

/**
 * src/lib/products.js (The "Service Layer")
 */

// In a real Next.js 13 app, use the Prisma client here
// import { prisma } from './prisma';

export const getProductBySlug = async (slug) => {
  // Simulating a DB call which is better for SEO/Dynamic routes
  // return await prisma.product.findUnique({ where: { slug }, include: { variants: true } });
  
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;
  
  return {
    ...product,
    // Ensure data integrity for components
    basePrice: Number(product.basePrice),
    hasReviews: product.reviewCount > 0
  };
};

export const products = [
  {
    id: "prod_01",
    sku: "ADL-TSH-REG-001",
    name: "Adult Essentials T-Shirt",
    slug: "adult-essentials-t-shirt",
    basePrice: 9.99,
    description: "Our signature Adult Essentials T-shirt offers a retail fit and unisex sizing. Perfect for front or back custom prints.",
    features: [
      "100% Airlume combed and ring-spun cotton",
      "Unisex sizing",
      "Coverstitching on collar and sleeves"
    ],
    // Primary assets
    images: {
      thumbnail: "/assets/clothing/t-shirt-reg-thumb.webp",
      main: "/assets/clothing/t-shirt-reg-main.webp",
      gallery: [
        "/assets/clothing/t-shirt-reg-front.webp",
        "/assets/clothing/t-shirt-reg-back.webp"
      ]
    },
    category: {
      parent: "Apparel",
      sub: "T-Shirts"
    },
    // More robust Variant System supporting individual SKU/Stock
    variants: [
      {
        id: "v_01_s_black",
        color: { name: "Deep Black", hex: "#000000" },
        size: "S",
        stock: 50,
        additionalCost: 0 // Base price + 0
      },
      {
        id: "v_01_xxl_black",
        color: { name: "Deep Black", hex: "#000000" },
        size: "XXL",
        stock: 12,
        additionalCost: 2.50 // Price adjustment for larger sizes
      }
    ],
    customization: {
      isEnabled: true,
      areas: [
        { id: "front", label: "Front Chest", maxDimensions: "30x30cm" },
        { id: "back", label: "Upper Back", maxDimensions: "35x40cm" }
      ],
      threeJsModelId: "tshirt_base_v1" // ID for react-three-fiber to load
    },
    meta: {
      title: "Custom Adult Essentials T-Shirt | Quality Print | CMUK",
      description: "Customise your essentials t-shirt in our 3D studio. High quality 100% cotton.",
      rating: 4.8,
      reviewCount: 124
    }
  }
];