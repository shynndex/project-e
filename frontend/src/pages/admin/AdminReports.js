import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import RevenueChart from '../../components/admin/RevenueChart';
import ReportStats from '../../components/admin/ReportStats';
import Card from '../../components/shared/Card';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const AdminReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const orders = await orderService.getAllOrders();
      const processedData = processOrdersData(orders, selectedPeriod);
      setReportData(processedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processOrdersData = (orders, period) => {
    const now = new Date();
    const completedOrders = orders.filter(order => order.status === 'delivered');
    
    // Calculate different time periods
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const dailyRevenue = completedOrders
      .filter(order => new Date(order.createdAt) >= today)
      .reduce((sum, order) => sum + order.total, 0);
    
    const weeklyRevenue = completedOrders
      .filter(order => new Date(order.createdAt) >= weekAgo)
      .reduce((sum, order) => sum + order.total, 0);
    
    const monthlyRevenue = completedOrders
      .filter(order => new Date(order.createdAt) >= monthAgo)
      .reduce((sum, order) => sum + order.total, 0);

    return {
      daily: dailyRevenue,
      weekly: weeklyRevenue,
      monthly: monthlyRevenue,
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      totalRevenue: completedOrders.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: completedOrders.length > 0 
        ? completedOrders.reduce((sum, order) => sum + order.total, 0) / completedOrders.length 
        : 0
    };
  };

  if (loading) {
    return <LoadingSpinner size="large" className="py-16" />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo doanh thu</h1>
          <p className="text-gray-600">Theo dõi hiệu suất kinh doanh</p>
        </div>
        
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="daily">Theo ngày</option>
          <option value="weekly">Theo tuần</option>
          <option value="monthly">Theo tháng</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Lỗi: {error}
        </div>
      )}

      {reportData && (
        <>
          <ReportStats data={reportData} />
          <div className="mt-8">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Biểu đồ doanh thu</h2>
              <RevenueChart data={reportData} period={selectedPeriod} />
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReports;