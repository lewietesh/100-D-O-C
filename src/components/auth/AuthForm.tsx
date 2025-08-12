// components/auth/AuthForm.tsx
'use client';

import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { PasswordInput } from './PasswordInput';
import { GoogleAuthButton } from './GoogleAuthButton';
import { useForm } from '@/hooks/useForm';
import { validateAuthForm, validateResetEmail } from '@/lib/validation';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/logger';
import type { AuthMode } from '@/types/auth';

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

export function AuthForm({ mode, onModeChange, onSuccess }: AuthFormProps) {
          const { login, register, resetPassword, googleAuth, clearError } = useAuth();
          const [successMessage, setSuccessMessage] = useState<string | null>(null);
          const [errorMessage, setErrorMessage] = useState<string | null>(null);

          const getInitialValues = (): AuthFormValues => {
                    switch (mode) {
                              case 'login':
                                        return { email: '', password: '' };
                              case 'register':
                                        return { email: '', password: '', confirmPassword: '' };
                              case 'reset-password':
                                        return { email: '' };
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
                    }
          };

          const handleSubmit = async (values: AuthFormValues) => {
                    try {
                              setErrorMessage(null);
                              setSuccessMessage(null);
                              clearError();

                              switch (mode) {
                                        case 'login': {
                                                  const { email, password } = values as LoginFormValues;
                                                  await login(email, password);
                                                  setSuccessMessage('Successfully logged in!');
                                                  onSuccess?.();
                                                  break;
                                        }
                                        case 'register': {
                                                  const { email, password } = values as RegisterFormValues;
                                                  await register(email, password);
                                                  setSuccessMessage('Registration successful! Please check your email to verify your account.');
                                                  break;
                                        }
                                        case 'reset-password': {
                                                  const { email } = values as ResetFormValues;
                                                  await resetPassword(email);
                                                  setSuccessMessage('Password reset email sent! Please check your inbox.');
                                                  break;
                                        }
                              }
                    } catch (error: any) {
                              logger.error(`${mode} failed:`, error);
                              setErrorMessage(error.message || 'An error occurred. Please try again.');
                    }
          };

          const handleGoogleSuccess = async (accessToken: string) => {
                    try {
                              setErrorMessage(null);
                              clearError();

                              await googleAuth(accessToken);
                              setSuccessMessage('Successfully authenticated with Google!');
                              onSuccess?.();
                    } catch (error: any) {
                              logger.error('Google auth failed:', error);
                              setErrorMessage(error.message || 'Google authentication failed. Please try again.');
                    }
          };

          const handleGoogleError = (error: string) => {
                    setErrorMessage(error);
          };

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

          return (
                    <div className="w-full max-w-md mx-auto p-6 sm:p-8">
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
                                                            value={(values as RegisterFormValues).confirmPassword}
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
          );
}