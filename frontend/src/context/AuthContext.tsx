import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../services/api';
import { decodeToken, isTokenExpired, getTokenFromStorage, setTokenInStorage, removeTokenFromStorage } from '../utils/auth';
import type { User, LoginCredentials, RegisterData } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const initializeAuth = () => {
      const storedToken = getTokenFromStorage();
      if (storedToken && !isTokenExpired(storedToken)) {
        const decoded = decodeToken(storedToken);
        if (decoded) {
          setToken(storedToken);
          setUser({
            user_id: decoded.user_id,
            email: decoded.email,
            name: decoded.email.split('@')[0], // Fallback name
            role: decoded.role,
            created_at: '',
          });
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    setTokenInStorage(response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const register = async (data: RegisterData) => {
    const response = await authApi.register(data);
    setTokenInStorage(response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    removeTokenFromStorage();
    setToken(null);
    setUser(null);
    authApi.logout();
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
