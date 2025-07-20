import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartItems, isInitialized]);

  const addToCart = (product) => {
    if (!product || !product._id) {
      console.error('Invalid product:', product);
      toast.error('Không thể thêm sản phẩm không hợp lệ');
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // Thông báo khi cập nhật số lượng
        toast.success(`Đã thêm ${product.quantity || 1} sản phẩm "${product.name}" vào giỏ hàng`, {
          icon: '🛒'
        });
        
        // Cập nhật số lượng nếu sản phẩm đã có trong giỏ
        return prevItems.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      } else {
        // Thông báo khi thêm sản phẩm mới
        toast.success(`Đã thêm "${product.name}" vào giỏ hàng`, {
          icon: '🛒'
        });
        
        // Thêm sản phẩm mới vào giỏ hàng
        return [...prevItems, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const product = cartItems.find(item => item._id === productId);
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item._id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    
    // Thông báo khi cập nhật số lượng
    if (product) {
      toast.info(`Đã cập nhật số lượng "${product.name}" thành ${newQuantity}`, {
        icon: '🔄'
      });
    }
  };

  const removeFromCart = (productId) => {
    const product = cartItems.find(item => item._id === productId);
    
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    
    if (product) {
      toast.info(`Đã xóa "${product.name}" khỏi giỏ hàng`, {
        icon: '🗑️'
      });
    }
  };

  const clearCart = () => {
    setCartItems([]);
    
    toast.info('Đã xóa toàn bộ giỏ hàng', {
      icon: '🧹'
    });
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};