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
          const [verificationCode, setVerificationCode] = useState('');
          const [isSubmitting, setIsSubmitting] = useState(false);
          const [successMessage, setSuccessMessage] = useState<string | null>(null);
          const [errorMessage, setErrorMessage] = useState<string | null>(null);

          const { verifyEmail } = useAuth();
          const router = useRouter();
          const searchParams = useSearchParams();

          // Auto-fill code from URL if present
          useEffect(() => {
                    const key = searchParams.get('key');
                    if (key) {
                              setVerificationCode(key);
                    }
          }, [searchParams]);

          const handleSubmit = async (e: React.FormEvent) => {
                    e.preventDefault();

                    const validationError = validateVerificationCode(verificationCode);
                    if (validationError) {
                              setErrorMessage(validationError);
                              return;
                    }

                    setIsSubmitting(true);
                    setErrorMessage(null);

                    try {
                              await verifyEmail(verificationCode);
                              setSuccessMessage('Email verified successfully! Redirecting to login...');

                              setTimeout(() => {
                                        router.push('/auth?verified=true');
                              }, 2000);
                    } catch (error: any) {
                              setErrorMessage(error.message || 'Verification failed. Please try again.');
                    } finally {
                              setIsSubmitting(false);
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
                                                            />

                                                            <Button
                                                                      type="submit"
                                                                      className="w-full"
                                                                      isLoading={isSubmitting}
                                                                      disabled={isSubmitting || verificationCode.length < 6}
                                                            >
                                                                      Verify Email
                                                            </Button>
                                                  </form>

                                                  <div className="mt-6 text-center">
                                                            <p className="text-sm text-gray-600">
                                                                      Didn't receive the code?{' '}
                                                                      <button
                                                                                type="button"
                                                                                className="text-blue-600 hover:text-blue-500 font-medium"
                                                                                onClick={() => {
                                                                                          // Implement resend logic here
                                                                                          setErrorMessage('Resend functionality not implemented yet');
                                                                                }}
                                                                      >
                                                                                Resend verification email
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
