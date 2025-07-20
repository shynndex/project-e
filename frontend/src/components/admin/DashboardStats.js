import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { customerService } from '../../services/customerService';
import Card from '../shared/Card';
import LoadingSpinner from '../shared/LoadingSpinner';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, orders, customers] = await Promise.all([
        productService.getAllProducts(),
        orderService.getAllOrders(),
        customerService.getAllCustomers()
      ]);
      
      const revenue = orders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.total, 0);
      
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalRevenue: revenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    {
      title: 'Sản phẩm',
      value: stats.totalProducts,
      icon: 'fas fa-box',
      color: 'bg-blue-500',
      change: '+12% từ tháng trước'
    },
    {
      title: 'Đơn hàng',
      value: stats.totalOrders,
      icon: 'fas fa-shopping-cart',
      color: 'bg-green-500',
      change: '+8% từ tháng trước'
    },
    {
      title: 'Khách hàng',
      value: stats.totalCustomers,
      icon: 'fas fa-users',
      color: 'bg-purple-500',
      change: '+15% từ tháng trước'
    },
    {
      title: 'Doanh thu',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: 'fas fa-dollar-sign',
      color: 'bg-yellow-500',
      change: '+23% từ tháng trước'
    }
  ];

  if (loading) {
    return <LoadingSpinner size="large" className="py-8" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <Card key={index} className="relative overflow-hidden">
          <div className="flex items-center">
            <div className={`${item.color} text-white p-3 rounded-lg mr-4`}>
              <i className={`${item.icon} text-2xl`}></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{item.title}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-green-600 mt-1">{item.change}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;