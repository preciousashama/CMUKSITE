// src/data/products.js

// Utility function to format prices in GBP
export function formatPrice(price) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(price);
}

// Static list of products
export const products = [
  {
    id: 1,
    name: "Adult T-Shirt - Print Front or Back Only",
    price: 9.99,
    description: "A super comfortable t-shirt perfect for any occasion.",
    image: "/assets/Clothing/T-ShirtRegular.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Adult"
  },
]