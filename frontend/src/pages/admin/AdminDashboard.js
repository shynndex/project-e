import React, { useState, useEffect } from 'react';
import DashboardStats from '../../components/admin/DashboardStats';
import RecentOrders from '../../components/admin/RecentOrders';
import Card from '../../components/shared/Card';

const AdminDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan về hoạt động của cửa hàng</p>
      </div>

      <DashboardStats />
      
      <div className="mt-8">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Đơn hàng gần đây</h2>
          <RecentOrders />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;