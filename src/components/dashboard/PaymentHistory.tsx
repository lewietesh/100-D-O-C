// src/components/dashboard/PaymentHistory.tsx - Complete Implementation
import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Download,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
import { Payment } from '../../types/payment';

interface PaymentHistoryProps {
  payments: Payment[];
  loading: boolean;
}

type PaymentSortField = 'created_at' | 'amount' | 'status' | 'method';
type SortDirection = 'asc' | 'desc';

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<PaymentSortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const toNumber = (value: unknown): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const n = parseFloat(value);
      return isNaN(n) ? 0 : n;
    }
    return 0;
  };

  const formatCurrency = (value: unknown): string => {
    const n = toNumber(value);
    return `$${n.toFixed(2)}`;
  };

  // Filter and sort payments
  const filteredAndSortedPayments = useMemo(() => {
    let filtered = payments;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Apply method filter
    if (methodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.method === methodFilter);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortField === 'amount') {
        aValue = toNumber(aValue);
        bValue = toNumber(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [payments, searchTerm, statusFilter, methodFilter, sortField, sortDirection]);

  // Payment statistics
  const stats = useMemo(() => {
    const total = payments.length;
    const completed = payments.filter(p => p.status === 'completed').length;
    const pending = payments.filter(p => p.status === 'pending').length;
    const failed = payments.filter(p => p.status === 'failed').length;
    const totalAmount = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + toNumber((p as any).amount), 0);

    return { total, completed, pending, failed, totalAmount };
  }, [payments]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'stripe':
        return <CreditCard className="w-4 h-4" />;
      case 'paypal':
        return '🅿️';
      case 'mpesa':
        return '📱';
      case 'cash':
        return '💵';
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'stripe':
        return 'bg-blue-100 text-blue-800';
      case 'paypal':
        return 'bg-blue-100 text-blue-800';
      case 'mpesa':
        return 'bg-green-100 text-green-800';
      case 'cash':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSort = (field: PaymentSortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setMethodFilter('all');
    setSortField('created_at');
    setSortDirection('desc');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-5 w-48 bg-gray-200 rounded" />
                <div className="h-5 w-20 bg-gray-200 rounded" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
        <p className="text-gray-600">Your payment history will appear here once you make a payment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-gray-600 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Export Button */}
          <button className="flex items-center px-4 py-2 text-gray-600 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Method</label>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Methods</option>
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                  <option value="mpesa">M-Pesa</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>
          Showing {filteredAndSortedPayments.length} of {payments.length} payments
        </p>

        <div className="flex items-center space-x-2">
          <span>Sort by:</span>
          <button
            onClick={() => handleSort('created_at')}
            className={`flex items-center px-2 py-1 rounded ${sortField === 'created_at' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            Date
            {sortField === 'created_at' && (
              <ArrowUpDown className={`w-3 h-3 ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
          <button
            onClick={() => handleSort('amount')}
            className={`flex items-center px-2 py-1 rounded ${sortField === 'amount' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            Amount
            {sortField === 'amount' && (
              <ArrowUpDown className={`w-3 h-3 ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
          <button
            onClick={() => handleSort('status')}
            className={`flex items-center px-2 py-1 rounded ${sortField === 'status' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            Status
            {sortField === 'status' && (
              <ArrowUpDown className={`w-3 h-3 ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
        </div>
      </div>

      {/* Payments List */}
      {filteredAndSortedPayments.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedPayments.map((payment) => (
            <div key={payment.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {getMethodIcon(payment.method)}
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">
                          {payment.description || 'Payment'}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(payment.method)}`}>
                            {payment.method.toUpperCase()}
                          </span>
                          <span className="mx-2">•</span>
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{new Date(payment.created_at).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span className="text-xs text-gray-500">#{payment.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency((payment as any).amount)}
                      </p>
                      {payment.reference && (
                        <p className="text-xs text-gray-500">Ref: {payment.reference}</p>
                      )}
                    </div>

                    <div className="flex items-center">
                      {getStatusIcon(payment.status)}
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        title="Download receipt"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <div className="relative">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Details (expandable) */}
                {selectedPayment?.id === payment.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">Payment ID</p>
                        <p className="text-gray-900">{payment.id}</p>
                      </div>

                      <div>
                        <p className="text-gray-600 font-medium">Date & Time</p>
                        <p className="text-gray-900">
                          {new Date(payment.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600 font-medium">Payment Method</p>
                        <div className="flex items-center">
                          {getMethodIcon(payment.method)}
                          <span className="ml-2 text-gray-900 capitalize">
                            {payment.method.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-600 font-medium">Status</p>
                        <div className="flex items-center">
                          {getStatusIcon(payment.status)}
                          <span className="ml-2 text-gray-900 capitalize">{payment.status}</span>
                        </div>
                      </div>
                    </div>

                    {payment.reference && (
                      <div className="mt-4">
                        <p className="text-gray-600 font-medium text-sm">Reference Number</p>
                        <p className="text-gray-900 font-mono text-sm">{payment.reference}</p>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedPayment(null)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Hide Details
                      </button>

                      <div className="flex items-center space-x-3">
                        <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                          <Download className="w-4 h-4 mr-1" />
                          Download Receipt
                        </button>

                        {payment.reference && (
                          <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View Transaction
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button (for pagination) */}
      {filteredAndSortedPayments.length > 0 && (
        <div className="text-center">
          <button className="flex items-center mx-auto px-6 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Load More Payments
          </button>
        </div>
      )}
    </div>
  );
};