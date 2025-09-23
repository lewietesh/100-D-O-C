// src/api/payments.ts
import { apiClient } from './axiosInstance';
import { Payment, PaymentIntent } from '@/types/payment';

export const paymentsApi = {
          // Use Business app payments endpoint
          getPaymentHistory: () => apiClient.get<Payment[]>('/api/v1/business/payments/'),

          createPaymentIntent: (data: { amount: number; currency: string; description?: string }) =>
                    apiClient.post<PaymentIntent>('/api/v1/payments/create-intent/', data),

          confirmPayment: (data: { payment_intent_id: string; method: string }) =>
                    apiClient.post<Payment>('/api/v1/payments/confirm/', data),


};