import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from './Button';

interface DropdownItem {
  label: string;
  value?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

interface DropdownProps {
  /** 下拉选项列表 */
  items: DropdownItem[];
  /** 选中值变化时的回调 */
  onSelect?: (value: string) => void;
  /** 默认选中值 */
  defaultValue?: string;
  /** 触发下拉的按钮内容 */
  trigger?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 是否禁用 */
  disabled?: boolean;
  children?: ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  onSelect,
  defaultValue,
  trigger,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 处理选项选择
  const handleSelect = (item: DropdownItem) => {
    setSelectedValue(item.value);
    setIsOpen(false);
    if (item.onClick) {
      item.onClick();
    }
    if (onSelect) {
      onSelect(item.value??'');
    }
  };

  // 获取当前选中项
  const getSelectedItem = () => {
    return items.find(item => item.value === selectedValue) || items[0];
  };

  // 触发按钮内容
  const renderTrigger = () => {
    if (trigger) {
      return trigger;
    }

    const selectedItem = getSelectedItem();
    return (
      <Button 
        variant="outline" 
        size="sm"
        className="w-full justify-between"
        disabled={disabled}
      >
        {selectedItem.icon}
        <span>{selectedItem.label}</span>
        {isOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
      </Button>
    );
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* 触发按钮 */}
      {/* <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="w-full"
        aria-expanded={isOpen}
      > */}
        {renderTrigger()}
      {/* </button> */}

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border overflow-hidden">
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
