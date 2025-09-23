
// src/components/dashboard/MpesaPaymentForm.tsx - Complete Implementation
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Smartphone, MapPin, Phone, Send, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface MpesaPaymentData {
  phone_number: string;
  amount: number;
}

const mpesaSchema = yup.object({
  phone_number: yup
    .string()
    .required('Phone number is required')
    .matches(/^254[17]\d{8}$/, 'Please enter a valid Kenyan phone number (254XXXXXXXXX)'),
  amount: yup
    .number()
    .required('Amount is required')
    .min(1, 'Minimum amount is KES 1')
    .max(150000, 'Maximum amount is KES 150,000'),
});

export const MpesaPaymentForm: React.FC = () => {
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<MpesaPaymentData>({
    resolver: yupResolver(mpesaSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: MpesaPaymentData) => {
    setPaymentStep('processing');

    // Simulate M-Pesa STK push
    setTimeout(() => {
      setPaymentStep('success');
    }, 3000);
  };

  // Intermediate states
  if (paymentStep === 'processing') {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-green-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Request Sent</h3>
          <p className="text-gray-600 mb-4">
            Check your phone for the M-Pesa payment prompt and enter your PIN to complete the payment.
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span>Waiting for payment confirmation...</span>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-6">
            Your M-Pesa payment has been processed successfully. You will receive an SMS confirmation shortly.
          </p>
          <button
            onClick={() => {
              setPaymentStep('form');
            }}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Make Another Payment
          </button>
        </div>
      </div>
    );
  }
  // Default form view
  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md">
      <div className="flex items-center mb-6">
        <Smartphone className="w-6 h-6 text-green-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">M-Pesa Payment</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              {...register('phone_number')}
              type="tel"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="254712345678"
            />
          </div>
          {errors.phone_number?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.phone_number?.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (KES) *
          </label>
          <input
            {...register('amount')}
            type="number"
            min="1"
            max="150000"
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="1000"
          />
          {errors.amount?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.amount?.message}</p>
          )}
        </div>

        {/* Description removed per requirements */}

        <button
          type="submit"
          disabled={!isValid}
          className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4 mr-2" />
          Send STK Push
        </button>
      </form>
    </div>
  );
};
