// src/components/dashboard/OrderCard.tsx - Complete Implementation
import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  DollarSign, 
  Package2, 
  Truck, 
  Eye,
  Download,
  MessageSquare,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Order } from '../../types/order';

interface OrderCardProps {
  order: Order;
  onViewDetails?: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Truck className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package2 className="w-4 h-4" />;
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending':
        return 25;
      case 'processing':
        return 75;
      case 'completed':
        return 100;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow border hover:shadow-md transition-all duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {getStatusIcon(order.status)}
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">{order.business}</h3>
                <p className="text-sm text-gray-600">Order #{order.id}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(order.amount, order.currency)}
              </p>
              <div className="flex items-center">
                {getStatusIcon(order.status)}
                <span className={`ml-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(order)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Order Progress</span>
            <span className="text-sm text-gray-600">{getProgressPercentage(order.status)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                order.status === 'completed' ? 'bg-green-500' :
                order.status === 'processing' ? 'bg-blue-500' :
                order.status === 'pending' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${getProgressPercentage(order.status)}%` }}
            />
          </div>
        </div>

        {/* Basic Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Ordered {formatDate(order.created_at)}</span>
          </div>
          
          {order.delivery_date && (
            <div className="flex items-center">
              <Truck className="w-4 h-4 mr-1" />
              <span>Delivery {formatDate(order.delivery_date)}</span>
            </div>
          )}

          <div className="flex items-center">
            <Package2 className="w-4 h-4 mr-1" />
            <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="border-t border-gray-200 pt-6 space-y-6">
            {/* Order Items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Package2 className="w-4 h-4 mr-2" />
                Order Items
              </h4>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{item.name}</h5>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.price, order.currency)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(item.price * item.quantity, order.currency)} total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Order Timeline
              </h4>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-800">Order Placed</p>
                    <p className="text-sm text-green-600">{formatDate(order.created_at)}</p>
                  </div>
                </div>

                {order.status !== 'pending' && (
                  <div className={`flex items-center p-3 rounded-lg ${
                    order.status === 'cancelled' ? 'bg-red-50' : 'bg-blue-50'
                  }`}>
                    {order.status === 'cancelled' ? (
                      <XCircle className="w-5 h-5 text-red-600 mr-3" />
                    ) : (
                      <Truck className="w-5 h-5 text-blue-600 mr-3" />
                    )}
                    <div>
                      <p className={`font-medium ${
                        order.status === 'cancelled' ? 'text-red-800' : 'text-blue-800'
                      }`}>
                        {order.status === 'cancelled' ? 'Order Cancelled' : 'Order Processing'}
                      </p>
                      <p className={`text-sm ${
                        order.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {formatDate(order.updated_at || order.created_at)}
                      </p>
                    </div>
                  </div>
                )}

                {order.status === 'completed' && (
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-800">Order Completed</p>
                      <p className="text-sm text-green-600">
                        {order.delivery_date ? formatDate(order.delivery_date) : 'Recently'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  {formatCurrency(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0), order.currency)}
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Tax & Fees</span>
                <span className="text-gray-900">
                  {formatCurrency(order.amount - order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0), order.currency)}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(order.amount, order.currency)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <button className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </button>
              
              <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </button>

              {order.status === 'processing' && (
                <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <MapPin className="w-4 h-4 mr-2" />
                  Track Order
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};