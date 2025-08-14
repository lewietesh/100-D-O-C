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
}

export interface PaymentIntent {
  client_secret: string;
  amount: number;
  currency: string;
}
