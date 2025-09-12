// src/hooks/useOrders.ts - Enhanced with real-time data and backend integration
import { useState, useEffect, useCallback, useRef } from 'react';
import { ordersApi } from '@/app/api/orders';
import { Order } from '../types/order';
import { useAuth } from './useAuth';

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  selectedOrder: Order | null;
  selectOrder: (order: Order) => void;
  clearSelectedOrder: () => void;
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const clearError = useCallback(() => setError(null), []);

  const selectOrder = useCallback((order: Order) => {
    setSelectedOrder(order);
  }, []);

  const clearSelectedOrder = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await ordersApi.getUserOrders();
      const data = response.results; // Extract orders from paginated response

      if (!mountedRef.current) return;

      // Sort orders by creation date (newest first)
      const sortedOrders = data.sort((a, b) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
      );

      setOrders(sortedOrders);
    } catch (err: any) {
      if (!mountedRef.current) return;

      let errorMessage = 'Failed to load orders';

      if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Please check your permissions.';
      } else if (err.response?.status === 404) {
        errorMessage = 'No orders found.';
        setOrders([]); // Clear orders on 404
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [isAuthenticated, user]);

  const getOrder = useCallback(async (id: string): Promise<Order | null> => {
    try {
      setError(null);

      if (!id || id.trim() === '') {
        throw new Error('Order ID is required');
      }

      const order = await ordersApi.getOrder(id);

      if (!mountedRef.current) return order;

      // Update the order in the local state if it exists
      setOrders(prev => prev.map(o => o.id === id ? order : o));

      return order;
    } catch (err: any) {
      if (!mountedRef.current) return null;

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
    setLoading(true);
    await fetchOrders();
  }, [fetchOrders]);

  // Start real-time polling
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Poll every 30 seconds for real-time updates
    pollingIntervalRef.current = setInterval(() => {
      if (isAuthenticated && user && mountedRef.current) {
        fetchOrders();
      }
    }, 30000);
  }, [fetchOrders, isAuthenticated, user]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Utility functions for filtering and analyzing orders
  const getOrderById = useCallback((id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  }, [orders]);

  const getOrdersByStatus = useCallback((status: Order['status']): Order[] => {
    return orders.filter(order => order.status === status);
  }, [orders]);

  const getTotalOrderValue = useCallback((): number => {
    return orders.reduce((total, order) => total + parseFloat(order.total_amount.toString()), 0);
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

  // Additional utility functions updated for new Order structure
  const getOrdersByDateRange = useCallback((startDate: Date, endDate: Date): Order[] => {
    return orders.filter(order => {
      const orderDate = new Date(order.date_created);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }, [orders]);

  const getOrdersByService = useCallback((serviceName: string): Order[] => {
    return orders.filter(order =>
      order.service_name?.toLowerCase().includes(serviceName.toLowerCase())
    );
  }, [orders]);

  const getOrdersByAmountRange = useCallback((minAmount: number, maxAmount: number): Order[] => {
    return orders.filter(order => {
      const amount = parseFloat(order.total_amount.toString());
      return amount >= minAmount && amount <= maxAmount;
    });
  }, [orders]);

  const getOrderStatistics = useCallback(() => {
    const total = orders.length;
    const pending = getOrdersByStatus('pending').length;
    const confirmed = getOrdersByStatus('confirmed').length;
    const in_progress = getOrdersByStatus('in_progress').length;
    const completed = getOrdersByStatus('completed').length;
    const cancelled = getOrdersByStatus('cancelled').length;
    const refunded = getOrdersByStatus('refunded').length;
    const totalValue = getTotalOrderValue();
    const averageOrderValue = total > 0 ? totalValue / total : 0;

    // Calculate monthly statistics
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthOrders = getOrdersByDateRange(thisMonth, now);
    const lastMonthOrders = getOrdersByDateRange(lastMonth, lastMonthEnd);

    const thisMonthValue = thisMonthOrders.reduce((sum, order) => sum + parseFloat(order.total_amount.toString()), 0);
    const lastMonthValue = lastMonthOrders.reduce((sum, order) => sum + parseFloat(order.total_amount.toString()), 0);

    const monthlyGrowth = lastMonthValue > 0
      ? ((thisMonthValue - lastMonthValue) / lastMonthValue) * 100
      : 0;

    return {
      total,
      pending,
      confirmed,
      in_progress,
      completed,
      cancelled,
      refunded,
      totalValue,
      averageOrderValue,
      thisMonthOrders: thisMonthOrders.length,
      lastMonthOrders: lastMonthOrders.length,
      thisMonthValue,
      lastMonthValue,
      monthlyGrowth,
    };
  }, [orders, getOrdersByStatus, getTotalOrderValue, getOrdersByDateRange]);

  // Effect for initial fetch and polling management
  useEffect(() => {
    mountedRef.current = true;

    if (isAuthenticated && user) {
      fetchOrders();
      startPolling();
    } else {
      setOrders([]);
      setLoading(false);
      stopPolling();
    }

    return () => {
      mountedRef.current = false;
      stopPolling();
    };
  }, [isAuthenticated, user, fetchOrders, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    orders,
    loading,
    error,
    selectedOrder,
    selectOrder,
    clearSelectedOrder,
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
    getOrdersByService,
    getOrdersByAmountRange,
    getOrderStatistics,
  } as UseOrdersReturn & {
    getOrdersByDateRange: (startDate: Date, endDate: Date) => Order[];
    getOrdersByService: (serviceName: string) => Order[];
    getOrdersByAmountRange: (minAmount: number, maxAmount: number) => Order[];
    getOrderStatistics: () => {
      total: number;
      pending: number;
      confirmed: number;
      in_progress: number;
      completed: number;
      cancelled: number;
      refunded: number;
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