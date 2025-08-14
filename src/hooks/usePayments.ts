// src/hooks/usePayments.ts - Complete Implementation
import { useState, useEffect, useCallback } from 'react';
import { paymentsApi } from '@/app/api/payment';
import { Payment, PaymentIntent } from '@/types/payment';

interface UsePaymentsReturn {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  createPaymentIntent: (amount: number, currency?: string, description?: string) => Promise<PaymentIntent | null>;
  confirmPayment: (paymentIntentId: string, method: string) => Promise<boolean>;
  recordCashPayment: (amount: number, description?: string, reference?: string) => Promise<boolean>;
  refetch: () => Promise<void>;
  clearError: () => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (paymentId: string, updates: Partial<Payment>) => void;
  getPaymentById: (paymentId: string) => Payment | undefined;
  getPaymentsByStatus: (status: Payment['status']) => Payment[];
  getPaymentsByMethod: (method: Payment['method']) => Payment[];
  getTotalAmount: () => number;
  getSuccessRate: () => number;
}

export const usePayments = (): UsePaymentsReturn => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentsApi.getPaymentHistory();
      
      // Sort payments by creation date (newest first)
      const sortedPayments = data.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setPayments(sortedPayments);
    } catch (err: any) {
      let errorMessage = 'Failed to load payments';
      
      if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Please check your permissions.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Payment history not found.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPaymentIntent = useCallback(async (
    amount: number, 
    currency: string = 'USD',
    description?: string
  ): Promise<PaymentIntent | null> => {
    try {
      setError(null);
      
      // Validate input
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      
      if (amount > 999999.99) {
        throw new Error('Amount cannot exceed $999,999.99');
      }

      const paymentIntent = await paymentsApi.createPaymentIntent({ 
        amount, 
        currency,
        description 
      });
      
      return paymentIntent;
    } catch (err: any) {
      let errorMessage = 'Failed to create payment intent';
      
      if (err.response?.status === 400) {
        if (err.response.data?.amount) {
          errorMessage = `Amount error: ${err.response.data.amount[0]}`;
        } else if (err.response.data?.currency) {
          errorMessage = `Currency error: ${err.response.data.currency[0]}`;
        } else if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return null;
    }
  }, []);

  const confirmPayment = useCallback(async (
    paymentIntentId: string, 
    method: string
  ): Promise<boolean> => {
    try {
      setError(null);
      
      if (!paymentIntentId || !method) {
        throw new Error('Payment intent ID and method are required');
      }

      const payment = await paymentsApi.confirmPayment({
        payment_intent_id: paymentIntentId,
        method,
      });
      
      // Add new payment to the beginning of the list
      setPayments(prev => [payment, ...prev]);
      return true;
    } catch (err: any) {
      let errorMessage = 'Failed to confirm payment';
      
      if (err.response?.status === 400) {
        if (err.response.data?.payment_intent_id) {
          errorMessage = 'Invalid payment intent ID';
        } else if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err.response?.status === 402) {
        errorMessage = 'Payment failed. Please check your payment method.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return false;
    }
  }, []);

  const recordCashPayment = useCallback(async (
    amount: number, 
    description?: string, 
    reference?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate input
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      
      if (amount > 999999.99) {
        throw new Error('Amount cannot exceed $999,999.99');
      }
      
      if (!description || description.trim().length === 0) {
        throw new Error('Description is required for cash payments');
      }
      
      const payment = await paymentsApi.recordCashPayment({
        amount,
        description: description.trim(),
        reference: reference?.trim() || undefined,
      });
      
      // Add new payment to the beginning of the list
      setPayments(prev => [payment, ...prev]);
      return true;
    } catch (err: any) {
      let errorMessage = 'Failed to record cash payment';
      
      if (err.response?.status === 400) {
        if (err.response.data?.amount) {
          errorMessage = `Amount error: ${err.response.data.amount[0]}`;
        } else if (err.response.data?.description) {
          errorMessage = `Description error: ${err.response.data.description[0]}`;
        } else if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchPayments();
  }, [fetchPayments]);

  // Utility functions for managing payments in state
  const addPayment = useCallback((payment: Payment) => {
    setPayments(prev => [payment, ...prev]);
  }, []);

  const updatePayment = useCallback((paymentId: string, updates: Partial<Payment>) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, ...updates }
        : payment
    ));
  }, []);

  const getPaymentById = useCallback((paymentId: string): Payment | undefined => {
    return payments.find(payment => payment.id === paymentId);
  }, [payments]);

  const getPaymentsByStatus = useCallback((status: Payment['status']): Payment[] => {
    return payments.filter(payment => payment.status === status);
  }, [payments]);

  const getPaymentsByMethod = useCallback((method: Payment['method']): Payment[] => {
    return payments.filter(payment => payment.method === method);
  }, [payments]);

  const getTotalAmount = useCallback((): number => {
    return payments
      .filter(payment => payment.status === 'completed')
      .reduce((total, payment) => total + payment.amount, 0);
  }, [payments]);

  const getSuccessRate = useCallback((): number => {
    if (payments.length === 0) return 0;
    
    const successfulPayments = payments.filter(payment => payment.status === 'completed').length;
    return (successfulPayments / payments.length) * 100;
  }, [payments]);

  // Initial fetch on mount
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    loading,
    error,
    createPaymentIntent,
    confirmPayment,
    recordCashPayment,
    refetch,
    clearError,
    addPayment,
    updatePayment,
    getPaymentById,
    getPaymentsByStatus,
    getPaymentsByMethod,
    getTotalAmount,
    getSuccessRate,
  };
};