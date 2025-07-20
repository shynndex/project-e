import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ClientNavigation = () => {
  const { currentUser } = useAuth();

  const navItems = [
    { path: '/client', label: 'Trang chủ', icon: 'fas fa-home' },
    ...(currentUser ? [
      { path: '/client/cart', label: 'Giỏ hàng', icon: 'fas fa-shopping-cart' },
      { path: '/client/orders', label: 'Đơn hàng của tôi', icon: 'fas fa-receipt' }
    ] : [])
  ];

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8 py-3">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/client'}
              className={({ isActive }) =>
                `flex items-center space-x-2 py-2 px-3 rounded transition-colors ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'hover:bg-blue-500'
                }`
              }
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default ClientNavigation;