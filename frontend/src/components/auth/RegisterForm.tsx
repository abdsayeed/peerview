import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { validateEmail, validatePassword } from '../../utils/validation';
import type { AxiosError } from 'axios';

const AVAILABLE_MODULES = [
  'COM101',
  'COM205',
  'COM301',
  'COM405',
  'COM501',
  'COM682',
];

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
    modules?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const toggleModule = (module: string) => {
    setSelectedModules((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module]
    );
  };

  const validate = (): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
      name?: string;
      modules?: string;
    } = {};

    if (!name) {
      newErrors.name = 'Name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.message;
      }
    }

    if (role === 'student' && selectedModules.length === 0) {
      newErrors.modules = 'Please select at least one module';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({ 
        email, 
        password, 
        name, 
        role,
        modules: role === 'student' ? selectedModules : undefined
      });
      showToast('success', 'Registration successful! Redirecting to login...');
      // Redirect to login page for email verification flow
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      showToast('error', err.response?.data?.error || 'Registration failed. Please try again.');
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
          <h1 className="text-[15px] font-medium text-black dark:text-white">Create account</h1>
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
              Fill in your details to join
            </p>
          </div>

          {/* Register Form */}
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
                error={errors.name}
              />
            </div>

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
                placeholder="Create a password"
                autoComplete="new-password"
                error={errors.password}
                helperText={!errors.password ? "At least 8 characters with uppercase, lowercase, and number" : undefined}
              />
            </div>

            <Select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
              options={[
                { value: 'student', label: 'Student' },
                { value: 'teacher', label: 'Teacher' },
              ]}
            />

            {/* Modules selector - only for students */}
            {role === 'student' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Select Modules
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_MODULES.map((module) => (
                    <button
                      key={module}
                      type="button"
                      onClick={() => toggleModule(module)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        selectedModules.includes(module)
                          ? 'bg-[#2AABEE] text-white border-[#2AABEE]'
                          : 'bg-white dark:bg-[#2f2f2f] text-[#707579] dark:text-[#aaaaaa] border-[#e7e7e7] dark:border-[#2f2f2f] hover:border-[#2AABEE]'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedModules.includes(module)
                            ? 'bg-white border-white'
                            : 'border-current'
                        }`}>
                          {selectedModules.includes(module) && (
                            <svg className="w-3 h-3 text-[#2AABEE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        {module}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.modules && (
                  <p className="text-xs text-accent-500 mt-1.5 ml-1 flex items-center gap-1">
                    <span>•</span> {errors.modules}
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              size="sm"
              className="tg-button-primary !mt-3"
            >
              {isLoading ? 'Creating account...' : 'Register'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="pt-1 border-t border-[#e7e7e7] dark:border-[#2f2f2f] mt-2">
            <div className="flex items-center justify-center gap-1 text-[13px]">
              <span className="text-[#707579] dark:text-[#aaaaaa]">
                Already have an account?
              </span>
              <Link
                to="/login"
                className="text-[#2AABEE] hover:underline text-[13px] font-medium transition-all"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

