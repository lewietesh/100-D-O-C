// src/components/dashboard/PaymentsDashboard.tsx - Complete V3 Implementation
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  History, 
  Plus, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  TrendingUp,
  Calendar,
  Filter
} from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';
import { StripePaymentForm } from './StripePaymentForm';
import { PaypalPaymentForm } from './PaypalPaymentForm';
import { MpesaPaymentForm } from './MpesaPaymentForm';
import { CashPaymentRecordForm } from './CashPaymentRecordForm';
import { PaymentHistory } from './PaymentHistory';

type PaymentTab = 'history' | 'stripe' | 'paypal' | 'mpesa' | 'cash' | 'analytics';

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
  
  const { payments, loading, error, refetch } = usePayments();

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
    { id: 'analytics' as PaymentTab, label: 'Analytics', icon: TrendingUp },
    { id: 'stripe' as PaymentTab, label: 'Credit Card', icon: CreditCard },
    { id: 'paypal' as PaymentTab, label: 'PayPal', icon: DollarSign },
    { id: 'mpesa' as PaymentTab, label: 'M-Pesa', icon: DollarSign },
    { id: 'cash' as PaymentTab, label: 'Cash', icon: DollarSign },
  ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    changeType?: 'increase' | 'decrease';
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = ({ title, value, change, changeType, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <p className={`text-sm flex items-center mt-1 ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${
                changeType === 'decrease' ? 'rotate-180' : ''
              }`} />
              {change > 0 ? '+' : ''}{change.toFixed(1)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const AnalyticsTab: React.FC = () => {
    if (!stats) {
      return (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No analytics data available yet</p>
        </div>
      );
    }

    const monthlyChange = stats.last_month_total > 0 
      ? ((stats.this_month_total - stats.last_month_total) / stats.last_month_total) * 100
      : 0;

    return (
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${stats.total_amount.toFixed(2)}`}
            icon={DollarSign}
            color="bg-green-500"
          />
          <StatCard
            title="Total Transactions"
            value={stats.total_transactions}
            icon={CreditCard}
            color="bg-blue-500"
          />
          <StatCard
            title="Success Rate"
            value={`${((stats.successful_payments / stats.total_transactions) * 100).toFixed(1)}%`}
            icon={CheckCircle}
            color="bg-emerald-500"
          />
          <StatCard
            title="This Month"
            value={`$${stats.this_month_total.toFixed(2)}`}
            change={monthlyChange}
            changeType={monthlyChange >= 0 ? 'increase' : 'decrease'}
            icon={Calendar}
            color="bg-purple-500"
          />
        </div>

        {/* Payment Status Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.successful_payments}</div>
              <div className="text-sm text-green-800">Successful</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending_payments}</div>
              <div className="text-sm text-yellow-800">Pending</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.failed_payments}</div>
              <div className="text-sm text-red-800">Failed</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'history':
        return <PaymentHistory payments={payments} loading={loading} />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'stripe':
        return <StripePaymentForm />;
      case 'paypal':
        return <PaypalPaymentForm />;
      case 'mpesa':
        return <MpesaPaymentForm />;
      case 'cash':
        return <CashPaymentRecordForm />;
      default:
        return <PaymentHistory payments={payments} loading={loading} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`rounded-lg p-4 ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : notification.type === 'error'
            ? 'bg-red-50 border border-red-200'
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              ) : notification.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              ) : (
                <AlertCircle className="w-5 h-5 text-blue-600 mr-3" />
              )}
              <p className={`font-medium ${
                notification.type === 'success' ? 'text-green-800' 
                : notification.type === 'error' ? 'text-red-800'
                : 'text-blue-800'
              }`}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className={`${
                notification.type === 'success' ? 'text-green-600' 
                : notification.type === 'error' ? 'text-red-600'
                : 'text-blue-600'
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
          <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
          <p className="text-gray-600 mt-1">Manage your payments and view transaction history</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {activeTab === 'history' && stats && (
            <div className="hidden md:flex items-center text-sm text-gray-600">
              <DollarSign className="w-4 h-4 mr-1" />
              {payments.length} transactions • ${stats.total_amount.toFixed(2)} total
            </div>
          )}
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-3 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error Loading Payments</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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