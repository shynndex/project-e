import React from 'react';
import { useCart } from '../../contexts/CartContext';
import Button from '../shared/Button';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(item._id, newQuantity);
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b last:border-b-0">
      <img
        src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {item.name}
        </h3>
        <p className="text-gray-600">${item.price}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          size="small"
          variant="outline"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 p-0 flex items-center justify-center"
        >
          <i className="fas fa-minus text-xs"></i>
        </Button>
        
        <span className="w-12 text-center font-semibold">
          {item.quantity}
        </span>
        
        <Button
          size="small"
          variant="outline"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 p-0 flex items-center justify-center"
        >
          <i className="fas fa-plus text-xs"></i>
        </Button>
      </div>
      
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={() => removeFromCart(item._id)}
          className="text-red-500 hover:text-red-700 text-sm mt-1"
        >
          <i className="fas fa-trash mr-1"></i>
          Xóa
        </button>
      </div>
    </div>
  );
};

export default CartItem;