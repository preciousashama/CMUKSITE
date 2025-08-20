import React, { createContext, useContext, useEffect, useState } from 'react';

// Assume products is imported or available here
// import products from '../data/products';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('myShopCart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        const loadedCart = cartData
          .map(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
              return { product, quantity: item.quantity };
            }
            return null;
          })
          .filter(Boolean);
        setCart(loadedCart);
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const cartData = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    localStorage.setItem('myShopCart', JSON.stringify(cartData));
  }, [cart]);

  // Add to cart function
  function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) {
      console.error('Product not found!');
      return false;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });

    return true;
  }

  // Remove from cart function
  function removeFromCart(productId) {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    return true;
  }

  // Update quantity function
  function updateQuantity(productId, quantity) {
    quantity = Math.max(1, quantity);
    let updated = false;
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.product.id === productId) {
          updated = true;
          return { ...item, quantity };
        }
        return item;
      })
    );
    return updated;
  }

  // Calculate total
  function calculateTotal() {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  // Clear cart
  function clearCart() {
    setCart([]);
  }

  // Calculate total item count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        calculateTotal,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for using cart context easily
export function useCart() {
  return useContext(CartContext);
}
