import config from './config';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
};

export const validateFileSize = (file: File): boolean => {
  return file.size <= config.maxFileSize;
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [...config.allowedImageTypes, ...config.allowedVideoTypes];
  return allowedTypes.includes(file.type);
};

export const getFileType = (file: File): 'image' | 'video' | 'unknown' => {
  if (config.allowedImageTypes.includes(file.type)) return 'image';
  if (config.allowedVideoTypes.includes(file.type)) return 'video';
  return 'unknown';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
