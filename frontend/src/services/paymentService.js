import { paymentApi } from './api';

export const paymentService = {
  // Process payment
  processPayment: async (paymentData) => {
    try {
      const response = await paymentApi.post('/api/payments', paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to process payment');
    }
  },

  // Get payments by order ID
  getPaymentsByOrderId: async (orderId) => {
    try {
      const response = await paymentApi.get(`/api/payments/order/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
  },
  
  // Get all payments
  getAllPayments: async () => {
    try {
      const response = await paymentApi.get('/api/payments');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
  },
  
  // Get payment by ID
  getPaymentById: async (id) => {
    try {
      const response = await paymentApi.get(`/api/payments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment');
    }
  }
};