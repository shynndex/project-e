import React, { useState } from 'react';
import Button from '../shared/Button';
import Input from '../shared/Input';

const CheckoutForm = ({ onSubmit, loading }) => {
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Default to COD
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [addressError, setAddressError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!deliveryAddress.trim()) {
      setAddressError('Vui lòng nhập địa chỉ giao hàng');
      return;
    }
    
    // Submit with validated data
    onSubmit({
      paymentMethod, 
      deliveryAddress
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold mb-6">Thông tin thanh toán</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Địa chỉ giao hàng <span className="text-red-500">*</span>
        </label>
        <textarea
          value={deliveryAddress}
          onChange={(e) => {
            setDeliveryAddress(e.target.value);
            setAddressError('');
          }}
          placeholder="Vui lòng nhập địa chỉ giao hàng đầy đủ"
          required
          rows="3"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            addressError ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {addressError && (
          <p className="mt-1 text-sm text-red-600">{addressError}</p>
        )}
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="text-lg font-medium mb-2">Phương thức thanh toán</div>
        
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
            className="mr-3"
          />
          <div className="flex items-center">
            <i className="fas fa-credit-card text-blue-600 mr-3"></i>
            <div>
              <div className="font-medium">Thẻ tín dụng/ghi nợ</div>
              <div className="text-sm text-gray-500">Visa, MasterCard, JCB</div>
            </div>
          </div>
        </label>

        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={() => setPaymentMethod('cod')}
            className="mr-3"
          />
          <div className="flex items-center">
            <i className="fas fa-money-bill-wave text-green-600 mr-3"></i>
            <div>
              <div className="font-medium">Thanh toán khi nhận hàng</div>
              <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt</div>
            </div>
          </div>
        </label>
      </div>

      <Button
        type="submit"
        variant="success"
        size="large"
        loading={loading}
        className="w-full"
      >
        {loading ? 'Đang xử lý...' : 'Hoàn tất thanh toán'}
      </Button>
    </form>
  );
};

export default CheckoutForm;