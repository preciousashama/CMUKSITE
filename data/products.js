// lib/productManager.js

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
  {
    id: 2,
    name: "Adult T-Shirt - Print Front & Back",
    price: 14.99,
    description: "Stylish and comfortable t-shirt with printing on both sides.",
    image: "/assets/Clothing/T-ShirtRegular.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Adult"
  },
  {
    id: 3,
    name: "Heavy Cotton T-Shirt - Print Front or Back Only",
    price: 17.99,
    description: "Premium heavy cotton t-shirt for durability and comfort.",
    image: "/assets/Clothing/blackteeheavy.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Adult"
  },
  {
    id: 4,
    name: "Heavy Cotton T-Shirt - Print Front & Back",
    price: 24.99,
    description: "Premium heavy cotton t-shirt with printing on both sides.",
    image: "/assets/Clothing/blackteeheavy.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Adult"
  },
  {
    id: 5,
    name: "Zip-Up Hoodie - Print Front or Back Only",
    price: 24.99,
    description: "A cozy zip-up hoodie to keep you warm during cold days.",
    image: "/assets/Clothing/ZIPUP.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Adult"
  },
  {
    id: 6,
    name: "Zip-Up Hoodie - Print Front & Back",
    price: 29.99,
    description: "Cozy zip-up hoodie with printing on both sides.",
    image: "/assets/Clothing/ZIPUP.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Adult"
  },
  {
    id: 7,
    name: "Adult Hoodie - Print Front or Back Only",
    price: 19.99,
    description: "Comfortable pullover hoodie perfect for casual wear.",
    image: "/assets/Clothing/HOODIE.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Adult"
  },
  {
    id: 8,
    name: "Adult Hoodie - Print Front & Back",
    price: 25.99,
    description: "Comfortable pullover hoodie with printing on both sides.",
    image: "/assets/Clothing/HOODIE.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Adult"
  },
  {
    id: 9,
    name: "Adult Sweatshirt - Print Front or Back Only",
    price: 14.99,
    description: "Classic sweatshirt for everyday comfort.",
    image: "/assets/Clothing/SWEATSHIRT.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Adult"
  },
  {
    id: 10,
    name: "Adult Sweatshirt - Print Front & Back",
    price: 39.99,
    description: "Classic sweatshirt with printing on both sides.",
    image: "/assets/Clothing/SWEATSHIRT.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Adult"
  },
  {
    id: 11,
    name: "Junior T-Shirt - Print Front or Back Only",
    price: 7.99,
    description: "Comfortable t-shirt designed for juniors and kids.",
    image: "/assets/Clothing/jrtees.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Junior"
  },
  {
    id: 12,
    name: "Junior T-Shirt - Print Front and Back",
    price: 9.99,
    description: "Junior t-shirt with printing on both sides.",
    image: "/assets/Clothing/jrtees.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Junior"
  },
  {
    id: 13,
    name: "Junior Hoodie - Print Front or Back Only",
    price: 11.99,
    description: "Cozy hoodie designed for juniors and kids.",
    image: "/assets/Clothing/jrhoodie.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Junior"
  },
  {
    id: 14,
    name: "Junior Hoodie - Print Front and Back",
    price: 13.99,
    description: "Junior hoodie with printing on both sides.",
    image: "/assets/Clothing/jrhoodie.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Junior"
  },
  {
    id: 15,
    name: "Junior Sweatshirt - Print Front or Back Only",
    price: 14.99,
    description: "Comfortable sweatshirt for juniors and kids.",
    image: "/assets/Clothing/jrsweatshirts.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Junior"
  },
  {
    id: 16,
    name: "Junior Sweatshirt - Print Front and Back",
    price: 17.99,
    description: "Junior sweatshirt with printing on both sides.",
    image: "/assets/Clothing/jrsweatshirts.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Junior"
  },
  {
    id: 17,
    name: "Baby T-Shirt - Print Front or Back Only",
    price: 4.99,
    description: "Soft and comfortable t-shirt for babies and toddlers.",
    image: "/assets/Clothing/babytee.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Toddlers"
  },
  {
    id: 18,
    name: "Baby T-Shirt - Print Front & Back",
    price: 7.99,
    description: "Baby t-shirt with printing on both sides.",
    image: "/assets/Clothing/babytee.png",
    category: "Clothing",
    colors: ["Black", "White", "Red", "Blue"],
    size: "Toddlers"
  },
  {
    id: 19,
    name: "Heavy Duty Tote Shopping Bags",
    price: 27.99,
    description: "Durable tote bags perfect for shopping and everyday use.",
    image: "/assets/Bags/heavy-tote.png",
    category: "Bags",
    colors: ["Black", "Brown"]
  },
  {
    id: 20,
    name: "Lightweight Tote Shopping Bags",
    price: 7.99,
    description: "Lightweight and convenient tote bags for daily use.",
    image: "/assets/Bags/light-tote.png",
    category: "Bags",
    colors: ["Black", "White", "Red", "Blue"]
  },
  {
    id: 21,
    name: "Large Paper Bag",
    price: 7.99,
    description: "Large paper bags available in matt or glossy finish.",
    image: "/assets/Bags/paper-large.png",
    category: "Bags",
    colors: ["Black", "White", "Red", "Blue"],
    type: ["Matt", "Glossy"]
  },
  {
    id: 22,
    name: "Medium Paper Bag",
    price: 7.99,
    description: "Medium paper bags available in matt or glossy finish.",
    image: "/assets/Bags/paper-medium.png",
    category: "Bags",
    colors: ["Black", "White", "Red", "Blue"],
    type: ["Matt", "Glossy"]
  },
  {
    id: 23,
    name: "Small Paper Bags",
    price: 7.99,
    description: "Small paper bags available in matt or glossy finish.",
    image: "/assets/Bags/paper-small.png",
    category: "Bags",
    colors: ["Black", "White", "Red", "Blue"],
type: ["Matt", "Glossy"]
},
{
id: 24,
name: "Extra Small Paper Bags",
price: 7.99,
description: "Extra small paper bags available in matt or glossy finish.",
image: "/assets/Bags/paper-xs.png",
category: "Bags",
colors: ["Black", "White", "Red", "Blue"],
type: ["Matt", "Glossy"]
}
];
