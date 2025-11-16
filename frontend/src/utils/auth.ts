import { jwtDecode } from 'jwt-decode';
import type { JWTPayload } from '../types';

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const getTokenFromStorage = (): string | null => {
  return localStorage.getItem('peerview_token');
};

export const setTokenInStorage = (token: string): void => {
  localStorage.setItem('peerview_token', token);
};

export const removeTokenFromStorage = (): void => {
  localStorage.removeItem('peerview_token');
};

export const getUserFromToken = (token: string): { userId: string; email: string; role: string } | null => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    userId: decoded.user_id,
    email: decoded.email,
    role: decoded.role,
  };
};
