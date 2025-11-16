import apiClient from './apiClient';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  Question,
  QuestionDetail,
  CreateQuestionData,
  Answer,
  CreateAnswerData,
  AdminStats,
  AdminUser,
} from '../types';

// Authentication API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/login', credentials);
    return response.data.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/register', data);
    return response.data.data;
  },

  logout: () => {
    localStorage.removeItem('peerview_token');
  },
};

// Student API
export const studentApi = {
  getQuestions: async (): Promise<Question[]> => {
    const response = await apiClient.get<{ questions: Question[] }>('/student/questions');
    return response.data.questions;
  },

  getQuestion: async (questionId: string): Promise<QuestionDetail> => {
    const response = await apiClient.get<{ question: QuestionDetail }>(`/student/question/${questionId}`);
    return response.data.question;
  },

  createQuestion: async (data: CreateQuestionData): Promise<Question> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('module', data.module);
    if (data.media) {
      formData.append('media', data.media);
    }

    const response = await apiClient.post<{ question: Question }>('/student/question', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.question;
  },

  searchQuestions: async (query: string, module?: string): Promise<Question[]> => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (module) params.append('module', module);
    
    const response = await apiClient.get<{ questions: Question[] }>(`/student/search?${params.toString()}`);
    return response.data.questions;
  },
};

// Teacher API
export const teacherApi = {
  getQuestions: async (): Promise<Question[]> => {
    const response = await apiClient.get<{ questions: Question[] }>('/teacher/questions');
    return response.data.questions;
  },

  getQuestion: async (questionId: string): Promise<QuestionDetail> => {
    const response = await apiClient.get<{ question: QuestionDetail }>(`/student/question/${questionId}`);
    return response.data.question;
  },

  answerQuestion: async (questionId: string, data: CreateAnswerData): Promise<Answer> => {
    const response = await apiClient.post<{ answer: Answer }>(
      `/teacher/answer/${questionId}`,
      data
    );
    return response.data.answer;
  },

  updateAnswer: async (answerId: string, data: CreateAnswerData): Promise<Answer> => {
    const response = await apiClient.put<{ answer: Answer }>(`/teacher/answer/${answerId}`, data);
    return response.data.answer;
  },

  deleteAnswer: async (answerId: string): Promise<void> => {
    await apiClient.delete(`/teacher/answer/${answerId}`);
  },
};

// Admin API
export const adminApi = {
  getAll: async () => {
    const response = await apiClient.get<{ 
      success: boolean; 
      data: { 
        questions: Question[]; 
        users: AdminUser[]; 
        stats: AdminStats 
      } 
    }>('/admin/all');
    return response.data.data;
  },

  getStats: async (): Promise<AdminStats> => {
    const data = await adminApi.getAll();
    return data.stats;
  },

  getAllUsers: async (): Promise<AdminUser[]> => {
    const data = await adminApi.getAll();
    return data.users;
  },

  getAllQuestions: async (): Promise<Question[]> => {
    const data = await adminApi.getAll();
    return data.questions;
  },

  deleteQuestion: async (questionId: string): Promise<void> => {
    await apiClient.delete(`/admin/question/${questionId}`);
  },

  createTeacher: async (data: { email: string; password: string; name: string }): Promise<AdminUser> => {
    const response = await apiClient.post<{ user: AdminUser }>('/admin/create-teacher', data);
    return response.data.user;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/admin/user/${userId}`);
  },
};

export default {
  auth: authApi,
  student: studentApi,
  teacher: teacherApi,
  admin: adminApi,
};
