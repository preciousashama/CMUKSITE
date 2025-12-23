"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Define the Archive Item structure
// Supports both standard products and custom 3D studio configurations
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category?: string;
  config?: {
    color: string;
    texture: string;
  };
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 2. INITIALIZE: Load Archive from LocalStorage on mount
  useEffect(() => {
    const savedArchive = localStorage.getItem('cmuk_archive_data');
    if (savedArchive) {
      try {
        setCart(JSON.parse(savedArchive));
      } catch (error) {
        console.error("Failed to parse archive data", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // 3. PERSIST: Save to LocalStorage whenever cart changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cmuk_archive_data', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // 4. ACTIONS
  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      // Check if item already exists (matching ID and same 3D config if applicable)
      const existingItemIndex = prev.findIndex(item => 
        item.id === newItem.id && 
        JSON.stringify(item.config) === JSON.stringify(newItem.config)
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prev];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      }
      
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  // 5. COMPUTED VALUES
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount, 
      cartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};

// 6. CUSTOM HOOK
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};