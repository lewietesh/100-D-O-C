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
                    const clientId = options.clientId || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

                    if (!clientId) {
                              setScriptState({
                                        isLoaded: false,
                                        isResolved: false,
                                        isRejected: true,
                                        error: new Error('PayPal Client ID is required')
                              });
                              return;
                    }

                    // Check if script is already loaded
                    const existingScript = document.querySelector(`script[data-sdk-integration-source="paypal-js-sdk"]`);
                    if (existingScript) {
                              setScriptState({
                                        isLoaded: true,
                                        isResolved: true,
                                        isRejected: false,
                                        error: null
                              });
                              return;
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
                    script.src = `https://www.paypal.com/sdk/js?${queryParams.toString()}`;
                    script.async = true;
                    script.dataset.sdkIntegrationSource = 'paypal-js-sdk';

                    // Handle script loading
                    const handleLoad = () => {
                              setScriptState({
                                        isLoaded: true,
                                        isResolved: true,
                                        isRejected: false,
                                        error: null
                              });
                    };

                    const handleError = (error: ErrorEvent) => {
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
