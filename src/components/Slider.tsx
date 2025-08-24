import React, { useState, useEffect, useRef } from 'react';

interface SliderProps {
  /** 最小值 */
  min: number;
  /** 最大值 */
  max: number;
  /** 步长 */
  step: number;
  /** 当前值（单值或范围） */
  value: number | [number, number];
  /** 值变化回调 */
  onValueChange: (value: number | [number, number]) => void;
  /** 自定义类名 */
  className?: string;
  /** 是否为范围滑块（双滑块） */
  isRange?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onValueChange,
  className = '',
  isRange = false
}) => {
  const [localValue, setLocalValue] = useState<number | [number, number]>(value);
  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState<0 | 1 | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // 当外部值变化时同步到本地状态
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // 计算滑块位置百分比
  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  // 从百分比计算值
  const getValueFromPercentage = (percentage: number) => {
    let value = (percentage / 100) * (max - min) + min;
    // 按步长取整
    value = Math.round(value / step) * step;
    // 限制在范围内
    return Math.max(min, Math.min(max, value));
  };

  // 处理鼠标/触摸开始
  const handleStart = (index: 0 | 1 | null = null, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    setIsDragging(true);
    setActiveHandle(index);
    
    // 初始位置计算 - 正确处理事件类型
    if (event.type.startsWith('touch')) {
      const touchEvent = event as React.TouchEvent;
      handleTouchMove(touchEvent);
    } else {
      const mouseEvent = event as React.MouseEvent;
      handleMouseMove(mouseEvent);
    }
    
    // 添加全局事件监听
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
  };

  // 处理鼠标移动
  const handleMouseMove = (event: MouseEvent | React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const clientX = 'clientX' in event ? event.clientX : 0;
    handlePositionChange(clientX);
  };

  // 处理触摸移动
  const handleTouchMove = (event: TouchEvent | React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    
    // 正确获取触摸事件的原生事件和坐标
    const touch = event instanceof TouchEvent 
      ? event.touches[0]
      : event.nativeEvent.touches[0];
      
    if (touch) {
      handlePositionChange(touch.clientX);
    }
  };

  // 处理位置变化
  const handlePositionChange = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    const newValue = getValueFromPercentage(percentage);

    if (isRange) {
      const [start, end] = localValue as [number, number];
      let newRange: [number, number];
      
      if (activeHandle === 0) {
        // 确保开始值不超过结束值
        newRange = [Math.min(newValue, end), end];
      } else {
        // 确保结束值不小于开始值
        newRange = [start, Math.max(start, newValue)];
      }
      
      setLocalValue(newRange);
      onValueChange(newRange);
    } else {
      setLocalValue(newValue);
      onValueChange(newValue);
    }
  };

  // 处理拖动结束
  const handleEnd = () => {
    setIsDragging(false);
    setActiveHandle(null);
    
    // 移除全局事件监听
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('mouseup', handleEnd);
    window.removeEventListener('touchend', handleEnd);
  };

  // 渲染单滑块
  const renderSingleSlider = () => {
    const value = localValue as number;
    const percentage = getPercentage(value);
    
    return (
      <>
        <div 
          className="absolute h-2 bg-blue-200 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
        <div
          className="absolute w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md cursor-pointer transform -translate-y-1/4 transition-transform active:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          style={{ left: `${percentage}%` }}
          onMouseDown={(e) => handleStart(null, e)}
          onTouchStart={(e) => handleStart(null, e)}
          tabIndex={0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={value.toString()}
        ></div>
      </>
    );
  };

  // 渲染范围滑块（双滑块）
  const renderRangeSlider = () => {
    const [start, end] = localValue as [number, number];
    const startPercentage = getPercentage(start);
    const endPercentage = getPercentage(end);
    const rangePercentage = endPercentage - startPercentage;
    
    return (
      <>
        {/* 背景轨道 */}
        <div 
          className="absolute h-2 bg-gray-200 rounded-full"
        ></div>
        
        {/* 选中范围 */}
        <div 
          className="absolute h-2 bg-blue-200 rounded-full"
          style={{ 
            left: `${startPercentage}%`,
            width: `${rangePercentage}%`
          }}
        ></div>
        
        {/* 开始滑块 */}
        <div
          className="absolute w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md cursor-pointer transform -translate-y-1/4 transition-transform active:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          style={{ left: `${startPercentage}%` }}
          onMouseDown={(e) => handleStart(0, e)}
          onTouchStart={(e) => handleStart(0, e)}
          tabIndex={0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={start}
          aria-valuetext={start.toString()}
        ></div>
        
        {/* 结束滑块 */}
        <div
          className="absolute w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md cursor-pointer transform -translate-y-1/4 transition-transform active:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          style={{ left: `${endPercentage}%` }}
          onMouseDown={(e) => handleStart(1, e)}
          onTouchStart={(e) => handleStart(1, e)}
          tabIndex={0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={end}
          aria-valuetext={end.toString()}
        ></div>
      </>
    );
  };

  return (
    <div className={`relative h-6 ${className}`} ref={sliderRef}>
      {isRange ? renderRangeSlider() : renderSingleSlider()}
    </div>
  );
};

export default Slider;
