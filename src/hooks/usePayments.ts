// src/hooks/usePayments.ts - Complete Implementation
import { useState, useEffect, useCallback } from 'react';
import { paymentsApi } from '@/app/api/payment';
import { paypalApi } from '@/app/api/paypal';
import { Payment, PaymentIntent, PayPalOrderResponse, AccountBalance } from '@/types/payment';

interface UsePaymentsReturn {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  accountBalance: AccountBalance | null;
  createPaymentIntent: (amount: number, currency?: string, description?: string) => Promise<PaymentIntent | null>;
  confirmPayment: (paymentIntentId: string, method: string) => Promise<boolean>;
  createPayPalOrder: (orderId: string, amount: number, description?: string) => Promise<PayPalOrderResponse | null>;
  capturePayPalPayment: (paypalOrderId: string, updateBalance?: boolean) => Promise<{ success: boolean; balance?: AccountBalance }>;
  getAccountBalance: () => Promise<AccountBalance | null>;
  updateAccountBalance: (amount: number, paymentId: string) => Promise<AccountBalance | null>;
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
  const [accountBalance, setAccountBalance] = useState<AccountBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentsApi.getPaymentHistory();
      // Normalize response: API may return either an array or a paginated object { results: [] }
      const list: Payment[] = Array.isArray(data)
        ? (data as Payment[])
        : (Array.isArray((data as any)?.results) ? ((data as any).results as Payment[]) : []);

      // Sort payments by creation date (newest first)
      const sortedPayments = list.sort((a: Payment, b: Payment) =>
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

  // PayPal specific methods
  const createPayPalOrder = useCallback(async (
    orderId: string,
    amount: number,
    description?: string
  ): Promise<PayPalOrderResponse | null> => {
    try {
      setError(null);

      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      const response = await paypalApi.createOrder({
        order_id: orderId,
        amount,
        description
      });

      return response;
    } catch (err: any) {
      let errorMessage = 'Failed to create PayPal order';

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return null;
    }
  }, []);

  const capturePayPalPayment = useCallback(async (
    paypalOrderId: string,
    updateBalance: boolean = false
  ): Promise<{ success: boolean; balance?: AccountBalance }> => {
    try {
      setError(null);

      const response = await paypalApi.capturePayment({
        paypal_order_id: paypalOrderId,
        update_account_balance: updateBalance
      });

      if (response.success) {
        // Add the payment to the local state
        await refetch();

        // If there's account balance info in the response, return it
        if (response.balance) {
          setAccountBalance(response.balance);
          return { success: true, balance: response.balance };
        }

        return { success: true };
      } else {
        setError(response.message || 'Payment capture failed');
        return { success: false };
      }
    } catch (err: any) {
      let errorMessage = 'Failed to capture PayPal payment';

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return { success: false };
    }
  }, [refetch]);

  // Get account balance
  const getAccountBalance = useCallback(async (): Promise<AccountBalance | null> => {
    try {
      setError(null);
      const response = await paypalApi.getAccountBalance();
      const balance = response;
      setAccountBalance(balance);
      return balance;
    } catch (err: any) {
      let errorMessage = 'Failed to retrieve account balance';

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return null;
    }
  }, []);

  // Update account balance
  const updateAccountBalance = useCallback(async (
    amount: number,
    paymentId: string
  ): Promise<AccountBalance | null> => {
    try {
      setError(null);
      const balance = await paypalApi.updateAccountBalance(amount, paymentId);
      setAccountBalance(balance);
      return balance;
    } catch (err: any) {
      let errorMessage = 'Failed to update account balance';

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return null;
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchPayments();
    getAccountBalance(); // Also fetch the account balance
  }, [fetchPayments, getAccountBalance]);

  return {
    payments,
    loading,
    error,
    accountBalance,
    createPaymentIntent,
    createPayPalOrder,
    capturePayPalPayment,
    confirmPayment,
    getAccountBalance,
    updateAccountBalance,
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