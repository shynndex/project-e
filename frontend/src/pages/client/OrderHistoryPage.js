import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/orderService';
import OrderCard from '../../components/client/OrderCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Card from '../../components/shared/Card';

const OrderHistoryPage = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Kiểm tra thông báo thành công từ trang thanh toán
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [location]);

  useEffect(() => {
    fetchUserOrders();
  }, [currentUser]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      // Lấy đơn hàng theo email người dùng
      const allOrders = await orderService.getAllOrders();
      ("All orders:", allOrders); // Debug log
      
      const userOrders = allOrders.filter(order => 
        order.customerEmail === currentUser?.email
      );
      
      ("User orders:", userOrders); // Debug log
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải lịch sử đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center py-16">
          <i className="fas fa-user-lock text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Vui lòng đăng nhập</h2>
          <p className="text-gray-500">Bạn cần đăng nhập để xem lịch sử đơn hàng</p>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center py-16">
          <i className="fas fa-receipt text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Chưa có đơn hàng</h2>
          <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lịch sử đơn hàng</h1>
      
      <div className="space-y-4">
        {orders.map(order => (
          <OrderCard key={order._id || order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;