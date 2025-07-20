import { orderApi } from './api';

export const orderService = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const response = await orderApi.get('/api/orders');
      ("API response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      const response = await orderApi.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  },

  // Create order
  createOrder: async (orderData) => {
    try {
      ("Creating order with data:", orderData);
      const response = await orderApi.post('/api/orders', orderData);
      ("Order created:", response.data);
      return response.data;
    } catch (error) {
      console.error('Order creation error details:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    try {
      const response = await orderApi.put(`/api/orders/${id}`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update order');
    }
  },

  // Get customer orders
  getCustomerOrders: async (email) => {
    try {
      const response = await orderApi.get(`/api/orders/customer/${email}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch customer orders');
    }
  }
};