import React from 'react';

type Status =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'under_review'
  | 'decided'
  | 'completed';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = ''
}) => {
  // 状态配置：颜色、文本和图标
  const statusConfig = {
    not_started: {
      text: 'Not Started',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
    },
    in_progress: {
      text: 'In Progress',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    submitted: {
      text: 'Submitted',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-800',
    },
    under_review: {
      text: 'Under Review',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
    },
    decided: {
      text: 'Decided',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
    },
    completed: {
      text: 'Completed',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
    }
  };

  const config = statusConfig[status];
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';
  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${config.bgColor} ${config.textColor} ${sizeClasses} ${className}
    `}>
      {config.text}
    </span>
  );
};

export default StatusBadge;