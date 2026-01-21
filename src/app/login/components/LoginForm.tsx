'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { apiClient } from '@/lib/apiClient';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.login(email, password);
      
      if (isHydrated && typeof window !== 'undefined') {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        }
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      router.push('/main-dashboard');
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.error?.message || 'Invalid email or password. Please check your credentials and try again.',
      });
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      if (isHydrated && typeof window !== 'undefined') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', `user@${provider.toLowerCase()}.com`);
      }
      router.push('/main-dashboard');
    }, 1000);
  };

  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      const rememberedEmail = localStorage.getItem('rememberedEmail');
      if (rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberMe(true);
      }
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-card rounded-xl border border-border shadow-brand-lg">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
          <div className="space-y-4">
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-card rounded-xl border border-border shadow-brand-lg">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary shadow-brand">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
            >
              <path
                d="M3 8L12 3L21 8V16L12 21L3 16V8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              />
              <path
                d="M12 3V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-primary-foreground"
              />
              <path
                d="M3 8L21 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-primary-foreground"
              />
              <path
                d="M21 8L3 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-primary-foreground"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-heading font-semibold text-foreground mb-2">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access your CloudDrive account
        </p>
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-3">
          <Icon name="ExclamationTriangleIcon" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Icon name="EnvelopeIcon" size={18} className="text-muted-foreground" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder="user@clouddrive.com"
              className={`w-full pl-10 pr-4 py-3 bg-muted border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-smooth ${
                errors.email ? 'border-destructive' : 'border-border'
              }`}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={14} />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Icon name="LockClosedIcon" size={18} className="text-muted-foreground" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              placeholder="Enter your password"
              className={`w-full pl-10 pr-12 py-3 bg-muted border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-smooth ${
                errors.password ? 'border-destructive' : 'border-border'
              }`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-background rounded transition-smooth"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon
                name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'}
                size={18}
                className="text-muted-foreground"
              />
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={14} />
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-smooth"
              disabled={isLoading}
            />
            <span className="text-sm text-foreground">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-sm text-primary hover:text-primary/80 transition-smooth"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:shadow-brand-lg active:scale-[0.98] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleOAuthLogin('Google')}
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-3 bg-muted border border-border rounded-md hover:bg-muted/80 hover:shadow-brand active:scale-[0.98] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Sign in with Google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('Microsoft')}
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-3 bg-muted border border-border rounded-md hover:bg-muted/80 hover:shadow-brand active:scale-[0.98] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Sign in with Microsoft"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#F25022" d="M1 1h10v10H1z" />
              <path fill="#00A4EF" d="M13 1h10v10H13z" />
              <path fill="#7FBA00" d="M1 13h10v10H1z" />
              <path fill="#FFB900" d="M13 13h10v10H13z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('Apple')}
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-3 bg-muted border border-border rounded-md hover:bg-muted/80 hover:shadow-brand active:scale-[0.98] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Sign in with Apple"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="text-primary hover:text-primary/80 font-medium transition-smooth"
            disabled={isLoading}
          >
            Create Account
          </button>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Icon name="ShieldCheckIcon" size={16} className="text-success" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="LockClosedIcon" size={16} className="text-success" />
            <span>256-bit Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;