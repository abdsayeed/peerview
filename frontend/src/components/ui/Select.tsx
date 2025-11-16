import React, { useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/helpers';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className,
  id,
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[13px] font-normal text-[#707579] dark:text-[#aaaaaa] mb-2"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full px-3 py-2.5 bg-white dark:bg-[#212121] border border-[#e7e7e7] dark:border-[#2f2f2f] rounded-md text-[14px] text-black dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2AABEE]/20 focus:border-[#2AABEE] cursor-pointer',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-white dark:bg-[#212121] text-black dark:text-white">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
