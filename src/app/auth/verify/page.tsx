// app/auth/verify/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { VerificationCodeInput } from '@/components/auth/VerificationCodeInput';
import { useAuth } from '@/hooks/useAuth';
import { validateVerificationCode } from '@/lib/validation';

function VerifyEmailContent() {
          const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
          const [expiry, setExpiry] = useState<number>(Date.now() + 5 * 60 * 1000);
          const [timeLeft, setTimeLeft] = useState<number>(300);
          const [resendCooldown, setResendCooldown] = useState<number>(0);
          // Auto-focus code input
          useEffect(() => {
                    if (inputRef) inputRef.focus();
          }, [inputRef]);

          // Countdown timer for code expiry
          useEffect(() => {
                    const interval = setInterval(() => {
                              const left = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
                              setTimeLeft(left);
                              if (left === 0) clearInterval(interval);
                    }, 1000);
                    return () => clearInterval(interval);
          }, [expiry]);

          // Resend cooldown timer
          useEffect(() => {
                    if (resendCooldown > 0) {
                              const interval = setInterval(() => {
                                        setResendCooldown(cooldown => Math.max(0, cooldown - 1));
                              }, 1000);
                              return () => clearInterval(interval);
                    }
          }, [resendCooldown]);
          const [verificationCode, setVerificationCode] = useState('');
          const [isSubmitting, setIsSubmitting] = useState(false);
          const [successMessage, setSuccessMessage] = useState<string | null>(null);
          const [errorMessage, setErrorMessage] = useState<string | null>(null);

          const { verifyEmail } = useAuth();
          const [isResending, setIsResending] = useState(false);
          const [isVerifyingLater, setIsVerifyingLater] = useState(false);
          const router = useRouter();
          const searchParams = useSearchParams();
          // Import sessionManager and authAPI dynamically to avoid SSR issues
          const [sessionManager, setSessionManager] = useState<any>(null);
          const [authAPI, setAuthAPI] = useState<any>(null);
          useEffect(() => {
                    import('@/lib/session-manager').then(mod => setSessionManager(mod.sessionManager));
                    import('@/lib/auth-apis').then(mod => setAuthAPI(mod.authAPI));
          }, []);

          // Auto-fill code from URL if present
          useEffect(() => {
                    const key = searchParams.get('key');
                    if (key) {
                              setVerificationCode(key);
                    }
          }, [searchParams]);

          const handleSubmit = async (e: React.FormEvent) => {
                    if (timeLeft === 0) {
                              setErrorMessage('Verification code expired. Please resend.');
                              return;
                    }
                    e.preventDefault();

                    const validationError = validateVerificationCode(verificationCode);
                    if (validationError) {
                              setErrorMessage(validationError);
                              return;
                    }

                    setIsSubmitting(true);
                    setErrorMessage(null);

                    try {
                              if (!authAPI || !sessionManager) {
                                        setErrorMessage('Please wait, loading...');
                                        setIsSubmitting(false);
                                        return;
                              }
                              const email = searchParams.get('email') || '';
                              // Get access token from registration (temporary session or localStorage)
                              let accessToken = null;
                              if (typeof window !== 'undefined') {
                                        accessToken = localStorage.getItem('auth_token');
                              }
                              // Call verifyEmail and expect access, refresh, user in response
                              const response = await authAPI.verifyEmail({ email, code: verificationCode }, accessToken);
                              if (response && response.access) {
                                        let user = response.user;
                                        if (!user) {
                                                  try {
                                                            user = await authAPI.getCurrentUser();
                                                  } catch { }
                                        }
                                        sessionManager.setSession(response.access, user || {});
                                        setSuccessMessage('Email verified successfully! Redirecting to dashboard...');
                                        setTimeout(() => {
                                                  router.push('/dashboard');
                                        }, 1200);
                              } else {
                                        setErrorMessage(response?.message || 'Verification failed. Please try again.');
                              }
                    } catch (error: any) {
                              if (error.status === 400 && error.message?.includes('Invalid or expired code')) {
                                        setErrorMessage('Invalid or expired code. Please resend verification email.');
                              } else if (error.status === 403) {
                                        setErrorMessage('Session expired or invalid. Please register again.');
                              } else {
                                        setErrorMessage(error.message || 'Verification failed. Please try again.');
                              }
                    } finally {
                              setIsSubmitting(false);
                    }
          };

          const handleResend = async () => {
                    setIsResending(true);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    try {
                              const email = searchParams.get('email') || '';
                              const response = await import('@/lib/auth-apis').then(mod => mod.authAPI.resendVerification(email));
                              setSuccessMessage(response.message);
                              if (response.development_note) {
                                        setSuccessMessage(prev => prev + ' ' + response.development_note);
                              }
                    } catch (error: any) {
                              setErrorMessage(error.message || 'Failed to resend verification email.');
                    } finally {
                              setIsResending(false);
                    }
          };

          return (
                    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
                                                  <div className="text-center mb-6 sm:mb-8">
                                                            <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                                                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                      </svg>
                                                            </div>
                                                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                                                      Verify Your Email
                                                            </h1>
                                                            <p className="text-sm sm:text-base text-gray-600">
                                                                      Enter the verification code sent to your email address.
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

                                                  <form onSubmit={handleSubmit} className="space-y-6">
                                                            <VerificationCodeInput
                                                                      value={verificationCode}
                                                                      onChange={setVerificationCode}
                                                                      error={errorMessage ?? undefined}
                                                                      inputRef={setInputRef}
                                                                      onKeyDown={e => {
                                                                                if (e.key === 'Enter') {
                                                                                          handleSubmit(e);
                                                                                }
                                                                      }}
                                                            />
                                                            <div className="text-xs text-gray-500 text-center">
                                                                      {timeLeft > 0
                                                                                ? `Code expires in ${Math.floor(timeLeft / 60)}:${('0' + (timeLeft % 60)).slice(-2)}`
                                                                                : 'Code expired. Please resend.'}
                                                            </div>

                                                            <Button
                                                                      type="submit"
                                                                      className="w-full"
                                                                      isLoading={isSubmitting}
                                                                      disabled={isSubmitting || verificationCode.length < 6}
                                                            >
                                                                      Verify Email
                                                            </Button>
                                                            <Button
                                                                      type="button"
                                                                      className="w-full mt-2"
                                                                      variant="secondary"
                                                                      isLoading={isVerifyingLater}
                                                                      disabled={isVerifyingLater}
                                                                      onClick={async () => {
                                                                                setErrorMessage(null);
                                                                                setSuccessMessage(null);
                                                                                setIsVerifyingLater(true);
                                                                                try {
                                                                                          if (!authAPI || !sessionManager) {
                                                                                                    setErrorMessage('Please wait, loading...');
                                                                                                    setIsVerifyingLater(false);
                                                                                                    return;
                                                                                          }
                                                                                          // Call verify-later endpoint
                                                                                          const response = await authAPI.makeRequest('/api/v1/accounts/auth/verify-later/', {
                                                                                                    method: 'POST',
                                                                                          });
                                                                                          if (response && response.access) {
                                                                                                    // Update session with new access token
                                                                                                    let user = null;
                                                                                                    try {
                                                                                                              user = await authAPI.getCurrentUser();
                                                                                                    } catch { }
                                                                                                    sessionManager.setSession(response.access, user || {});
                                                                                                    setSuccessMessage('Verification skipped. Redirecting to dashboard...');
                                                                                                    setTimeout(() => {
                                                                                                              router.push('/dashboard');
                                                                                                    }, 1200);
                                                                                          } else {
                                                                                                    // On failure, redirect to /auth
                                                                                                    router.push('/auth');
                                                                                          }
                                                                                } catch (err: any) {
                                                                                          // On error, redirect to /auth
                                                                                          router.push('/auth');
                                                                                } finally {
                                                                                          setIsVerifyingLater(false);
                                                                                }
                                                                      }}
                                                            >
                                                                      Verify later
                                                            </Button>
                                                  </form>

                                                  <div className="mt-6 text-center">
                                                            <p className="text-sm text-gray-600">
                                                                      Didn't receive the code?{' '}
                                                                      <button
                                                                                type="button"
                                                                                className="text-blue-600 hover:text-blue-500 font-medium"
                                                                                onClick={() => {
                                                                                          if (resendCooldown === 0) {
                                                                                                    handleResend();
                                                                                                    setResendCooldown(30);
                                                                                          }
                                                                                }}
                                                                                disabled={isResending || resendCooldown > 0}
                                                                      >
                                                                                {isResending
                                                                                          ? 'Resending...'
                                                                                          : resendCooldown > 0
                                                                                                    ? `Resend available in ${resendCooldown}s`
                                                                                                    : 'Resend verification email'}
                                                                      </button>
                                                            </p>
                                                            <p className="text-sm text-gray-600 mt-2">
                                                                      <button
                                                                                type="button"
                                                                                onClick={() => router.push('/auth')}
                                                                                className="text-blue-600 hover:text-blue-500 font-medium"
                                                                      >
                                                                                Back to sign in
                                                                      </button>
                                                            </p>
                                                  </div>
                                        </div>
                              </div>
                    </div>
          );
}

export default function VerifyEmailPage() {
          return (
                    <Suspense fallback={
                              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                                        <div className="text-center">
                                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                                  <p className="text-gray-600">Loading...</p>
                                        </div>
                              </div>
                    }>
                              <VerifyEmailContent />
                    </Suspense>
          );
}
