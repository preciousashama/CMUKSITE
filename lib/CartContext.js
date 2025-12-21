'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext();

// Constants
const CART_STORAGE_KEY = 'cmuk_cart_v1';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Persistance: Load cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart data", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // 2. Persistance: Sync cart to LocalStorage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // Helper for unique key generation (O(1) comparison vs O(N) stringify)
  const generateItemKey = (productId, options = {}) => {
    const optionsKey = Object.keys(options)
      .sort()
      .map(k => `${k}:${options[k]}`)
      .join('|');
    return `${productId}-${optionsKey}`;
  };

  const addToCart = useCallback((product, quantity = 1, options = {}) => {
    const itemKey = generateItemKey(product.id, options);

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.itemKey === itemKey);

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity
        };
        return newCart;
      }

      // Store basic product info to avoid unnecessary prop-drilling or DB lookups
      return [...prev, { 
        itemKey, 
        productId: product.id, 
        name: product.name,
        price: product.price,
        image: product.image,
        quantity, 
        options 
      }];
    });
  }, []);

  const removeFromCart = useCallback((itemKey) => {
    setCart(prev => prev.filter(item => item.itemKey !== itemKey));
  }, []);

  const updateQuantity = useCallback((itemKey, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev =>
      prev.map(item =>
        item.itemKey === itemKey ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // 3. Optimization: Memoized calculations
  const cartSubtotal = useMemo(() => 
    cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
  [cart]);

  const cartCount = useMemo(() => 
    cart.reduce((sum, item) => sum + item.quantity, 0), 
  [cart]);

  // Prevent Hydration mismatch: don't render children until cart is loaded from storage
  if (!isInitialized) return null; 

  return (
    <CartContext.Provider
      value={{ 
        cart, 
        cartCount, 
        cartSubtotal, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};