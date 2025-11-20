import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState({});
  const [products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadCartFromDatabase();
    } else {
      loadCartFromLocalStorage();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    try {
      const response = await api.get('/product');
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('cartData');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartData(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const loadCartFromDatabase = async () => {
    try {
      const response = await api.get('/cart');
      if (response.data.success) {
        setCartData(response.data.cartData || {});
      }
    } catch (error) {
      console.error('Error loading cart from database:', error);
      loadCartFromLocalStorage();
    } finally {
      setIsLoaded(true);
    }
  };

  const syncCartWithDatabase = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem('cartData') || '{}');
      if (Object.keys(localCart).length > 0) {
        const response = await api.post('/cart/sync', { localCartData: localCart });
        if (response.data.success) {
          localStorage.removeItem('cartData');
          setCartData(response.data.cartData);
        }
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  const addToCart = async (productId, size) => {
    if (!productId || !size) {
      alert('Please select a size');
      return;
    }

    const cartKey = `${productId}_${size}`;

    if (isAuthenticated) {
      try {
        const response = await api.post('/cart/add', { productId, size, quantity: 1 });
        if (response.data.success) {
          setCartData(response.data.cartData);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart');
      }
    } else {
      const newCartData = { ...cartData };
      if (newCartData[cartKey]) {
        newCartData[cartKey] += 1;
      } else {
        newCartData[cartKey] = 1;
      }
      setCartData(newCartData);
      localStorage.setItem('cartData', JSON.stringify(newCartData));
    }
  };

  const updateQuantity = async (productId, size, quantity) => {
    const cartKey = `${productId}_${size}`;

    if (isAuthenticated) {
      try {
        const response = await api.post('/cart/update', { productId, size, quantity });
        if (response.data.success) {
          setCartData(response.data.cartData);
        }
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    } else {
      const newCartData = { ...cartData };
      if (quantity <= 0) {
        delete newCartData[cartKey];
      } else {
        newCartData[cartKey] = quantity;
      }
      setCartData(newCartData);
      localStorage.setItem('cartData', JSON.stringify(newCartData));
    }
  };

  const removeFromCart = async (productId, size) => {
    if (isAuthenticated) {
      try {
        const response = await api.post('/cart/remove', { productId, size });
        if (response.data.success) {
          setCartData(response.data.cartData);
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      const cartKey = `${productId}_${size}`;
      const newCartData = { ...cartData };
      delete newCartData[cartKey];
      setCartData(newCartData);
      localStorage.setItem('cartData', JSON.stringify(newCartData));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        const response = await api.post('/cart/clear');
        if (response.data.success) {
          setCartData({});
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      setCartData({});
      localStorage.removeItem('cartData');
    }
  };

  const getTotalItems = () => {
    return Object.values(cartData).reduce((total, quantity) => total + quantity, 0);
  };

  const getTotalPrice = () => {
    let total = 0;
    Object.keys(cartData).forEach((cartKey) => {
      const [productId] = cartKey.split('_');
      const product = products.find((p) => p._id === productId);
      if (product) {
        total += product.price * cartData[cartKey];
      }
    });
    return total;
  };

  const getCartItems = () => {
    const items = [];
    Object.keys(cartData).forEach((cartKey) => {
      const [productId, size] = cartKey.split('_');
      const product = products.find((p) => p._id === productId);
      if (product) {
        items.push({
          ...product,
          size,
          quantity: cartData[cartKey],
          cartKey,
        });
      }
    });
    return items;
  };

  const setAuthStatus = (status) => {
    setIsAuthenticated(status);
    if (status) {
      syncCartWithDatabase();
    }
  };

  const value = {
    cartData,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getCartItems,
    setAuthStatus,
    isLoaded,
    products,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};