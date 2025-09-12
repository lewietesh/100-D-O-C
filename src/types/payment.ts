// src/types/payment.ts
export interface Payment {
  id: string;
  method: 'stripe' | 'paypal' | 'mpesa' | 'cash';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference?: string;
  order_id?: string;
  created_at: string;
  description?: string;
  paypal_details?: PayPalPaymentDetails;
}

export interface PaymentIntent {
  client_secret: string;
  amount: number;
  currency: string;
}

export interface PayPalPaymentDetails {
  paypal_order_id: string;
  paypal_payer_id?: string;
  paypal_payer_email?: string;
  paypal_payment_id?: string;
  paypal_status: PayPalOrderStatus;
}

export type PayPalOrderStatus =
  | 'CREATED'
  | 'SAVED'
  | 'APPROVED'
  | 'VOIDED'
  | 'COMPLETED'
  | 'PAYER_ACTION_REQUIRED';

export interface PayPalOrderResponse {
  paypal_order_id: string;
  status: PayPalOrderStatus;
  approval_url: string;
  payment_id: string;
}

export interface AccountBalance {
  available: number;
  pending: number;
  currency: string;
  last_updated: string;
}

export interface PaymentWithBalanceUpdate extends Payment {
  balance_update?: AccountBalance;
}
