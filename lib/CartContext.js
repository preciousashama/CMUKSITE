import { createContext, useState } from 'react';

export const tempCartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  return (
    <tempCartContext.Provider value={{ cart, addToCart }}>
      {children}
    </tempCartContext.Provider>
  );
};
