import React, { useState } from 'react';
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
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

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
      navigate('/');
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      showToast('error', err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-[340px] space-y-5">
        {/* Header */}
        <div className="text-center space-y-0.5">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            PeerView
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Login to your account
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-2.5" onSubmit={handleSubmit}>
          <div>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-xs text-accent-500 mt-1.5 ml-1 flex items-center gap-1">
                <span>❗</span> {errors.email}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-xs text-accent-500 mt-1.5 ml-1 flex items-center gap-1">
                <span>❗</span> {errors.password}
              </p>
            )}
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
        <div className="text-center pt-1">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Don't have an account?{' '}
          </span>
          <Link
            to="/register"
            className="text-sm font-medium text-[#2AABEE] hover:underline transition-all"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
