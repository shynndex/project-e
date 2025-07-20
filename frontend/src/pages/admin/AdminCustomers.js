import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { customerService } from '../../services/customerService';
import CustomerTable from '../../components/admin/CustomerTable';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Card from '../../components/shared/Card';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      ('Fetching customers from AdminCustomers component...');
      const data = await customerService.getAllCustomers();
      ('Customers data received:', data);
      
      // Đảm bảo data là một mảng
      if (data && typeof data === 'object') {
        if (Array.isArray(data)) {
          setCustomers(data);
        } else if (data.data && Array.isArray(data.data)) {
          setCustomers(data.data);
        } else {
          console.error('Unexpected data format:', data);
          setCustomers([]);
          setError('Dữ liệu khách hàng không đúng định dạng');
        }
      } else {
        setCustomers([]);
        setError('Không nhận được dữ liệu khách hàng');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.message || 'Failed to fetch customers');
      toast.error('Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-50 border border-red-200 text-red-700">
        <div className="flex items-center mb-4">
          <i className="fas fa-exclamation-triangle text-2xl mr-3"></i>
          <h2 className="text-xl font-semibold">Lỗi tải dữ liệu</h2>
        </div>
        <p className="mb-4">{error}</p>
        <button 
          onClick={fetchCustomers}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Thử lại
        </button>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý khách hàng</h1>
        <p className="text-gray-600">Xem thông tin khách hàng đã đăng ký</p>
      </div>

      <CustomerTable customers={customers} />
    </div>
  );
};

export default AdminCustomers;