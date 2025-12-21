/**
 * src/lib/utils.js 
 * (Extracted for reusability)
 */
export const formatCurrency = (amount, currency = 'GBP') => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * src/data/products.js
 */
export const products = [
  {
    id: "prod_01",
    sku: "ADL-TSH-REG-001",
    name: "Adult Essentials T-Shirt",
    slug: "adult-essentials-t-shirt", // For SEO-friendly URLs: /products/adult-essentials-t-shirt
    basePrice: 9.99,
    description: "Our signature Adult Essentials T-shirt offers a retail fit and unisex sizing. Perfect for front or back custom prints.",
    features: [
      "100% Airlume combed and ring-spun cotton",
      "Unisex sizing",
      "Coverstitching on collar and sleeves"
    ],
    image: "/assets/Clothing/T-ShirtRegular.png",
    gallery: [
      "/assets/Clothing/T-ShirtRegular-Front.png",
      "/assets/Clothing/T-ShirtRegular-Back.png"
    ],
    category: {
      parent: "Apparel",
      sub: "T-Shirts"
    },
    // Variant system for precise inventory and 3D Customizer mapping
    variants: {
      colors: [
        { name: "Deep Black", hex: "#000000", image: "/assets/Clothing/T-Shirt-Black.png" },
        { name: "Arctic White", hex: "#FFFFFF", image: "/assets/Clothing/T-Shirt-White.png" },
        { name: "Royal Blue", hex: "#002366", image: "/assets/Clothing/T-Shirt-Blue.png" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    customizable: true,
    printAreas: ["front", "back"], // Logic for the 3D Studio
    inStock: true,
    rating: 4.8,
    reviewCount: 124
  },
  // Additional products follow this structure...
];

/**
 * Helper to find a product by Slug (better for SEO than IDs)
 */
export const getProductBySlug = (slug) => {
  return products.find((p) => p.slug === slug);
};