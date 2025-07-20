import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import Button from '../shared/Button';

const ClientHeader = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { getTotalItems } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/client');
  };

  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/client" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">EStore</h1>
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Cart Icon - Always visible */}
            <Link 
              to="/client/cart" 
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <i className="fas fa-shopping-cart text-xl"></i>
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Xin chào, {currentUser.name}</span>
                <Button variant="outline" size="small" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate('/client/login')}>
                Đăng nhập
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;