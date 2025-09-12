// src/app/api/paypal.ts
import { apiClient } from './axiosInstance';
import { PayPalOrderResponse, AccountBalance } from '@/types/payment';

export interface CreatePayPalOrderRequest {
          order_id: string;  // The ID of the system order to pay for
          amount: number;
          description?: string;
}

export interface CapturePayPalOrderRequest {
          paypal_order_id: string;
          update_account_balance?: boolean;
}

export const paypalApi = {
          /**
           * Create a PayPal order
           * @param data Order creation data
           * @returns PayPal order response with approval URL
           */
          createOrder: (data: CreatePayPalOrderRequest) =>
                    apiClient.post<PayPalOrderResponse>('/api/v1/business/paypal/create-order/', data),

          /**
           * Capture a previously approved PayPal order
           * @param data Capture request data
           * @returns Capture result with success status and optional balance update
           */
          capturePayment: (data: CapturePayPalOrderRequest) =>
                    apiClient.post<{ success: boolean; message?: string; balance?: AccountBalance }>('/api/v1/business/paypal/capture-payment/', data),

          /**
           * Get details of a specific PayPal payment
           * @param paypalOrderId The PayPal order ID
           * @returns PayPal payment details
           */
          getPaymentDetails: (paypalOrderId: string) =>
                    apiClient.get(`/api/v1/business/paypal/${paypalOrderId}/`),

          /**
           * Get the user's account balance
           * @returns Current account balance information
           */
          getAccountBalance: async () => {
                    const res = await apiClient.get<any>('/api/v1/business/account-balance/my_balance/');
                    return res.data as AccountBalance;
          },

          /**
           * Update the user's account balance by processing a payment
           * @param amount Amount to add to the balance
           * @param paymentId ID of the associated payment
           * @returns Updated account balance
           */
          updateAccountBalance: async (amount: number, paymentId: string) => {
                    const res = await apiClient.post<any>('/api/v1/business/account-balance/add_funds/', {
                              amount,
                              payment_id: paymentId
                    });
                    return res.data as AccountBalance;
          }
};
