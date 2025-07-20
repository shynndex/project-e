import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import CartItem from '../../components/client/CartItem';
import Button from '../../components/shared/Button';
import Card from '../../components/shared/Card';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();

  const handleCheckout = () => {
    if (!currentUser) {
      // Lưu thông tin rằng người dùng đang cố gắng thanh toán
      localStorage.setItem('redirectAfterLogin', '/client/checkout');
      toast.info('Vui lòng đăng nhập để tiếp tục thanh toán', {
        icon: '🔑'
      });
      navigate('/client/login');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.warning('Giỏ hàng trống, vui lòng thêm sản phẩm trước khi thanh toán', {
        icon: '⚠️'
      });
      return;
    }
    
    navigate('/client/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center py-16">
          <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-6">Hãy thêm một số sản phẩm vào giỏ hàng</p>
          <Button onClick={() => navigate('/client')}>
            Tiếp tục mua sắm
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="space-y-4">
              {cartItems.map(item => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/client')}
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Tiếp tục mua sắm
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
                    clearCart();
                  }
                }}
                className="text-red-500 border-red-500 hover:bg-red-50"
              >
                <i className="fas fa-trash-alt mr-2"></i>
                Xóa giỏ hàng
              </Button>
            </div>
          </Card>
        </div>
        
        <div>
          <Card>
            <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>$0.00</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Tổng cộng:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleCheckout}
              className="w-full"
              variant="success"
            >
              {currentUser ? 'Tiến hành thanh toán' : 'Đăng nhập để thanh toán'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;