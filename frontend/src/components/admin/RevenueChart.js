import React from 'react';

const RevenueChart = ({ data, period }) => {
  // Simple chart implementation - in real app, use Chart.js or similar
  const chartData = [
    { label: 'Hôm nay', value: data.daily },
    { label: 'Tuần này', value: data.weekly },
    { label: 'Tháng này', value: data.monthly }
  ];

  const maxValue = Math.max(...chartData.map(item => item.value));

  return (
    <div className="space-y-4">
      <div className="text-center text-gray-600 mb-6">
        Biểu đồ doanh thu theo {period === 'daily' ? 'ngày' : period === 'weekly' ? 'tuần' : 'tháng'}
      </div>
      
      {chartData.map((item, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="w-20 text-sm text-gray-600">{item.label}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
            <div
              className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
              style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
            >
              <span className="text-white text-xs font-semibold">
                ${item.value.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Tổng đơn hàng:</span>
            <span className="font-semibold ml-2">{data.totalOrders}</span>
          </div>
          <div>
            <span className="text-gray-600">Đã hoàn thành:</span>
            <span className="font-semibold ml-2">{data.completedOrders}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;