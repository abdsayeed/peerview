import React, { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { validateFileSize, validateFileType, getFileType, formatFileSize } from '../../utils/validation';
import { cn } from '../../utils/helpers';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  error?: string;
  preview?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = 'image/*,video/*',
  error,
  preview = true,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileError('');

    if (!validateFileType(file)) {
      setFileError('Invalid file type. Please upload an image or video.');
      return;
    }

    if (!validateFileSize(file)) {
      setFileError('File size exceeds 10MB limit.');
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    // Create preview for images
    if (preview && getFileType(file) === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (preview && getFileType(file) === 'video') {
      const videoUrl = URL.createObjectURL(file);
      setPreviewUrl(videoUrl);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileError('');
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayError = error || fileError;

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200',
            dragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400',
            displayError && 'border-red-500'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose file
            </Button>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            or drag and drop
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            Images or videos up to 10MB
          </p>
        </div>
      ) : (
        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4">
          {preview && previewUrl && (
            <div className="mb-4">
              {getFileType(selectedFile) === 'image' ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="max-h-64 mx-auto rounded-lg"
                />
              )}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      {displayError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{displayError}</p>
      )}
    </div>
  );
};
