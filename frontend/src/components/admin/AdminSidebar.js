import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const menuItems = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt'
    },
    {
      path: '/admin/products',
      label: 'Sản phẩm',
      icon: 'fas fa-box'
    },
    {
      path: '/admin/orders',
      label: 'Đơn hàng',
      icon: 'fas fa-shopping-cart'
    },
    {
      path: '/admin/customers',
      label: 'Khách hàng',
      icon: 'fas fa-users'
    },
    {
      path: '/admin/reports',
      label: 'Báo cáo',
      icon: 'fas fa-chart-bar'
    }
  ];

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <i className={item.icon}></i>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;