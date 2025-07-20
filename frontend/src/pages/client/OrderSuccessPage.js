import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/shared/Button';
import Card from '../../components/shared/Card';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, paymentMethod } = location.state || {};
  
  useEffect(() => {
    if (!orderId) {
      navigate('/client');
    }
    
    // Cuộn lên đầu trang
    window.scrollTo(0, 0);
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Card className="text-center py-12">
        <div className="text-green-500 mb-6">
          <i className="fas fa-check-circle text-8xl"></i>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Đặt hàng thành công!
        </h1>
        
        <p className="text-xl text-gray-600 mb-6">
          Cảm ơn bạn đã đặt hàng. Chúng tôi đã nhận được đơn hàng của bạn và sẽ xử lý trong thời gian sớm nhất.
        </p>
        
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="mb-3">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-semibold ml-2">{orderId}</span>
            </div>
            
            <div className="mb-3">
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <span className="font-semibold ml-2">
                {paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thẻ tín dụng/ghi nợ'}
              </span>
            </div>
            
            <div>
              <span className="text-gray-600">Trạng thái:</span>
              <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded ml-2">
                {paymentMethod === 'cod' ? 'Chờ xác nhận' : 'Đã thanh toán'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          <Button 
            onClick={() => navigate('/client/orders')}
            className="flex-1"
          >
            <i className="fas fa-receipt mr-2"></i>
            Xem đơn hàng
          </Button>
          
          <Button 
            onClick={() => navigate('/client')}
            variant="outline"
            className="flex-1"
          >
            <i className="fas fa-home mr-2"></i>
            Tiếp tục mua sắm
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderSuccessPage;