import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import CheckoutForm from '../../components/client/CheckoutForm';
import OrderSummary from '../../components/client/OrderSummary';
import Card from '../../components/shared/Card';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      // 1. Create order with required fields
      const orderData = {
        customerEmail: currentUser?.email || 'guest@example.com',
        items: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: getTotalPrice(),
        status: formData.paymentMethod === 'cod' ? 'pending' : 'processing',
        deliveryAddress: formData.deliveryAddress,
        paymentMethod: formData.paymentMethod // Thêm trường này
      };

      ("Sending order data:", orderData);
      const order = await orderService.createOrder(orderData);
      ("Order created:", order);

      // 2. Process payment
      const paymentData = {
        orderId: order._id,
        amount: getTotalPrice(),
        method: formData.paymentMethod
      };

      await paymentService.processPayment(paymentData);

      // 3. Clear cart
      clearCart();
      
      // 4. Show success message
      toast.success('Đặt hàng thành công!');
      
      // 5. Navigate to success page
      navigate('/client/order-success', { 
        state: { 
          orderId: order._id,
          paymentMethod: formData.paymentMethod
        }
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(`Lỗi: ${error.message || 'Không thể hoàn tất đơn hàng'}`);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/client/cart');
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CheckoutForm onSubmit={handleSubmit} loading={loading} />
          </Card>
        </div>
        
        <div>
          <Card>
            <OrderSummary items={cartItems} total={getTotalPrice()} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;