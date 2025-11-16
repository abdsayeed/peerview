import React from 'react';
import { cn } from '../../utils/helpers';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'student' | 'teacher' | 'admin' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: 'bg-[#e4e9ec] dark:bg-[#2f2f2f] text-[#707579] dark:text-[#aaaaaa]',
  student: 'bg-[#e8f4fd] dark:bg-[#2b5278] text-[#2481cc] dark:text-[#5ba0d0]',
  teacher: 'bg-[#fef3c7] dark:bg-[#854d0e] text-[#92400e] dark:text-[#fde047]',
  admin: 'bg-[#fee2e2] dark:bg-[#7f1d1d] text-[#991b1b] dark:text-[#fca5a5]',
  success: 'bg-[#d1fae5] dark:bg-[#064e3b] text-[#065f46] dark:text-[#6ee7b7]',
  warning: 'bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fde047]',
  danger: 'bg-[#fee2e2] dark:bg-[#7f1d1d] text-[#991b1b] dark:text-[#fca5a5]',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
