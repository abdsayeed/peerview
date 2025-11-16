import React from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/helpers';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, onClick }) => {
  return (
    <div
      className={cn(
        'tg-card',
        'transition-colors duration-150',
        hover && 'cursor-pointer',
        onClick && 'active:scale-[0.99]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'px-4 py-3 border-b border-[#e7e7e7] dark:border-[#2f2f2f]',
        'bg-white dark:bg-[#212121]',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'px-4 py-3',
        'bg-white dark:bg-[#212121]',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'px-4 py-3 border-t border-[#e7e7e7] dark:border-[#2f2f2f]',
        'bg-white dark:bg-[#212121]',
        className
      )}
    >
      {children}
    </div>
  );
};
