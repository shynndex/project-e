import React from 'react';
import Card from '../shared/Card';

const OrderCard = ({ order }) => {
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

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
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

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            Đơn hàng #{order._id ? getOrderIdDisplay(order._id) : 'N/A'}
          </h3>
          <p className="text-gray-600">
            Ngày đặt: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {getStatusText(order.status)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {order.items && order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
            <div className="flex items-center space-x-3">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">
                  ${item.price} x {item.quantity}
                </div>
              </div>
            </div>
            <div className="font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-gray-600">
          {order.items ? order.items.length : 0} sản phẩm
        </div>
        <div className="text-xl font-bold text-blue-600">
          Tổng: ${order.total ? order.total.toFixed(2) : '0.00'}
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;