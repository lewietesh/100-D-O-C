// src/hooks/usePayPalScript.ts
import { useState, useEffect } from 'react';

interface UsePayPalScriptOptions {
          clientId?: string;
          currency?: string;
          intent?: 'capture' | 'authorize';
          disableFunding?: string[];
          enableFunding?: string[];
          dataClientToken?: string;
          components?: string[];
          debug?: boolean;
}

interface UsePayPalScriptReturn {
          isLoaded: boolean;
          isResolved: boolean;
          isRejected: boolean;
          error: Error | null;
}

export const usePayPalScript = (options: UsePayPalScriptOptions = {}): UsePayPalScriptReturn => {
          const [scriptState, setScriptState] = useState<UsePayPalScriptReturn>({
                    isLoaded: false,
                    isResolved: false,
                    isRejected: false,
                    error: null
          });

          useEffect(() => {
                    // Ensure we only run on the client
                    if (typeof window === 'undefined' || typeof document === 'undefined') {
                              return;
                    }

                    let isActive = true; // avoid setting state after unmount

                    const clientId = options.clientId || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

                    if (!clientId) {
                              isActive && setScriptState({
                                        isLoaded: false,
                                        isResolved: false,
                                        isRejected: true,
                                        error: new Error('PayPal Client ID is required')
                              });
                              return;
                    }

                    // Attempt to find an existing SDK script (by id first, then by data attribute)
                    const scriptId = 'paypal-sdk';
                    let existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
                    if (!existingScript) {
                              existingScript = document.querySelector(
                                        'script[data-sdk-integration-source="paypal-js-sdk"]'
                              ) as HTMLScriptElement | null;
                    }

                    // Helper: finalize load success
                    const resolveLoaded = () => {
                              if (!isActive) return;
                              setScriptState({
                                        isLoaded: true,
                                        isResolved: true,
                                        isRejected: false,
                                        error: null,
                              });
                    };

                    // Helper: poll for window.paypal for a short while after script tag exists
                    const waitForPaypal = (onSuccess: () => void, onTimeout: () => void, timeoutMs = 5000, intervalMs = 50) => {
                              const start = Date.now();
                              const timer = window.setInterval(() => {
                                        if ((window as any).paypal) {
                                                  window.clearInterval(timer);
                                                  onSuccess();
                                        } else if (Date.now() - start >= timeoutMs) {
                                                  window.clearInterval(timer);
                                                  onTimeout();
                                        }
                              }, intervalMs);
                              return () => window.clearInterval(timer);
                    };

                    if (existingScript) {
                              // If script element exists, ensure paypal is actually available
                              if ((window as any).paypal) {
                                        resolveLoaded();
                                        return;
                              }

                              // Attach a load listener to the existing script, and also poll as fallback
                              const handleExistingLoad = () => resolveLoaded();
                              existingScript.addEventListener('load', handleExistingLoad);

                              const cancelPoll = waitForPaypal(resolveLoaded, () => {
                                        if (!isActive) return;
                                        setScriptState({
                                                  isLoaded: false,
                                                  isResolved: false,
                                                  isRejected: true,
                                                  error: new Error('PayPal SDK script found but window.paypal did not initialize in time'),
                                        });
                              });

                              return () => {
                                        isActive = false;
                                        existingScript && existingScript.removeEventListener('load', handleExistingLoad);
                                        cancelPoll && cancelPoll();
                              };
                    }

                    // Build script URL with query parameters
                    const queryParams = new URLSearchParams();
                    queryParams.append('client-id', clientId);

                    // Add optional parameters
                    if (options.currency) queryParams.append('currency', options.currency);
                    if (options.intent) queryParams.append('intent', options.intent);

                    if (options.disableFunding && options.disableFunding.length > 0) {
                              queryParams.append('disable-funding', options.disableFunding.join(','));
                    }

                    if (options.enableFunding && options.enableFunding.length > 0) {
                              queryParams.append('enable-funding', options.enableFunding.join(','));
                    }

                    if (options.dataClientToken) {
                              queryParams.append('data-client-token', options.dataClientToken);
                    }

                    if (options.debug) queryParams.append('debug', 'true');

                    // Add components (defaults to buttons if not specified)
                    const components = options.components || ['buttons'];
                    queryParams.append('components', components.join(','));

                    // Create script element
                    const script = document.createElement('script');
                    script.id = scriptId;
                    script.src = `https://www.paypal.com/sdk/js?${queryParams.toString()}`;
                    script.async = true;
                    script.dataset.sdkIntegrationSource = 'paypal-js-sdk';

                    // Handle script loading
                    const handleLoad = () => {
                              // Some browsers may fire load before the SDK fully sets window.paypal
                              if ((window as any).paypal) {
                                        resolveLoaded();
                              } else {
                                        waitForPaypal(resolveLoaded, () => {
                                                  if (!isActive) return;
                                                  setScriptState({
                                                            isLoaded: false,
                                                            isResolved: false,
                                                            isRejected: true,
                                                            error: new Error('PayPal SDK loaded but window.paypal not found'),
                                                  });
                                        });
                              }
                    };

                    const handleError = (error: ErrorEvent) => {
                              if (!isActive) return;
                              setScriptState({
                                        isLoaded: false,
                                        isResolved: false,
                                        isRejected: true,
                                        error: new Error(`Failed to load PayPal SDK: ${error.message}`)
                              });
                    };

                    script.addEventListener('load', handleLoad);
                    script.addEventListener('error', handleError);

                    // Add script to document
                    document.body.appendChild(script);

                    // Cleanup
                    return () => {
                              isActive = false;
                              script.removeEventListener('load', handleLoad);
                              script.removeEventListener('error', handleError);

                              // We don't remove the script on cleanup because it could be used by other components
                    };
          }, [
                    options.clientId,
                    options.currency,
                    options.intent,
                    options.disableFunding?.join(','),
                    options.enableFunding?.join(','),
                    options.dataClientToken,
                    options.debug,
                    options.components?.join(',')
          ]);

          return scriptState;
};

export default usePayPalScript;
