import React, { ReactNode } from 'react';

// 扩展接口，添加children和className
interface DashboardCardProps {
  title: string;
  value?: number | string; // 变为可选，因为有些卡片可能只需要标题和内容
  icon?: ReactNode;
  className?: string; // 允许自定义样式
  children?: ReactNode; // 允许卡片包含子内容
  trend?: 'up' | 'down' | 'same';
  trendPercentage?: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  className = '',
  children,
  trend,
  trendPercentage
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* 标题区域 */}
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon && <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>}
      </div>

      {/* 主要内容区域 - 显示value或children */}
      {value !== undefined ? (
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      ) : (
        <div>{children}</div>
      )}

      {/* 趋势显示 */}
      {trend && trendPercentage && (
        <div className={`flex items-center mt-2 text-sm ${
          trend === 'up' ? 'text-green-600' : 
          trend === 'down' ? 'text-red-600' : 'text-gray-500'
        }`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          <span className="ml-1">{Math.abs(trendPercentage)}%</span>
          <span className="ml-1 text-gray-500">from last month</span>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
