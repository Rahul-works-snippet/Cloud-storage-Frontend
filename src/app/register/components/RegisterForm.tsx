'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { apiClient } from '@/lib/apiClient';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const RegisterForm = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: '',
    color: '',
  });
  const [captchaVerified, setCaptchaVerified] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (formData.password) {
      calculatePasswordStrength(formData.password);
    } else {
      setPasswordStrength({ score: 0, label: '', color: '' });
    }
  }, [formData.password]);

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strengthMap: Record<number, PasswordStrength> = {
      0: { score: 0, label: '', color: '' },
      1: { score: 1, label: 'Weak', color: 'bg-destructive' },
      2: { score: 2, label: 'Fair', color: 'bg-warning' },
      3: { score: 3, label: 'Good', color: 'bg-accent' },
      4: { score: 4, label: 'Strong', color: 'bg-success' },
      5: { score: 5, label: 'Very Strong', color: 'bg-success' },
    };

    setPasswordStrength(strengthMap[score] || strengthMap[0]);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Please choose a stronger password';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    if (!captchaVerified) {
      newErrors.general = 'Please verify that you are not a robot';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await apiClient.register(formData.email, formData.password, formData.fullName);
      
      if (isHydrated && typeof window !== 'undefined') {
        localStorage.setItem('registeredEmail', formData.email);
      }
      
      router.push('/login?registered=true');
    } catch (error: any) {
      setErrors({ 
        general: error.response?.data?.error?.message || 'Registration failed. Please try again.' 
      });
      setIsSubmitting(false);
    }
  };

  const handleOAuthRegister = (provider: 'google' | 'microsoft') => {
    console.log(`Registering with ${provider}`);
  };

  const handleCaptchaVerify = () => {
    setCaptchaVerified(true);
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  if (!isHydrated) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-xl shadow-brand-lg border border-border p-8">
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="space-y-4">
              <div className="h-12 bg-muted rounded animate-pulse" />
              <div className="h-12 bg-muted rounded animate-pulse" />
              <div className="h-12 bg-muted rounded animate-pulse" />
              <div className="h-12 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-xl shadow-brand-lg border border-border p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-semibold text-foreground mb-2">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join CloudDrive and start storing your files securely
          </p>
        </div>

        {/* OAuth Options */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthRegister('google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-background border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-smooth"
          >
            <Icon name="GlobeAltIcon" size={20} className="text-muted-foreground" />
            <span>Continue with Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleOAuthRegister('microsoft')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-background border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-smooth"
          >
            <Icon name="WindowIcon" size={20} className="text-muted-foreground" />
            <span>Continue with Microsoft</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-card text-muted-foreground">Or register with email</span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* General Error */}
          {errors.general && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <Icon name="ExclamationTriangleIcon" size={18} className="text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              className={`w-full px-4 py-3 bg-muted border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                errors.fullName ? 'border-destructive' : 'border-border'
              }`}
            />
            {errors.fullName && (
              <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={14} />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 bg-muted border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                errors.email ? 'border-destructive' : 'border-border'
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={14} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Create a strong password"
                className={`w-full px-4 py-3 pr-12 bg-muted border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors.password ? 'border-destructive' : 'border-border'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-smooth"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={18} />
              </button>
            </div>
            {formData.password && passwordStrength.score > 0 && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-smooth`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="caption text-muted-foreground">{passwordStrength.label}</span>
                </div>
              </div>
            )}
            {errors.password && (
              <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={14} />
                {errors.password}
              </p>
            )}
            <p className="mt-1.5 caption text-muted-foreground">
              Use 8+ characters with a mix of letters, numbers &amp; symbols
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Re-enter your password"
                className={`w-full px-4 py-3 pr-12 bg-muted border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors.confirmPassword ? 'border-destructive' : 'border-border'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-smooth"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                <Icon name={showConfirmPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={18} />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={14} />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* CAPTCHA */}
          <div className="flex items-center justify-center p-4 bg-muted border border-border rounded-md">
            {!captchaVerified ? (
              <button
                type="button"
                onClick={handleCaptchaVerify}
                className="flex items-center gap-3 px-4 py-2 bg-background border border-border rounded-md text-sm font-medium text-foreground hover:bg-card transition-smooth"
              >
                <div className="w-5 h-5 border-2 border-muted-foreground rounded" />
                <span>I'm not a robot</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-success">
                <Icon name="CheckCircleIcon" size={20} />
                <span className="text-sm font-medium">Verified</span>
              </div>
            )}
          </div>

          {/* Terms Agreement */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-smooth">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={14} />
                {errors.agreeToTerms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:shadow-brand-lg active:scale-[0.98] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <a href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 text-center">
        <p className="caption text-muted-foreground">
          Protected by industry-standard encryption and security measures
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;