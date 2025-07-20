import React from 'react';
import Card from '../shared/Card';

const CustomerTable = ({ customers }) => {
  // Đảm bảo customers là một mảng
  const customerList = Array.isArray(customers) ? customers : [];
  
  ('CustomerTable received:', customers);
  ('Type of customers:', typeof customers);
  ('Is Array:', Array.isArray(customers));

  if (customerList.length === 0) {
    return (
      <Card className="text-center py-8">
        <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
        <p className="text-gray-600">Chưa có khách hàng nào</p>
      </Card>
    );
  }

  return (
    <Card padding={false}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số điện thoại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đăng ký
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customerList.map((customer, index) => (
              <tr key={customer._id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-medium text-sm">
                        {customer.name ? customer.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {customer.name || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {customer.email || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {customer.phone || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {customer.address || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.createdAt 
                    ? new Date(customer.createdAt).toLocaleDateString('vi-VN') 
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CustomerTable;