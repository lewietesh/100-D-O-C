// src/api/orders.ts
import { apiClient } from './axiosInstance';
import { Order } from '@/types/order';

export const ordersApi = {
  getUserOrders: () => apiClient.get<Order[]>('/api/v1/business/orders/'),
  getOrder: (id: string) => apiClient.get<Order>(`/api/v1/business/orders/${id}/`),
};
