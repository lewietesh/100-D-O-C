// components/auth/GoogleAuthButton.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { logger } from '@/lib/logger';

interface GoogleAuthButtonProps {
          onSuccess: (idToken: string) => void;
          onError: (error: string) => void;
          text?: 'signin' | 'signup' | 'continue';
          disabled?: boolean;
          className?: string;
}

// Extended window interface for Google APIs
declare global {
          interface Window {
                    google?: {
                              accounts: {
                                        id: {
                                                  initialize: (config: GoogleIdConfig) => void;
                                                  renderButton: (element: Element, config: GoogleButtonConfig) => void;
                                                  prompt: () => void;
                                                  cancel: () => void;
                                                  disableAutoSelect: () => void;
                                        };
                                        oauth2: {
                                                  initTokenClient: (config: GoogleTokenConfig) => GoogleTokenClient;
                                                  hasGrantedAllScopes: (tokenResponse: any, ...scopes: string[]) => boolean;
                                                  hasGrantedAnyScope: (tokenResponse: any, ...scopes: string[]) => boolean;
                                                  revoke: (accessToken: string, callback?: () => void) => void;
                                        };
                              };
                    };
          }
}

interface GoogleIdConfig {
          client_id: string;
          callback?: (credentialResponse: any) => void;
          auto_select?: boolean;
          cancel_on_tap_outside?: boolean;
          context?: 'signin' | 'signup' | 'use';
}

interface GoogleButtonConfig {
          type?: 'standard' | 'icon';
          theme?: 'outline' | 'filled_blue' | 'filled_black';
          size?: 'large' | 'medium' | 'small';
          text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
          shape?: 'rectangular' | 'pill' | 'circle' | 'square';
          logo_alignment?: 'left' | 'center';
          width?: string | number;
          locale?: string;
}

interface GoogleTokenConfig {
          client_id: string;
          scope: string;
          callback: (tokenResponse: any) => void;
          error_callback?: (error: any) => void;
          state?: string;
          enable_granular_consent?: boolean;
          hosted_domain?: string;
          hint?: string;
          hd?: string;
}

interface GoogleTokenClient {
          requestAccessToken: (overrideConfig?: Partial<GoogleTokenConfig>) => void;
}

interface GoogleTokenResponse {
          access_token: string;
          token_type: string;
          expires_in: number;
          scope: string;
          state?: string;
          error?: string;
          error_description?: string;
          error_uri?: string;
}

export function GoogleAuthButton({
          onSuccess,
          onError,
          text = 'continue',
          disabled = false,
          className = ''
}: GoogleAuthButtonProps) {
          const [isLoaded, setIsLoaded] = useState(false);
          const [isLoading, setIsLoading] = useState(false);
          const buttonRef = useRef<HTMLDivElement>(null);

          // Load Google Identity Services script and render button
          useEffect(() => {
                    const loadGoogleScript = () => {
                              if (window.google?.accounts?.id) {
                                        initializeGoogleId();
                                        return;
                              }
                              const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
                              if (existingScript) {
                                        existingScript.addEventListener('load', initializeGoogleId);
                                        return;
                              }
                              const script = document.createElement('script');
                              script.src = 'https://accounts.google.com/gsi/client';
                              script.async = true;
                              script.defer = true;
                              script.onload = initializeGoogleId;
                              script.onerror = handleScriptError;
                              document.head.appendChild(script);
                    };

                    const initializeGoogleId = () => {
                              if (!window.google?.accounts?.id) {
                                        handleScriptError();
                                        return;
                              }
                              try {
                                        window.google.accounts.id.initialize({
                                                  client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                                                  callback: handleCredentialResponse,
                                                  cancel_on_tap_outside: true,
                                        });
                                        if (buttonRef.current) {
                                                  window.google.accounts.id.renderButton(buttonRef.current, {
                                                            theme: 'outline',
                                                            size: 'large',
                                                            text: 'signin_with',
                                                  });
                                        }
                                        setIsLoaded(true);
                                        logger.info('Google ID client initialized successfully');
                              } catch (error) {
                                        logger.error('Failed to initialize Google ID client:', error);
                                        onError('Failed to initialize Google authentication');
                              }
                    };

                    const handleScriptError = () => {
                              logger.error('Failed to load Google Identity Services script');
                              onError('Failed to load Google authentication service');
                    };

                    loadGoogleScript();
                    return () => { };
          }, [onError]);

          // Handle Google credential response (id_token)
          const handleCredentialResponse = useCallback((response: any) => {
                    setIsLoading(false);
                    if (response.credential) {
                              logger.info('Google ID token received');
                              onSuccess(response.credential);
                    } else {
                              logger.error('No ID token received from Google');
                              onError('Failed to get ID token from Google');
                    }
          }, [onSuccess, onError]);

          // Handle token response from Google
          const handleTokenResponse = useCallback((tokenResponse: GoogleTokenResponse) => {
                    setIsLoading(false);

                    if (tokenResponse.error) {
                              logger.error('Google OAuth error:', {
                                        error: tokenResponse.error,
                                        description: tokenResponse.error_description
                              });

                              if (tokenResponse.error === 'popup_closed_by_user') {
                                        // User cancelled, don't show error
                                        return;
                              }

                              onError(`Google authentication failed: ${tokenResponse.error_description || tokenResponse.error}`);
                              return;
                    }

                    if (!tokenResponse.access_token) {
                              logger.error('No access token received from Google');
                              onError('Failed to get authentication token from Google');
                              return;
                    }

                    logger.info('Google OAuth successful, access token received');
                    onSuccess(tokenResponse.access_token);
          }, [onSuccess, onError]);

          // Handle token errors
          const handleTokenError = useCallback((error: any) => {
                    setIsLoading(false);
                    logger.error('Google OAuth token error:', error);
                    onError('Google authentication failed. Please try again.');
          }, [onError]);

          // Initiate Google ID flow
          const handleGoogleAuth = useCallback(() => {
                    if (!window.google?.accounts?.id) {
                              onError('Google authentication not available');
                              return;
                    }
                    if (disabled || isLoading) {
                              return;
                    }
                    setIsLoading(true);
                    try {
                              window.google.accounts.id.prompt();
                    } catch (error) {
                              setIsLoading(false);
                              logger.error('Failed to start Google ID prompt:', error);
                              onError('Failed to start Google authentication');
                    }
          }, [disabled, isLoading, onError]);

          // Get button text based on context
          const getButtonText = () => {
                    switch (text) {
                              case 'signin':
                                        return 'Sign in with Google';
                              case 'signup':
                                        return 'Sign up with Google';
                              default:
                                        return 'Continue with Google';
                    }
          };

          return (
                    <div ref={buttonRef} className={className} />
          );
}

// Alternative implementation using Google One Tap (for silent sign-in)
export function GoogleOneTap({
          onSuccess,
          onError,
          autoSelect = true,
}: {
          onSuccess: (credential: string) => void;
          onError: (error: string) => void;
          autoSelect?: boolean;
}) {
          useEffect(() => {
                    if (!window.google?.accounts) {
                              return;
                    }

                    const handleCredentialResponse = (response: any) => {
                              if (response.credential) {
                                        onSuccess(response.credential);
                              } else {
                                        onError('Failed to get credential from Google One Tap');
                              }
                    };

                    try {
                              window.google.accounts.id.initialize({
                                        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                                        callback: handleCredentialResponse,
                                        auto_select: autoSelect,
                                        cancel_on_tap_outside: true,
                              });

                              // Show the One Tap prompt
                              window.google.accounts.id.prompt();
                    } catch (error) {
                              logger.error('Failed to initialize Google One Tap:', error);
                              onError('Failed to initialize Google One Tap');
                    }
          }, [onSuccess, onError, autoSelect]);

          return null; // This component doesn't render anything visible
}