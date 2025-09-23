// src/components/dashboard/PaymentsDashboard.tsx - Complete V3 Implementation
import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  History,
  Plus,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Calendar,
  Filter,
  ArrowUp
} from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';
import { useUserProfile } from '@/hooks/useUserprofile';
import { PaypalPaymentForm } from './PaypalPaymentForm';
import { MpesaPaymentForm } from './MpesaPaymentForm';
import { PaymentHistory } from './PaymentHistory';
import { AccountBalanceCard } from './AccountBalanceCard';
import { AccountBalance } from '@/types/payment';

type PaymentTab = 'history' | 'paypal' | 'mpesa';

interface PaymentStats {
  total_amount: number;
  total_transactions: number;
  successful_payments: number;
  pending_payments: number;
  failed_payments: number;
  this_month_total: number;
  last_month_total: number;
}

export const PaymentsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('history');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { payments, loading, error, refetch, accountBalance } = usePayments();
  const { profile: user, refetch: refetchUser } = useUserProfile();

  // Calculate stats from payments
  useEffect(() => {
    if (payments.length > 0) {
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const totalAmount = payments.reduce((sum, payment) =>
        payment.status === 'completed' ? sum + payment.amount : sum, 0
      );

      const thisMonthPayments = payments.filter(payment =>
        new Date(payment.created_at) >= thisMonth
      );

      const lastMonthPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.created_at);
        return paymentDate >= lastMonth && paymentDate <= lastMonthEnd;
      });

      const thisMonthTotal = thisMonthPayments.reduce((sum, payment) =>
        payment.status === 'completed' ? sum + payment.amount : sum, 0
      );

      const lastMonthTotal = lastMonthPayments.reduce((sum, payment) =>
        payment.status === 'completed' ? sum + payment.amount : sum, 0
      );

      setStats({
        total_amount: totalAmount,
        total_transactions: payments.length,
        successful_payments: payments.filter(p => p.status === 'completed').length,
        pending_payments: payments.filter(p => p.status === 'pending').length,
        failed_payments: payments.filter(p => p.status === 'failed').length,
        this_month_total: thisMonthTotal,
        last_month_total: lastMonthTotal,
      });
    }
  }, [payments]);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      setNotification({
        type: 'success',
        message: 'Payment data refreshed successfully!'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to refresh payment data'
      });
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'history' as PaymentTab, label: 'Payment History', icon: History },
    { id: 'paypal' as PaymentTab, label: 'PayPal', icon: DollarSign },
    { id: 'mpesa' as PaymentTab, label: 'M-Pesa', icon: DollarSign },
  ];

  // Handle account balance refresh
  const handleBalanceRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchUser();
      setNotification({
        type: 'success',
        message: 'Account balance updated successfully!'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to refresh account balance'
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Convert user account balance to AccountBalance object
  const getUserAccountBalance = (): AccountBalance | null => {
    if (!user?.account_balance) return null;

    const balance = typeof user.account_balance === 'string'
      ? parseFloat(user.account_balance)
      : user.account_balance;

    return {
      available: balance,
      pending: 0,
      currency: 'USD', // Default currency - could be made configurable
      last_updated: new Date().toISOString()
    };
  };

  // AnalyticsTab component has been removed

  const renderTabContent = () => {
    switch (activeTab) {
      case 'history':
        return <PaymentHistory payments={payments} loading={loading} />;
      case 'paypal':
        return <PaypalPaymentForm />;
      case 'mpesa':
        return <MpesaPaymentForm />;
      default:
        return <PaymentHistory payments={payments} loading={loading} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`rounded-lg p-4 shadow-sm ${notification.type === 'success'
          ? 'bg-success-50 border border-success-200'
          : notification.type === 'error'
            ? 'bg-error-50 border border-error-200'
            : 'bg-primary-50 border border-primary-200'
          }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-success-600 mr-3" />
              ) : notification.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-error-600 mr-3" />
              ) : (
                <AlertCircle className="w-5 h-5 text-primary-600 mr-3" />
              )}
              <p className={`font-medium ${notification.type === 'success' ? 'text-success-800'
                : notification.type === 'error' ? 'text-error-800'
                  : 'text-primary-800'
                }`}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className={`transition-opacity ${notification.type === 'success' ? 'text-success-600 hover:text-success-700'
                : notification.type === 'error' ? 'text-error-600 hover:text-error-700'
                  : 'text-primary-600 hover:text-primary-700'
                } hover:opacity-75`}
            >
              <Plus className="w-4 h-4 rotate-45" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Payments</h2>
          <p className="text-neutral-600 mt-1">Manage your payments and view transaction history</p>
        </div>

        <div className="flex items-center space-x-3">
          {activeTab === 'history' && stats && (
            <div className="hidden md:flex items-center text-sm text-neutral-600 bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-200">
              <DollarSign className="w-4 h-4 mr-1 text-neutral-500" />
              <span className="font-medium">{payments.length}</span> transactions •
              <span className="font-semibold text-neutral-700 ml-1">${stats.total_amount.toFixed(2)}</span> total
            </div>
          )}

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 hover:border-neutral-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* Account Balance Card */}
      <div className="max-w-sm relative z-10">
        <AccountBalanceCard
          accountBalance={getUserAccountBalance()}
          loading={refreshing}
          onRefresh={handleBalanceRefresh}
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-error-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-error-800">Error Loading Payments</h3>
              <p className="text-sm text-error-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
};