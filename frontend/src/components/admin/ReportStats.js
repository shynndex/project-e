import React from 'react';
import Card from '../shared/Card';

const ReportStats = ({ data }) => {
  const stats = [
    {
      title: 'Doanh thu hôm nay',
      value: `$${data.daily.toFixed(2)}`,
      icon: 'fas fa-calendar-day',
      color: 'bg-green-500',
      change: '+5% so với hôm qua'
    },
    {
      title: 'Doanh thu tuần này',
      value: `$${data.weekly.toFixed(2)}`,
      icon: 'fas fa-calendar-week',
      color: 'bg-blue-500',
      change: '+12% so với tuần trước'
    },
    {
      title: 'Doanh thu tháng này',
      value: `$${data.monthly.toFixed(2)}`,
      icon: 'fas fa-calendar-alt',
      color: 'bg-purple-500',
      change: '+18% so với tháng trước'
    },
    {
      title: 'Trung bình đơn hàng',
      value: `$${data.averageOrderValue.toFixed(2)}`,
      icon: 'fas fa-chart-line',
      color: 'bg-yellow-500',
      change: '+3% so với tháng trước'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <div className="flex items-center">
            <div className={`${stat.color} text-white p-3 rounded-lg mr-4`}>
              <i className={`${stat.icon} text-2xl`}></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-green-600 mt-1">{stat.change}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReportStats;