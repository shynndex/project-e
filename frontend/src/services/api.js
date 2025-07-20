import axios from 'axios';

const API_BASE_URLS = {
  products: 'http://localhost:3001',
  orders: 'http://localhost:3002',
  customers: 'http://localhost:3003',
  payments: 'http://localhost:3004'
};

const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/client/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const productApi = createApiInstance(API_BASE_URLS.products);
export const orderApi = createApiInstance(API_BASE_URLS.orders);
export const customerApi = createApiInstance(API_BASE_URLS.customers);
export const paymentApi = createApiInstance(API_BASE_URLS.payments);