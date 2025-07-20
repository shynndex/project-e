import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminReports from './pages/admin/AdminReports';

import ClientLayout from './pages/client/ClientLayout';
import HomePage from './pages/client/HomePage';
import ProductDetailPage from './pages/client/ProductDetailPage';
import CartPage from './pages/client/CartPage';
import CheckoutPage from './pages/client/CheckoutPage';
import OrderSuccessPage from './pages/client/OrderSuccessPage'; 
import OrderHistoryPage from './pages/client/OrderHistoryPage';
import LoginPage from './pages/client/LoginPage';

import LoadingSpinner from './components/shared/LoadingSpinner';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Routes>
        {/* Redirect root to client */}
        <Route path="/" element={<Navigate to="/client" replace />} />
        
        {/* Client Routes */}
        <Route path="/client" element={<ClientLayout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-success" element={<OrderSuccessPage />} />
            <Route path="orders" element={<OrderHistoryPage />} />
            <Route path="login" element={<LoginPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<Navigate to="/client" replace />} />
      </Routes>
    </div>
  );
}

export default App;