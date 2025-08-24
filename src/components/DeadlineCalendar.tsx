import React, { useState } from 'react';
import { Calendar as CalendarIcon, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Deadline } from '@/types';
import StatusBadge from './StatusBadge';

interface DeadlineCalendarProps {
  deadlines: Deadline[];
}

const DeadlineCalendar: React.FC<DeadlineCalendarProps> = ({ deadlines }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // 月份名称
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // 获取当月的天数
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 获取当月第一天是星期几（0是星期日）
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // 切换到上一个月
  const prevMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(prevYear => prevYear - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  // 切换到下一个月
  const nextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(prevYear => prevYear + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // 获取当月的截止日期
  const getMonthlyDeadlines = () => {
    return deadlines.filter(deadline => {
      const date = new Date(deadline.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
  };

  // 获取特定日期的截止日期
  const getDeadlinesForDay = (day: number) => {
    return getMonthlyDeadlines().filter(deadline => {
      return new Date(deadline.date).getDate() === day;
    });
  };

  // 生成日历网格
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // 添加上个月的占位符
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 border border-gray-100 bg-gray-50"></div>);
    }

    // 添加当月的天数
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDeadlines = getDeadlinesForDay(day);
      const isToday = day === new Date().getDate() 
        && currentMonth === new Date().getMonth() 
        && currentYear === new Date().getFullYear();
      
      days.push(
        <div 
          key={day} 
          className={`
            h-16 border border-gray-100 p-1 relative
            ${isToday ? 'bg-blue-50 border-blue-200' : ''}
            ${dayDeadlines.length > 0 ? 'hover:bg-gray-50' : ''}
          `}
        >
          <div className={`
            text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full
            ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'}
          `}>
            {day}
          </div>
          
          {dayDeadlines.length > 0 && (
            <div className="mt-1 space-y-1 max-h-[calc(100%-24px)] overflow-y-auto">
              {dayDeadlines.slice(0, 2).map((deadline, index) => (
                <div 
                  key={index}
                  className="text-xs p-1 bg-red-50 text-red-700 rounded truncate"
                  title={`${deadline.universityName}: ${deadline.type}`}
                >
                  {deadline.universityName}
                </div>
              ))}
              
              {dayDeadlines.length > 2 && (
                <div className="text-xs text-gray-500 text-center">
                  +{dayDeadlines.length - 2} more
                </div>
              )}
            </div>
          )}
          
          {dayDeadlines.length > 0 && (
            <div className="absolute top-1 right-1">
              <AlertCircle className="h-3 w-3 text-red-500" />
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  // 获取即将到来的截止日期（未来7天）
  const getUpcomingDeadlines = () => {
    const today = new Date();
    return deadlines
      .filter(deadline => {
        const deadlineDate = new Date(deadline.date);
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* 日历头部 */}
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
          Application Deadlines
        </h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h4 className="font-medium text-gray-700">
            {monthNames[currentMonth]} {currentYear}
          </h4>
          <button 
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 border-b">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2 border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* 日历网格 */}
      <div className="grid grid-cols-7">
        {renderCalendarDays()}
      </div>

      {/* 即将到来的截止日期 */}
      <div className="p-4 border-t">
        <h4 className="font-medium text-gray-800 mb-3">Coming Up This Week</h4>
        {getUpcomingDeadlines().length === 0 ? (
          <p className="text-sm text-gray-500">No deadlines in the next 7 days</p>
        ) : (
          <div className="space-y-2">
            {getUpcomingDeadlines().map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm font-medium mr-3">
                    {new Date(deadline.date).getDate()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{deadline.universityName}</p>
                    <p className="text-xs text-gray-500">{deadline.type}</p>
                  </div>
                </div>
                <StatusBadge status={deadline.status} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeadlineCalendar;