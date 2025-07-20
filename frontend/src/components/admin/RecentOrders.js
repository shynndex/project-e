import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import LoadingSpinner from '../shared/LoadingSpinner';

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const allOrders = await orderService.getAllOrders();
      // Get last 5 orders
      const recentOrders = allOrders.slice(0, 5);
      setOrders(recentOrders);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý ID an toàn
  const getOrderIdDisplay = (id) => {
    if (typeof id === 'string') {
      return id.slice(-8); // Nếu là chuỗi, lấy 8 ký tự cuối
    } else if (typeof id === 'number') {
      return `#${id}`; // Nếu là số, thêm dấu # phía trước
    } else {
      return `Order-${String(id).substring(0, 8)}`; // Trường hợp khác
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Chưa có đơn hàng nào
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <i className="fas fa-receipt text-white text-sm"></i>
            </div>
            <div>
              <div className="font-medium">#{order._id ? getOrderIdDisplay(order._id) : 'N/A'}</div>
              <div className="text-sm text-gray-500">{order.customerEmail || 'N/A'}</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
              {order.status || 'N/A'}
            </span>
            <div className="text-right">
              <div className="font-semibold">${order.total ? order.total.toFixed(2) : '0.00'}</div>
              <div className="text-sm text-gray-500">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentOrders;