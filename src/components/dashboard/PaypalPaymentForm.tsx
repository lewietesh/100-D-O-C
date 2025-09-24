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
  // Keep latest amount in a ref so we don't need to re-render PayPal Buttons on change
  const amountRef = useRef<number>(0);
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

  // Load PayPal SDK with proper configuration for both PayPal and card payments
  const { isLoaded, isRejected, error: sdkError } = usePayPalScript({
    currency: 'USD',
    intent: 'capture',
    components: ['buttons', 'marks', 'card-fields'],
    enableFunding: ['card'],
    debug: process.env.NODE_ENV === 'development'
  });

  // Reference for PayPal button container
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  // Keep a reference to the Buttons instance to avoid multiple inits
  const buttonsInstanceRef = useRef<any>(null);

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
        amountRef.current = orderAmount;
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
    console.log('PayPal useEffect triggered:', { isLoaded, paymentState, amount, hasContainer: !!paypalButtonRef.current });

    // Only initialize buttons when SDK is loaded, we're in the IDLE state, and we have a valid amount.
    // Do not re-initialize if an instance already exists.
    if (isLoaded && paypalButtonRef.current && paymentState === PaymentState.IDLE && amount > 0 && !buttonsInstanceRef.current) {
      console.log('Initializing PayPal buttons with amount:', amount);

      // Clear the container first
      try { if (paypalButtonRef.current) paypalButtonRef.current.innerHTML = ''; } catch { }

      // Access the global PayPal object (some browsers set it slightly after load event)
      const initButtons = () => {
        if (!window.paypal) return false;
        console.log('PayPal SDK loaded successfully, creating buttons...');
        // Create PayPal buttons with proper funding configuration
        const instance = window.paypal.Buttons({
          // Style the buttons to show all funding sources
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay',
            tagline: false
          },

          // Note: We rely on SDK config (enable-funding=card) to surface card option

          // Set up the transaction
          createOrder: async () => {
            try {
              setPaymentState(PaymentState.CREATING_ORDER);

              // Validate amount
              const currentAmount = amountRef.current || amount;
              if (!currentAmount || currentAmount <= 0) {
                throw new Error('Please enter a valid amount');
              }

              // Generate a unique ID for this deposit
              const timestamp = new Date().getTime();
              const depositId = `deposit-${timestamp}`;
              setOrderId(depositId);

              // Create a PayPal order via our backend API
              const orderResult = await createPayPalOrder(
                depositId,
                currentAmount
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
            console.error('PayPal Button Error:', err);
            const errorMessage = typeof err === 'string' ? err :
              err?.message || err?.details?.[0]?.description ||
              'An error occurred during payment';
            setErrorMessage(errorMessage);
            setPaymentState(PaymentState.ERROR);
          }

        });

        buttonsInstanceRef.current = instance;

        instance.render(paypalButtonRef.current).catch((error: any) => {
          console.error('PayPal button render error:', error);
          const msg = String(error?.message || error);
          // If the container was re-rendered temporarily, avoid flipping to ERROR UI which removes the container
          if (msg.toLowerCase().includes('container element removed')) {
            // Soft recover: keep IDLE state and allow retry
            buttonsInstanceRef.current = null;
          } else {
            setErrorMessage('Failed to render PayPal buttons: ' + msg);
            setPaymentState(PaymentState.ERROR);
            buttonsInstanceRef.current = null;
          }
        });
        return true;
      };

      if (!initButtons()) {
        // Retry for a short window if window.paypal is not yet available
        console.warn('PayPal SDK not available on window object yet, will retry briefly');
        const start = Date.now();
        const retry = window.setInterval(() => {
          if (initButtons()) {
            window.clearInterval(retry);
          } else if (Date.now() - start > 4000) { // 4s timeout
            window.clearInterval(retry);
            setErrorMessage('PayPal SDK failed to initialize');
            setPaymentState(PaymentState.ERROR);
          }
        }, 100);

        return () => window.clearInterval(retry);
      }
    } else {
      console.log('PayPal buttons not rendered due to conditions:', {
        isLoaded,
        hasContainer: !!paypalButtonRef.current,
        paymentState,
        amount,
        validAmount: amount > 0
      });
    }
  }, [isLoaded, amount, paymentState]);

  // Cleanup PayPal Buttons on unmount
  useEffect(() => {
    return () => {
      try { buttonsInstanceRef.current?.close?.(); } catch { }
      buttonsInstanceRef.current = null;
    };
  }, []);

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
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                const safe = isNaN(v) ? 0 : v;
                setAmount(safe);
                amountRef.current = safe;
              }}
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
          {/* Show loading states */}
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

          {/* Show message when amount is not entered */}
          {paymentState === PaymentState.IDLE && (!amount || amount <= 0) && !isRejected && (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <DollarSign className="w-12 h-12 mb-3" />
              <p className="text-sm">Enter an amount above to see PayPal payment options</p>
            </div>
          )}

          {/* Show PayPal SDK loading error */}
          {isRejected && (
            <div className="flex flex-col items-center justify-center text-red-500">
              <AlertTriangle className="w-12 h-12 mb-3" />
              <p className="text-sm text-center">PayPal payment unavailable</p>
              {sdkError && <p className="text-xs text-center mt-1">{sdkError.message}</p>}
            </div>
          )}

          {/* PayPal buttons will be rendered here by the SDK when amount > 0 */}
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
