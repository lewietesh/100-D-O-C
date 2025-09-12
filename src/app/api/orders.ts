// src/api/orders.ts
import { apiClient } from './axiosInstance';
import { Order } from '@/types/order';

interface PaginatedOrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

export const ordersApi = {
  getUserOrders: () => apiClient.get<PaginatedOrdersResponse>('/api/v1/business/orders/'),
  getOrder: (id: string) => apiClient.get<Order>(`/api/v1/business/orders/${id}/`),
};
