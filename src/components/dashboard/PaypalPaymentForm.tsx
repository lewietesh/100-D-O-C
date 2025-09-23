// src/components/dashboard/PaypalPaymentForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, Shield, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';
import usePayPalScript from '@/hooks/usePayPalScript';
import { useOrders } from '@/hooks/useOrders';
import { AccountBalance } from '@/types/payment';

enum PaymentState {
  IDLE = 'idle',
  LOADING = 'loading',
  CREATING_ORDER = 'creating_order',
  AWAITING_APPROVAL = 'awaiting_approval',
  CAPTURING_PAYMENT = 'capturing_payment',
  SUCCESS = 'success',
  ERROR = 'error'
}

export const PaypalPaymentForm: React.FC = () => {
  // Form state
  const [amount, setAmount] = useState<number>(0);
  const [orderId, setOrderId] = useState<string>('');
  const [paypalOrderId, setPaypalOrderId] = useState<string>('');
  const [paymentState, setPaymentState] = useState<PaymentState>(PaymentState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  // Always update balance - simplified UX
  const updateBalance = true;
  const [balanceUpdated, setBalanceUpdated] = useState<AccountBalance | null>(null);

  // Get orders and payment hooks
  const { orders, selectedOrder, selectOrder } = useOrders();
  const {
    createPayPalOrder,
    capturePayPalPayment,
    accountBalance,
    error: paymentError,
    getAccountBalance
  } = usePayments();

  // Load PayPal SDK
  const { isLoaded, isRejected, error: sdkError } = usePayPalScript({
    currency: 'USD',
    intent: 'capture',
    components: ['buttons', 'marks']
  });

  // Reference for PayPal button container
  const paypalButtonRef = useRef<HTMLDivElement>(null);

  // Set order ID and amount if selected order exists
  useEffect(() => {
    if (selectedOrder) {
      setOrderId(selectedOrder.id);
      // Check if there's an outstanding amount
      const orderAmount = typeof selectedOrder.total_amount === 'string'
        ? parseFloat(selectedOrder.total_amount)
        : selectedOrder.total_amount;

      if (orderAmount > 0) {
        setAmount(orderAmount);
      }
    }
  }, [selectedOrder]);

  // We no longer fetch balance explicitly here to keep the flow simple

  // Handle PayPal SDK errors
  useEffect(() => {
    if (isRejected && sdkError) {
      setErrorMessage(`Failed to load PayPal SDK: ${sdkError.message}`);
      setPaymentState(PaymentState.ERROR);
    }
  }, [isRejected, sdkError]);

  // Handle payment errors
  useEffect(() => {
    if (paymentError) {
      setErrorMessage(paymentError);
      setPaymentState(PaymentState.ERROR);
    }
  }, [paymentError]);

  // Render PayPal buttons when SDK is loaded
  useEffect(() => {
    // Only initialize buttons when SDK is loaded and we're in the IDLE state
    if (isLoaded && paypalButtonRef.current && paymentState === PaymentState.IDLE) {
      // Clear the container first
      paypalButtonRef.current.innerHTML = '';

      // Access the global PayPal object
      if (window.paypal) {
        // Create PayPal buttons
        window.paypal.Buttons({
          // Style the buttons
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay'
          },

          // Set up the transaction
          createOrder: async () => {
            try {
              setPaymentState(PaymentState.CREATING_ORDER);

              // Validate amount
              if (!amount || amount <= 0) {
                throw new Error('Please enter a valid amount');
              }

              // Generate a unique ID for this deposit
              const timestamp = new Date().getTime();
              const depositId = `deposit-${timestamp}`;
              setOrderId(depositId);

              // Create a PayPal order via our backend API
              const orderResult = await createPayPalOrder(
                depositId,
                amount
              );

              if (!orderResult) {
                throw new Error('Failed to create PayPal order');
              }

              // Store the PayPal order ID
              setPaypalOrderId(orderResult.paypal_order_id);
              setPaymentState(PaymentState.AWAITING_APPROVAL);

              // Return the PayPal order ID
              return orderResult.paypal_order_id;

            } catch (error: any) {
              setErrorMessage(error.message || 'Failed to create order');
              setPaymentState(PaymentState.ERROR);
              throw error;
            }
          },

          // Handle the approval
          onApprove: async (data: any) => {
            try {
              setPaymentState(PaymentState.CAPTURING_PAYMENT);

              // Capture the funds from the transaction
              const result = await capturePayPalPayment(data.orderID, updateBalance);

              if (result && result.success) {
                setSuccessMessage('Payment successful! Your account balance has been updated.');

                // If account balance was updated, fetch the latest balance
                if (updateBalance && result.balance) {
                  setBalanceUpdated(result.balance);
                } else if (updateBalance) {
                  // Fetch the latest account balance if not included in response
                  try {
                    const balance = await getAccountBalance();
                    if (balance) {
                      setBalanceUpdated(balance);
                    }
                  } catch (balanceErr) {
                    console.error("Could not fetch updated balance:", balanceErr);
                  }
                }

                setPaymentState(PaymentState.SUCCESS);
              } else {
                throw new Error('Failed to capture payment');
              }

            } catch (error: any) {
              setErrorMessage(error.message || 'Payment failed');
              setPaymentState(PaymentState.ERROR);
            }
          },

          // Handle cancellation
          onCancel: () => {
            setPaymentState(PaymentState.IDLE);
          },

          // Handle errors
          onError: (err: any) => {
            setErrorMessage(err.message || 'An error occurred during payment');
            setPaymentState(PaymentState.ERROR);
          }

        }).render(paypalButtonRef.current);
      }
    }
  }, [isLoaded, orderId, amount, createPayPalOrder, capturePayPalPayment, paymentState]);

  // Reset error state
  const resetError = () => {
    setErrorMessage('');
    setPaymentState(PaymentState.IDLE);
  };

  // Reset success state
  const resetSuccess = () => {
    setSuccessMessage('');
    setPaymentState(PaymentState.IDLE);
    // Reset form
    setAmount(0);
    // no description field
  };

  // Show loading state when SDK is loading
  if (!isLoaded && paymentState !== PaymentState.ERROR) {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">PP</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">PayPal Payment</h3>
        </div>

        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading PayPal payment system...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (paymentState === PaymentState.ERROR) {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center mr-3">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Payment Error</h3>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <p className="text-red-800 text-sm">{errorMessage}</p>
          </div>
        </div>

        <button
          onClick={resetError}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show success state
  if (paymentState === PaymentState.SUCCESS) {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center mr-3">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Payment Successful</h3>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        </div>

        {balanceUpdated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <DollarSign className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <p className="text-blue-800 text-sm font-medium">Account Balance Updated</p>
                <p className="text-blue-700 text-sm mt-1">
                  Available: {balanceUpdated.currency} {balanceUpdated.available.toFixed(2)}
                </p>
                {balanceUpdated.pending > 0 && (
                  <p className="text-blue-600 text-xs mt-1">
                    Pending: {balanceUpdated.currency} {balanceUpdated.pending.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={resetSuccess}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Make Another Payment
        </button>
      </div>
    );
  }

  // Normal payment form
  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">PP</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">PayPal Payment</h3>
      </div>

      {/* Account Balance Display (optional) */}
      {balanceUpdated && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-blue-800 text-sm">Your Account Balance</h4>
            {/* Balance auto-refresh handled elsewhere */}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Available:</span>
            <span className="font-semibold text-blue-700">
              {balanceUpdated.currency} {balanceUpdated.available.toFixed(2)}
            </span>
          </div>
          {balanceUpdated.pending > 0 && (
            <div className="flex justify-between mt-1">
              <span className="text-gray-600 text-sm">Pending:</span>
              <span className="font-medium text-blue-600">
                {balanceUpdated.currency} {balanceUpdated.pending.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-6">
        {/* Info message about account balance */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <p className="text-sm text-blue-700">
              Add funds to your account balance to use for future payments. The amount will be credited to your account immediately after payment.
            </p>
          </div>
        </div>

        {/* Amount input */}
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
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              disabled={paymentState !== PaymentState.IDLE}
            />
          </div>
        </div>

        {/* Description removed per requirements */}

        {/* Hidden field - we always update the account balance */}
        <input type="hidden" value="true" />

        {/* PayPal Button Container */}
        <div
          ref={paypalButtonRef}
          className={`min-h-[150px] flex items-center justify-center ${paymentState === PaymentState.CREATING_ORDER ||
            paymentState === PaymentState.AWAITING_APPROVAL ||
            paymentState === PaymentState.CAPTURING_PAYMENT
            ? 'opacity-50 pointer-events-none'
            : ''
            }`}
        >
          {/* PayPal buttons will be rendered here by the SDK */}
          {(paymentState === PaymentState.CREATING_ORDER ||
            paymentState === PaymentState.AWAITING_APPROVAL ||
            paymentState === PaymentState.CAPTURING_PAYMENT) && (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                <p className="text-sm text-gray-600">
                  {paymentState === PaymentState.CREATING_ORDER && 'Creating payment...'}
                  {paymentState === PaymentState.AWAITING_APPROVAL && 'Awaiting your approval...'}
                  {paymentState === PaymentState.CAPTURING_PAYMENT && 'Processing payment...'}
                </p>
              </div>
            )}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <p className="text-blue-800 text-sm">
              <strong>Secure Payment:</strong> PayPal securely processes your payment. Your financial details are never shared with sellers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
