import React, { InputHTMLAttributes, ChangeEvent } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  /** 复选框ID，用于关联label */
  id: string;
  /** 是否选中 */
  checked?: boolean;
  /** 状态变化回调 - 接收选中的布尔值 */
  onChange?: (checked: boolean) => void;
  /** 自定义类名 */
  className?: string;
  /** 是否禁用 */
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked = false,
  onChange,
  className = '',
  disabled = false,
  ...props
}) => {
  // 处理原生事件并转换为布尔值
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <label
        htmlFor={id}
        className={`
          inline-flex items-center justify-center w-5 h-5 rounded border cursor-pointer
          transition-colors ${className}
          ${checked 
            ? 'bg-blue-600 border-blue-600 text-white' 
            : 'bg-white border-gray-300 text-gray-800'}
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-gray-50'}
          ${checked && disabled ? 'bg-blue-400 border-blue-400' : ''}
        `}
      >
        {checked && <Check className="h-4 w-4" />}
      </label>
    </div>
  );
};

export default Checkbox;
