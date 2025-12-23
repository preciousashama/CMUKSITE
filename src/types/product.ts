/**
 * Defines the strict structure for all CMUK products.
 * Includes support for standard shop items and 3D customizer bases.
 */

export type ProductCategory = 'T-Shirts' | 'Hoodies' | 'Accessories' | 'Archive' | 'Custom';

export interface ProductTag {
  label: string;
  type: 'edition' | 'status' | 'fabric'; // Used for color-coding badges
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number; // Optional: for sale items
  currency: 'GBP';
  
  // Media
  image: string; // Primary thumbnail
  gallery: string[]; // Additional views
  
  // Categorization
  category: ProductCategory;
  tags: ProductTag[];
  
  // Details
  description: string;
  features: string[]; // Bullet points for the product page
  
  // Inventory/Variants
  sizes: string[];
  colors: {
    name: string;
    hex: string;
  }[];
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
  
  // 3D Studio Specific (Optional)
  isCustomizable: boolean;
  threeDModelPath?: string; // Path to .glb file
}