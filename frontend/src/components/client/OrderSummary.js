import React from 'react';

const OrderSummary = ({ items, total }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Tóm tắt đơn hàng</h3>
      
      <div className="space-y-4 mb-6">
        {items.map(item => (
          <div key={item._id} className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img
                src={item.image || 'https://via.placeholder.com/50x50?text=No+Image'}
                alt={item.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">x{item.quantity}</div>
              </div>
            </div>
            <div className="font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Tạm tính:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Phí vận chuyển:</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between">
          <span>Thuế:</span>
          <span>$0.00</span>
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Tổng cộng:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;