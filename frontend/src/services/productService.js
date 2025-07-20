import { productApi } from './api';

export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await productApi.get('/api/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await productApi.get(`/api/products/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  },

  // Create product
  createProduct: async (productData) => {
    try {
      const response = await productApi.post('/api/products', productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await productApi.put(`/api/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await productApi.delete(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  }
};