import React from 'react';
import { cn, getInitials } from '../../utils/helpers';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles = {
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-[42px] w-[42px] text-[15px]',
  lg: 'h-14 w-14 text-[17px]',
  xl: 'h-20 w-20 text-[20px]',
};

export const Avatar: React.FC<AvatarProps> = ({ name, imageUrl, size = 'md', className }) => {
  return (
    <div
      className={cn(
        'tg-avatar',
        sizeStyles[size],
        className
      )}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="rounded-full w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
