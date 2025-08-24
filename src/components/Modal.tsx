import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  /** 是否显示模态框 */
  isOpen: boolean;
  /** 关闭模态框的回调 */
  onClose: () => void;
  /** 模态框标题 */
  title?: ReactNode;
  /** 模态框内容 */
  children: ReactNode;
  /** 模态框尺寸 */
  size?: ModalSize;
  /** 底部操作按钮 */
  footer?: ReactNode;
  /** 是否点击外部关闭 */
  closeOnOutsideClick?: boolean;
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean;
  /** 自定义类名 */
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  closeOnOutsideClick = true,
  showCloseButton = true,
  className = ''
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // 处理模态框显示/隐藏的动画
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      // 阻止背景滚动
      document.body.style.overflow = 'hidden';
    } else {
      // 等待动画结束后卸载
      const timer = setTimeout(() => {
        setIsMounted(false);
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnOutsideClick &&
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, closeOnOutsideClick]);

  // 按ESC键关闭
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 尺寸样式
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    full: 'max-w-5xl w-full h-[90vh]'
  };

  // 如果未挂载且未打开，则不渲染
  if (!isMounted && !isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className={`
          fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={closeOnOutsideClick ? onClose : undefined}
      ></div>

      {/* 模态框内容 */}
      <div 
        className={`
          fixed inset-0 z-50 flex items-center justify-center p-4
          transition-all duration-300 ease-in-out
          ${isOpen 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        <div 
          ref={modalRef}
          className={`
            bg-white rounded-lg shadow-xl overflow-hidden w-full
            ${sizeStyles[size]} ${className}
            ${size === 'full' ? 'flex flex-col' : ''}
          `}
        >
          {/* 标题栏 */}
          {title && (
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div className="font-semibold text-lg text-gray-900">
                {title}
              </div>
              {showCloseButton && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose}
                  className="h-8 w-8 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* 内容区域 */}
          <div className={size === 'full' ? 'flex-1 overflow-y-auto' : 'p-6'}>
            {children}
          </div>

          {/* 底部按钮区域 */}
          {footer && (
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
