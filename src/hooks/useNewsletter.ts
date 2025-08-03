// src/hooks/useNewsletter.ts
import { useState } from 'react';
import {
          NewsletterService,
          NewsletterSubscribeRequest,
          NewsletterSubscribeResponse,
          NewsletterError
} from '@/services/api/newsletter';

interface UseNewsletterReturn {
          isLoading: boolean;
          error: string | null;
          success: boolean;
          subscribe: (data: NewsletterSubscribeRequest) => Promise<void>;
          reset: () => void;
}

export const useNewsletter = (): UseNewsletterReturn => {
          const [isLoading, setIsLoading] = useState(false);
          const [error, setError] = useState<string | null>(null);
          const [success, setSuccess] = useState(false);

          const subscribe = async (data: NewsletterSubscribeRequest): Promise<void> => {
                    setIsLoading(true);
                    setError(null);
                    setSuccess(false);

                    try {
                              const response = await NewsletterService.subscribe(data);
                              setSuccess(true);
                    } catch (error: any) {
                              if (error.status === 400 && error.errors) {
                                        // Handle validation errors
                                        const errors = error.errors as NewsletterError;

                                        if (errors.email && errors.email.length > 0) {
                                                  setError(errors.email[0]);
                                        } else if (errors.name && errors.name.length > 0) {
                                                  setError(errors.name[0]);
                                        } else if (errors.non_field_errors && errors.non_field_errors.length > 0) {
                                                  setError(errors.non_field_errors[0]);
                                        } else if (errors.detail) {
                                                  setError(errors.detail);
                                        } else {
                                                  setError('Please check your input and try again.');
                                        }
                              } else if (error.errors?.detail) {
                                        setError(error.errors.detail);
                              } else {
                                        setError('Something went wrong. Please try again later.');
                              }
                    } finally {
                              setIsLoading(false);
                    }
          };

          const reset = () => {
                    setError(null);
                    setSuccess(false);
          };

          return {
                    isLoading,
                    error,
                    success,
                    subscribe,
                    reset,
          };
};
