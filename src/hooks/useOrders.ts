// src/hooks/useOrders.ts - Complete Implementation
import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '@/app/api/orders';
import { Order } from '../types/order';


interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  getOrder: (id: string) => Promise<Order | null>;
  refetch: () => Promise<void>;
  clearError: () => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByStatus: (status: Order['status']) => Order[];
  getTotalOrderValue: () => number;
  getOrdersCount: () => number;
  getCompletedOrdersCount: () => number;
  getPendingOrdersCount: () => number;
  getRecentOrders: (limit?: number) => Order[];
}

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersApi.getUserOrders();
      
      // Sort orders by creation date (newest first)
      const sortedOrders = data.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setOrders(sortedOrders);
    } catch (err: any) {
      let errorMessage = 'Failed to load orders';
      
      if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Please check your permissions.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Orders not found.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
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

  const getOrder = useCallback(async (id: string): Promise<Order | null> => {
    try {
      setError(null);
      
      if (!id || id.trim() === '') {
        throw new Error('Order ID is required');
      }

      const order = await ordersApi.getOrder(id);
      
      // Update the order in the local state if it exists
      setOrders(prev => prev.map(o => o.id === id ? order : o));
      
      return order;
    } catch (err: any) {
      let errorMessage = 'Failed to load order';
      
      if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Order not found.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return null;
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchOrders();
  }, [fetchOrders]);

  // Utility functions for filtering and analyzing orders
  const getOrderById = useCallback((id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  }, [orders]);

  const getOrdersByStatus = useCallback((status: Order['status']): Order[] => {
    return orders.filter(order => order.status === status);
  }, [orders]);

  const getTotalOrderValue = useCallback((): number => {
    return orders.reduce((total, order) => total + order.amount, 0);
  }, [orders]);

  const getOrdersCount = useCallback((): number => {
    return orders.length;
  }, [orders]);

  const getCompletedOrdersCount = useCallback((): number => {
    return orders.filter(order => order.status === 'completed').length;
  }, [orders]);

  const getPendingOrdersCount = useCallback((): number => {
    return orders.filter(order => order.status === 'pending').length;
  }, [orders]);

  const getRecentOrders = useCallback((limit: number = 5): Order[] => {
    return orders.slice(0, limit);
  }, [orders]);

  // Additional utility functions
  const getOrdersByDateRange = useCallback((startDate: Date, endDate: Date): Order[] => {
    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }, [orders]);

  const getOrdersByBusiness = useCallback((business: string): Order[] => {
    return orders.filter(order => 
      order.business.toLowerCase().includes(business.toLowerCase())
    );
  }, [orders]);

  const getOrdersByAmountRange = useCallback((minAmount: number, maxAmount: number): Order[] => {
    return orders.filter(order => order.amount >= minAmount && order.amount <= maxAmount);
  }, [orders]);

  const getOrdersWithItems = useCallback((itemName: string): Order[] => {
    return orders.filter(order =>
      order.items.some(item =>
        item.name.toLowerCase().includes(itemName.toLowerCase())
      )
    );
  }, [orders]);

  const getOrderStatistics = useCallback(() => {
    const total = orders.length;
    const pending = getOrdersByStatus('pending').length;
    const processing = getOrdersByStatus('processing').length;
    const completed = getOrdersByStatus('completed').length;
    const cancelled = getOrdersByStatus('cancelled').length;
    const totalValue = getTotalOrderValue();
    const averageOrderValue = total > 0 ? totalValue / total : 0;

    // Calculate monthly statistics
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthOrders = getOrdersByDateRange(thisMonth, now);
    const lastMonthOrders = getOrdersByDateRange(lastMonth, lastMonthEnd);

    const thisMonthValue = thisMonthOrders.reduce((sum, order) => sum + order.amount, 0);
    const lastMonthValue = lastMonthOrders.reduce((sum, order) => sum + order.amount, 0);

    const monthlyGrowth = lastMonthValue > 0 
      ? ((thisMonthValue - lastMonthValue) / lastMonthValue) * 100 
      : 0;

    return {
      total,
      pending,
      processing,
      completed,
      cancelled,
      totalValue,
      averageOrderValue,
      thisMonthOrders: thisMonthOrders.length,
      lastMonthOrders: lastMonthOrders.length,
      thisMonthValue,
      lastMonthValue,
      monthlyGrowth,
    };
  }, [orders, getOrdersByStatus, getTotalOrderValue, getOrdersByDateRange]);

  // Initial fetch on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    getOrder,
    refetch,
    clearError,
    getOrderById,
    getOrdersByStatus,
    getTotalOrderValue,
    getOrdersCount,
    getCompletedOrdersCount,
    getPendingOrdersCount,
    getRecentOrders,
    // Additional utility functions (not in main interface but available)
    getOrdersByDateRange,
    getOrdersByBusiness,
    getOrdersByAmountRange,
    getOrdersWithItems,
    getOrderStatistics,
  } as UseOrdersReturn & {
    getOrdersByDateRange: (startDate: Date, endDate: Date) => Order[];
    getOrdersByBusiness: (business: string) => Order[];
    getOrdersByAmountRange: (minAmount: number, maxAmount: number) => Order[];
    getOrdersWithItems: (itemName: string) => Order[];
    getOrderStatistics: () => {
      total: number;
      pending: number;
      processing: number;
      completed: number;
      cancelled: number;
      totalValue: number;
      averageOrderValue: number;
      thisMonthOrders: number;
      lastMonthOrders: number;
      thisMonthValue: number;
      lastMonthValue: number;
      monthlyGrowth: number;
    };
  };
};