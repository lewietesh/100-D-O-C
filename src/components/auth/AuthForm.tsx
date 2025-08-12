// components/auth/AuthForm.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/app/context/ToastContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { PasswordInput } from './PasswordInput';
import { GoogleAuthButton } from './GoogleAuthButton';
import { VerificationCodeInput } from './VerificationCodeInput';
import { useForm } from '@/hooks/useForm';
import { validateAuthForm, validateResetEmail } from '@/lib/validation';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/logger';
import type { AuthMode } from '@/types/auth';

// ========================================
// TYPE DEFINITIONS
// ========================================

type LoginFormValues = {
  email: string;
  password: string;
};

type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

type ResetFormValues = {
  email: string;
};

type AuthFormValues = LoginFormValues | RegisterFormValues | ResetFormValues;

interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSuccess?: () => void;
}

// ========================================
// MAIN COMPONENT
// ========================================

export function AuthForm({ mode, onModeChange, onSuccess }: AuthFormProps) {
  // ========================================
  // ALL HOOKS MUST BE CALLED HERE, INSIDE THE COMPONENT
  // ========================================
  
  const { showToast } = useToast();
  const { login, register, resetPassword, googleAuth, verifyEmail, clearError, isAuthenticated, error } = useAuth();
  
  // State hooks
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerifyLater, setShowVerifyLater] = useState(false);
  const [verifyLaterToken, setVerifyLaterToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  const getInitialValues = (): AuthFormValues => {
    switch (mode) {
      case 'login':
        return { email: '', password: '' };
      case 'register':
        return { email: '', password: '', confirmPassword: '' };
      case 'reset-password':
        return { email: '' };
      default:
        return { email: '', password: '', confirmPassword: '' };
    }
  };

  const validateForm = (values: AuthFormValues): Record<string, string> => {
    switch (mode) {
      case 'reset-password': {
        const emailError = validateResetEmail((values as ResetFormValues).email);
        return emailError ? { email: emailError } : {};
      }
      case 'login':
        return validateAuthForm(values as LoginFormValues);
      case 'register':
        return validateAuthForm(values as RegisterFormValues);
      default:
        return {};
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Sign In';
      case 'register':
        return 'Create Account';
      case 'reset-password':
        return 'Reset Password';
    }
  };

  const getSubmitText = () => {
    switch (mode) {
      case 'login':
        return 'Sign In';
      case 'register':
        return 'Create Account';
      case 'reset-password':
        return 'Send Reset Email';
    }
  };

  // ========================================
  // EVENT HANDLERS
  // ========================================

  const handleSubmit = async (values: AuthFormValues) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      clearError();

      switch (mode) {
        case 'login': {
          const { email, password } = values as LoginFormValues;
          await login(email, password);
          
          // Check authentication status after login attempt
          if (isAuthenticated) {
            setSuccessMessage('Successfully logged in!');
            showToast('Successfully logged in!', 'success');
            onSuccess?.();
          } else if (error) {
            setErrorMessage(error);
            showToast(error, 'error');
          }
          break;
        }

        case 'register': {
          const { email, password, confirmPassword } = values as RegisterFormValues;
          await register({ email, password, password_confirm: confirmPassword });
          
          setSuccessMessage('Registration successful! Please check your email to verify your account.');
          showToast('Registration successful! Please check your email to verify your account.', 'success');
          setVerificationEmail(email);
          setShowVerification(true);
          break;
        }

        case 'reset-password': {
          const { email } = values as ResetFormValues;
          await resetPassword(email);
          
          setSuccessMessage('Password reset email sent! Please check your inbox.');
          showToast('Password reset email sent! Please check your inbox.', 'info');
          break;
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred. Please try again.';
      setErrorMessage(errorMessage);
      showToast(errorMessage, 'error');
      logger.error(`${mode} failed:`, error);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationEmail || !verificationCode) {
      setErrorMessage('Please enter both email and verification code.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await verifyEmail({ email: verificationEmail, code: verificationCode });
      
      setSuccessMessage('Email verified successfully! Redirecting...');
      showToast('Email verified successfully!', 'success');
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1200);
    } catch (error: any) {
      const errorMessage = error.message || 'Verification failed. Please try again.';
      setErrorMessage(errorMessage);
      showToast(errorMessage, 'error');
      logger.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoogleSuccess = async (accessToken: string) => {
    try {
      setErrorMessage(null);
      clearError();

      await googleAuth(accessToken);
      setSuccessMessage('Successfully authenticated with Google!');
      showToast('Successfully authenticated with Google!', 'success');
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error.message || 'Google authentication failed. Please try again.';
      setErrorMessage(errorMessage);
      showToast(errorMessage, 'error');
      logger.error('Google auth failed:', error);
    }
  };

  const handleGoogleError = (error: string) => {
    setErrorMessage(error);
    showToast(error, 'error');
  };

  const handleVerifyLater = async () => {
    if (!verifyLaterToken || !verificationEmail) {
      showToast('Missing verification data. Please try again.', 'error');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/accounts/auth/verify-later/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${verifyLaterToken}`
        },
        body: JSON.stringify({ email: verificationEmail })
      });

      const data = await response.json();
      
      if (response.ok) {
        showToast('Verification skipped. You can verify later from your profile.', 'success');
        setShowVerifyLater(false);
        setShowVerification(false);
        onSuccess?.();
      } else {
        showToast(data.message || 'Failed to skip verification.', 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
      logger.error('Verify later failed:', error);
    }
  };

  // ========================================
  // FORM HOOK
  // ========================================

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit: onSubmit
  } = useForm({
    initialValues: getInitialValues(),
    validate: validateForm,
    onSubmit: handleSubmit,
  });

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8">
      {showVerification ? (
        <div>
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Enter the verification code sent to your email address.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4 sm:space-y-6">
            <Input
              type="email"
              label="Email Address"
              value={verificationEmail}
              onChange={(e) => setVerificationEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isVerifying}
            />

            <VerificationCodeInput
              value={verificationCode}
              onChange={setVerificationCode}
              length={6}
              label="Verification Code"
              error={errorMessage}
            />

            <Button 
              type="submit" 
              className="w-full" 
              isLoading={isVerifying}
              disabled={isVerifying}
            >
              Verify Email
            </Button>

            {showVerifyLater && verifyLaterToken && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleVerifyLater}
                disabled={isVerifying}
              >
                Verify Later
              </Button>
            )}

            {successMessage && (
              <Alert variant="success" className="mt-4">
                {successMessage}
              </Alert>
            )}

            {errorMessage && (
              <Alert variant="error" className="mt-4">
                {errorMessage}
              </Alert>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowVerification(false)}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                disabled={isVerifying}
              >
                Back to registration
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {getTitle()}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {mode === 'login' && 'Welcome back! Please sign in to your account.'}
              {mode === 'register' && 'Get started by creating your account.'}
              {mode === 'reset-password' && 'Enter your email to reset your password.'}
            </p>
          </div>

          {successMessage && (
            <Alert variant="success" className="mb-4 sm:mb-6">
              {successMessage}
            </Alert>
          )}

          {errorMessage && (
            <Alert variant="error" className="mb-4 sm:mb-6">
              {errorMessage}
            </Alert>
          )}

          {mode !== 'reset-password' && (
            <>
              <GoogleAuthButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text={mode === 'register' ? 'signup' : 'signin'}
                disabled={isSubmitting}
              />

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or continue with email</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
              autoComplete="email"
            />

            {mode !== 'reset-password' && (
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={
                  mode === 'login'
                    ? (values as LoginFormValues).password
                    : (values as RegisterFormValues).password
                }
                onChange={(value) => handleChange('password' as keyof typeof values, value)}
                error={
                  mode === 'login'
                    ? (errors as Record<'email' | 'password', string>).password
                    : (errors as Record<'email' | 'password' | 'confirmPassword', string>).password
                }
                showStrengthIndicator={mode === 'register'}
                required
              />
            )}

            {mode === 'register' && (
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={(values as RegisterFormValues).confirmPassword ?? ''}
                onChange={(value) => handleChange('confirmPassword' as keyof typeof values, value)}
                error={(errors as Record<'email' | 'password' | 'confirmPassword', string>).confirmPassword}
                required
              />
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {getSubmitText()}
            </Button>
          </form>

          <div className="mt-6 sm:mt-8 text-center space-y-2">
            {mode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={() => onModeChange('reset-password')}
                  className="text-sm text-blue-600 hover:text-blue-500 underline"
                >
                  Forgot your password?
                </button>
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onModeChange('register')}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </>
            )}

            {mode === 'register' && (
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => onModeChange('login')}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}

            {mode === 'reset-password' && (
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => onModeChange('login')}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}