import React, { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/helpers';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-[13px] font-normal text-[#707579] dark:text-[#aaaaaa] mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'w-full px-3 py-2.5 bg-white dark:bg-[#212121] border border-[#e7e7e7] dark:border-[#2f2f2f] rounded-md text-[14px] text-black dark:text-white placeholder-[#707579] dark:placeholder-[#aaaaaa] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2AABEE]/20 focus:border-[#2AABEE] resize-y min-h-[100px]',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-[#707579] dark:text-[#aaaaaa]">{helperText}</p>
      )}
    </div>
  );
};
