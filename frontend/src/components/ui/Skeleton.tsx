import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
  const baseStyles = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };

  return <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} />;
};

export const PostSkeleton: React.FC = () => {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <Skeleton variant="circular" className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-32" />
          <Skeleton variant="text" className="w-20" />
        </div>
      </div>
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="rectangular" className="h-40 w-full" />
      <div className="flex space-x-4">
        <Skeleton variant="text" className="w-20" />
        <Skeleton variant="text" className="w-20" />
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <Skeleton variant="circular" className="h-12 w-12" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-32" />
        <Skeleton variant="text" className="w-24" />
      </div>
    </div>
  );
};
