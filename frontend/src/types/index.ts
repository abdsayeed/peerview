// User Types
export interface User {
  user_id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher';
  modules?: string[];
}

// Question Types
export interface Question {
  question_id: string;
  student_id: string;
  student_name: string;
  title: string;
  description: string;
  module: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  created_at: string;
  answer_count?: number;
}

export interface QuestionDetail extends Question {
  answers: Answer[];
}

export interface CreateQuestionData {
  title: string;
  description: string;
  module: string;
  media?: File;
}

// Answer Types
export interface Answer {
  answer_id: string;
  question_id: string;
  teacher_id: string;
  teacher_name: string;
  answer_text: string;
  created_at: string;
}

export interface CreateAnswerData {
  answer_text: string;
}

// Admin Types
export interface AdminStats {
  totalQuestions: number;
  totalUsers: number;
  usersByRole: {
    students: number;
    teachers: number;
    admins: number;
  };
}

export interface AdminUser {
  user_id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// UI Types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

// JWT Payload
export interface JWTPayload {
  user_id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  exp: number;
}
