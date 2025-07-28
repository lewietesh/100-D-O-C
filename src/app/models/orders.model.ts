// app/models/orders.model.ts
export interface ServiceRequirement {
  title: string;
  description: string;
  completed: boolean;
}

export interface PaymentDetail {
  id: string;
  amount: number;
  status: 'pending' | 'paid' | 'refunded';
  method?: string;
  date?: string;
}

export interface ServiceOrder {
  id: string;
  serviceId: string;
  serviceName: string;  // Add this property
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  description: string;
  requirements?: ServiceRequirement[];
  budget?: number;
  timeline?: string;
  startDate?: string;
  endDate?: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  payments?: PaymentDetail[];
  attachments?: string[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}