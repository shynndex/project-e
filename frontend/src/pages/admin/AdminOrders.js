import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { orderService } from '../../services/orderService';
import OrderTable from '../../components/admin/OrderTable';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      ("Admin orders:", data); // Debug log
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success('Cập nhật trạng thái đơn hàng thành công');
      
      // Cập nhật trạng thái trong state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus } 
            : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Lỗi cập nhật trạng thái đơn hàng');
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" className="py-16" />;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
        <p className="font-medium">Lỗi: {error}</p>
        <button 
          onClick={fetchOrders}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-gray-600">Theo dõi và cập nhật trạng thái đơn hàng</p>
      </div>

      <OrderTable orders={orders} onStatusUpdate={handleStatusUpdate} />
    </div>
  );
};

export default AdminOrders;