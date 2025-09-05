import { createContext, useContext, useState } from 'react';


// Create context
export const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (productId, quantity = 1, options = {}) => {
    setCart(prev => {
      const existing = prev.find(item =>
        item.productId === productId &&
        JSON.stringify(item.options) === JSON.stringify(options)
      );

      if (existing) {
        return prev.map(item =>
          item.productId === productId &&
          JSON.stringify(item.options) === JSON.stringify(options)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { productId, quantity, options }];
      }
    });
  };

  const removeFromCart = (productId, options = {}) => {
    setCart(prev =>
      prev.filter(item =>
        !(item.productId === productId &&
          JSON.stringify(item.options) === JSON.stringify(options))
      )
    );
  };

  const updateQuantity = (productId, quantity, options = {}) => {
    setCart(prev =>
      prev.map(item =>
        item.productId === productId &&
        JSON.stringify(item.options) === JSON.stringify(options)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
