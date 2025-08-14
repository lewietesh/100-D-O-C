// src/api/support.ts
import { apiClient } from './axiosInstance';
import { SupportTicket } from '@/types/support';

export const supportApi = {
  getTickets: () => apiClient.get<SupportTicket[]>('/api/v1/support/tickets/'),
  
  createTicket: (data: { subject: string; message: string; priority?: string }) =>
    apiClient.post<SupportTicket>('/api/v1/support/tickets/', data),
  
  getTicket: (id: string) => apiClient.get<SupportTicket>(`/api/v1/support/tickets/${id}/`),
  
  replyToTicket: (id: string, message: string) =>
    apiClient.post(`/api/v1/support/tickets/${id}/reply/`, { message }),
};
