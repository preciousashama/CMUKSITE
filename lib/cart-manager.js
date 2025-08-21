import React, { createContext, useContext, useEffect, useState } from 'react';
import { products } from '../lib/products-manager';
 

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage (only in browser)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('myShopCart');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          const loadedCart = cartData
            .map(item => {
              const product = products.find(p => p.id === item.productId);
              return product ? { product, quantity: item.quantity } : null;
            })
            .filter(Boolean);

          setCart(loadedCart);
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cartData = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));
      localStorage.setItem('myShopCart', JSON.stringify(cartData));
    }
  }, [cart]);

  const addToCart = (productId, quantity = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      console.warn('Attempted to add non-existent product:', productId);
      return false;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });

    return true;
  };

  const removeFromCart = productId => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    quantity = Math.max(1, quantity);
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateTotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
