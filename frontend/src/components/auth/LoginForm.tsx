import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { validateEmail } from '../../utils/validation';
import type { AxiosError } from 'axios';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      // Role-based redirect
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'teacher') {
        navigate('/teacher', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await login({ email, password });
      showToast('success', 'Login successful!');
      // Navigation handled by useEffect hook based on role
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      showToast('error', err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e4e9ec] dark:bg-[#0e0e0e] px-4">
      <div className="w-full max-w-sm bg-white dark:bg-[#212121] border border-[#e7e7e7] dark:border-[#2f2f2f]">
        {/* Top bar */}
        <div className="px-4 py-3 border-b border-[#e7e7e7] dark:border-[#2f2f2f] flex items-center justify-between">
          <div className="w-5 h-5" />
          <h1 className="text-[15px] font-medium text-black dark:text-white">Sign in</h1>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[#707579] dark:text-[#aaaaaa] text-xs hover:text-black dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-4 space-y-4">
          <div className="space-y-1">
            <p className="text-[13px] text-[#707579] dark:text-[#aaaaaa]">
              Enter your details to continue
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                autoComplete="email"
                error={errors.email}
              />
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                error={errors.password}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              size="sm"
              className="tg-button-primary !mt-3"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          {/* Register Link */}
          <div className="pt-1 border-t border-[#e7e7e7] dark:border-[#2f2f2f] mt-2">
            <div className="flex items-center justify-center gap-1 text-[13px]">
              <span className="text-[#707579] dark:text-[#aaaaaa]">
                Don&apos;t have an account?
              </span>
              <Link
                to="/register"
                className="text-[#2AABEE] hover:underline text-[13px] font-medium transition-all"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

