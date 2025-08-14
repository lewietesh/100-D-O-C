// src/components/dashboard/PaypalPaymentForm.tsx - Complete Implementation
import React, { useState } from 'react';
import { DollarSign, ExternalLink, Shield, CheckCircle, AlertTriangle, Globe, CreditCard } from 'lucide-react';

export const PaypalPaymentForm: React.FC = () => {
  const [showComingSoon, setShowComingSoon] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">PP</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">PayPal Payment</h3>
      </div>

      {showComingSoon ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-blue-600" />
          </div>
          
          <h4 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h4>
          <p className="text-gray-600 mb-6">
            PayPal integration is currently under development. You'll be able to make secure payments with your PayPal account soon.
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-center text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>Secure PayPal checkout</span>
            </div>
            <div className="flex items-center justify-center text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>Pay with PayPal balance or linked cards</span>
            </div>
            <div className="flex items-center justify-center text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>PayPal Buyer Protection included</span>
            </div>
            <div className="flex items-center justify-center text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>No additional fees for PayPal payments</span>
            </div>
          </div>
        </div>
      ) : (
        // This would be the actual PayPal integration
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                step="0.01"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What is this payment for?"
            />
          </div>

          {/* PayPal Button Placeholder */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">PP</span>
            </div>
            <p className="text-gray-600">PayPal Button SDK integration would appear here</p>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Globe className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <p className="text-blue-800 text-sm">
              <strong>Global Payment Support:</strong> PayPal will support payments in 200+ countries and 25+ currencies when available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
