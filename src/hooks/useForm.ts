
// hooks/useForm.ts
import { logger } from '../lib/logger';


import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
          initialValues: T;
          validate?: (values: T) => Partial<Record<keyof T, string>>;
          onSubmit: (values: T) => Promise<void> | void;
}

interface UseFormReturn<T> {
          values: T;
          errors: Partial<Record<keyof T, string>>;
          isSubmitting: boolean;
          handleChange: (name: keyof T, value: string) => void;
          handleSubmit: (e: React.FormEvent) => void;
          setFieldError: (name: keyof T, error: string) => void;
          clearErrors: () => void;
          reset: () => void;
}

export function useForm<T extends Record<string, any>>({
          initialValues,
          validate,
          onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
          const [values, setValues] = useState<T>(initialValues);
          const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
          const [isSubmitting, setIsSubmitting] = useState(false);

          const handleChange = useCallback((name: keyof T, value: string) => {
                    setValues(prev => ({ ...prev, [name]: value }));
                    // Clear error when user starts typing
                    if (errors[name]) {
                              setErrors(prev => ({ ...prev, [name]: undefined }));
                    }
          }, [errors]);

          const handleSubmit = useCallback(async (e: React.FormEvent) => {
                    e.preventDefault();

                    // Validate form
                    const validationErrors = validate ? validate(values) : {};
                    setErrors(validationErrors);

                    if (Object.keys(validationErrors).length > 0) {
                              logger.warn('Form validation failed:', validationErrors);
                              return;
                    }

                    setIsSubmitting(true);
                    try {
                              await onSubmit(values);
                    } catch (error) {
                              logger.error('Form submission failed:', error);
                    } finally {
                              setIsSubmitting(false);
                    }
          }, [values, validate, onSubmit]);

          const setFieldError = useCallback((name: keyof T, error: string) => {
                    setErrors(prev => ({ ...prev, [name]: error }));
          }, []);

          const clearErrors = useCallback(() => {
                    setErrors({});
          }, []);

          const reset = useCallback(() => {
                    setValues(initialValues);
                    setErrors({});
                    setIsSubmitting(false);
          }, [initialValues]);

          return {
                    values,
                    errors,
                    isSubmitting,
                    handleChange,
                    handleSubmit,
                    setFieldError,
                    clearErrors,
                    reset,
          };
}
