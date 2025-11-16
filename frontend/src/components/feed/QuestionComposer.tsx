import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { FileUpload } from '../common/FileUpload';
import type { CreateQuestionData } from '../../types';

interface QuestionComposerProps {
  onSubmit: (data: CreateQuestionData) => Promise<void>;
  isLoading?: boolean;
}

const modules = [
  { value: '', label: 'Select a module' },
  { value: 'COM101', label: 'COM101 - Introduction to Computing' },
  { value: 'COM205', label: 'COM205 - Data Structures' },
  { value: 'COM301', label: 'COM301 - Web Development' },
  { value: 'COM405', label: 'COM405 - Database Systems' },
  { value: 'COM501', label: 'COM501 - Cloud Computing' },
  { value: 'COM682', label: 'COM682 - Advanced Cloud Topics' },
];

export const QuestionComposer: React.FC<QuestionComposerProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [module, setModule] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ title?: string; description?: string; module?: string }>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const validate = (): boolean => {
    const newErrors: { title?: string; description?: string; module?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!module) {
      newErrors.module = 'Please select a module';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const questionData: CreateQuestionData = {
      title,
      description,
      module,
      media: media || undefined,
    };

    await onSubmit(questionData);

    // Reset form
    setTitle('');
    setDescription('');
    setModule('');
    setMedia(null);
    setIsExpanded(false);
  };

  return (
    <div className="px-4 py-3 transition-all duration-300 ease-in-out">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f4f4f5] dark:hover:bg-[#2f2f2f] transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-[#2AABEE] flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <p className="text-[15px] text-[#707579] dark:text-[#aaaaaa]">
            Ask a question...
          </p>
        </button>
      ) : (
        <div className="space-y-3 animate-fade-in">
          <Input
            label="Question Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            placeholder="What would you like to know?"
          />
          <TextArea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            placeholder="Provide more details..."
            rows={4}
          />
          <Select
            label="Module"
            value={module}
            onChange={(e) => setModule(e.target.value)}
            error={errors.module}
            options={modules}
          />
          <div>
            <label className="block text-[13px] font-normal text-[#707579] dark:text-[#aaaaaa] mb-2">
              Attach Media (Optional)
            </label>
            <FileUpload onFileSelect={setMedia} />
            {media && (
              <div className="mt-2 p-2 bg-[#e4e9ec] dark:bg-[#2f2f2f] rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-[#2AABEE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span className="text-[13px] text-black dark:text-white flex-1 truncate">
                  {media.name}
                </span>
                <button
                  type="button"
                  onClick={() => setMedia(null)}
                  className="p-1 text-[#707579] dark:text-[#aaaaaa] hover:text-black dark:hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-end pt-2 border-t border-[#e7e7e7] dark:border-[#2f2f2f]">
            <Button
              variant="ghost"
              onClick={() => {
                setIsExpanded(false);
                setTitle('');
                setDescription('');
                setModule('');
                setMedia(null);
                setErrors({});
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              isLoading={isLoading}
              disabled={!title.trim() || !description.trim() || !module || isLoading}
            >
              {isLoading ? 'Posting...' : 'Post Question'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
