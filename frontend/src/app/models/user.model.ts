export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role?: 'student' | 'teacher';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AdminStats {
  totalUsers: number;
  totalQuestions: number;
  totalAnswers: number;
  answeredQuestions: number;
  pendingQuestions: number;
  recentQuestions: number;
  storageUsage: string;
  lastUpdated: string;
}

export interface ModerationRequest {
  targetType: 'question' | 'answer';
  targetId: string;
  action: 'remove' | 'flag';
}