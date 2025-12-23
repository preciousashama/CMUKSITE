'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// 1. Define what a Cart Item looks like
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  options?: {
    size?: string;
    color?: string;
    designId?: string; // For custom products from your studio
  };
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, options?: any) => void;
  updateQuantity: (productId: string, quantity: number, options?: any) => void;
  clearCart: () => void;
  subtotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize with empty array for SSR (Server Side Rendering)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 2. LOAD: Fetch cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cmuk_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // 3. SAVE: Sync cart to LocalStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cmuk_cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // 4. LOGIC: Add to Cart (Merge quantities if item exists)
  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => 
          item.productId === newItem.productId && 
          item.options?.size === newItem.options?.size &&
          item.options?.color === newItem.options?.color
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prev];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return updatedCart;
      }
      return [...prev, newItem];
    });
  };

  // 5. LOGIC: Update Quantity
  const updateQuantity = (productId: string, quantity: number, options?: any) => {
    if (quantity < 1) return removeFromCart(productId, options);
    
    setCart((prev) => 
      prev.map((item) => 
        (item.productId === productId && 
         item.options?.size === options?.size && 
         item.options?.color === options?.color)
          ? { ...item, quantity }
          : item
      )
    );
  };

  // 6. LOGIC: Remove Item
  const removeFromCart = (productId: string, options?: any) => {
    setCart((prev) => prev.filter((item) => 
      !(item.productId === productId && 
        item.options?.size === options?.size && 
        item.options?.color === options?.color)
    ));
  };

  const clearCart = () => setCart([]);

  // 7. DERIVED STATE: Subtotal and Count
  const subtotal = useMemo(() => 
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0), 
  [cart]);

  const cartCount = useMemo(() => 
    cart.reduce((acc, item) => acc + item.quantity, 0), 
  [cart]);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};