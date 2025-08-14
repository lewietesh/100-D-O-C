// src/components/dashboard/CashPaymentRecordForm.tsx - Complete Implementation
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
          DollarSign,
          Receipt,
          Save,
          FileText,
          Calendar,
          AlertTriangle,
          CheckCircle,
          Upload,
          X
} from 'lucide-react';
import { usePayments } from '../../hooks/usePayments';


// Align with schema: make all fields required, but allow notes/reference to be optional or empty string
export type CashPaymentData = {
          amount: number;
          reference?: string;
          description: string;
          payment_date: string;
          received_from: string;
          payment_method: 'cash' | 'bank_transfer' | 'check' | 'money_order';
          notes?: string;
};

const cashPaymentSchema: yup.ObjectSchema<CashPaymentData> = yup.object({
          amount: yup
                    .number()
                    .required('Amount is required')
                    .min(0.01, 'Amount must be greater than 0')
                    .max(999999.99, 'Maximum amount is $999,999.99'),
          reference: yup
                    .string()
                    .min(3, 'Reference must be at least 3 characters')
                    .max(50, 'Reference must be less than 50 characters')
                    .optional(),
          description: yup
                    .string()
                    .required('Description is required')
                    .min(5, 'Description must be at least 5 characters')
                    .max(200, 'Description must be less than 200 characters'),
          payment_date: yup
                    .string()
                    .required('Payment date is required'),
          received_from: yup
                    .string()
                    .required('Payer name is required')
                    .min(2, 'Name must be at least 2 characters'),
          payment_method: yup
                    .string()
                    .oneOf(['cash', 'bank_transfer', 'check', 'money_order'])
                    .required('Payment method is required'),
          notes: yup
                    .string()
                    .max(500, 'Notes must be less than 500 characters')
                    .optional(),
});

export const CashPaymentRecordForm: React.FC = () => {
          const [isSubmitting, setIsSubmitting] = useState(false);
          const [submitSuccess, setSubmitSuccess] = useState(false);
          const [attachments, setAttachments] = useState<File[]>([]);

          const { recordCashPayment } = usePayments();

          const {
                    register,
                    handleSubmit,
                    formState: { errors, isValid },
                    reset,
                    watch,
          } = useForm<CashPaymentData>({
                    resolver: yupResolver(cashPaymentSchema) as any, // type workaround for resolver
                    defaultValues: {
                              payment_date: new Date().toISOString().split('T')[0],
                              payment_method: 'cash',
                    },
                    mode: 'onChange',
          });

          const watchedAmount = watch('amount');
          const watchedMethod = watch('payment_method');

          const onSubmit: import('react-hook-form').SubmitHandler<CashPaymentData> = async (data) => {
                    try {
                              setIsSubmitting(true);

                              const description = `${data.description} | From: ${data.received_from} | Method: ${data.payment_method.replace('_', ' ')}${data.notes ? ` | Notes: ${data.notes}` : ''}`;

                              const success = await recordCashPayment(
                                        data.amount,
                                        description,
                                        data.reference || undefined
                              );

                              if (success) {
                                        setSubmitSuccess(true);
                                        reset();
                                        setAttachments([]);
                                        setTimeout(() => setSubmitSuccess(false), 5000);
                              }
                    } catch (error) {
                              console.error('Failed to record payment:', error);
                    } finally {
                              setIsSubmitting(false);
                    }
          };

          const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const files = Array.from(e.target.files || []);
                    setAttachments(prev => [...prev, ...files]);
          };

          const removeAttachment = (index: number) => {
                    setAttachments(prev => prev.filter((_, i) => i !== index));
          };

          const getMethodIcon = (method: string) => {
                    switch (method) {
                              case 'bank_transfer':
                                        return '🏦';
                              case 'check':
                                        return '📝';
                              case 'money_order':
                                        return '💰';
                              default:
                                        return '💵';
                    }
          };

          if (submitSuccess) {
                    return (
                              <div className="bg-white rounded-lg shadow p-6 max-w-md">
                                        <div className="text-center">
                                                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <CheckCircle className="w-8 h-8 text-green-600" />
                                                  </div>
                                                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Recorded!</h3>
                                                  <p className="text-gray-600 mb-6">
                                                            The cash payment has been successfully recorded in your payment history.
                                                  </p>
                                                  <button
                                                            onClick={() => setSubmitSuccess(false)}
                                                            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                                                  >
                                                            Record Another Payment
                                                  </button>
                                        </div>
                              </div>
                    );
          }

          return (
                    <div className="bg-white rounded-lg shadow p-6 max-w-md">
                              <div className="flex items-center mb-6">
                                        <Receipt className="w-6 h-6 text-green-600 mr-3" />
                                        <h3 className="text-lg font-semibold text-gray-900">Record Cash Payment</h3>
                              </div>

                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-start">
                                                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
                                                  <div>
                                                            <p className="text-amber-800 text-sm">
                                                                      <strong>Manual Entry:</strong> Use this form to record payments received outside the system (cash, bank transfers, checks, etc.) for your records.
                                                            </p>
                                                  </div>
                                        </div>
                              </div>

                              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        {/* Amount */}
                                        <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Amount (USD) *
                                                  </label>
                                                  <div className="relative">
                                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                            <input
                                                                      {...register('amount')}
                                                                      type="number"
                                                                      step="0.01"
                                                                      min="0.01"
                                                                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                                      placeholder="0.00"
                                                            />
                                                  </div>
                                                  {errors.amount && (
                                                            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                                                  )}
                                        </div>

                                        {/* Payment Method */}
                                        <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Payment Method *
                                                  </label>
                                                  <select
                                                            {...register('payment_method')}
                                                            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  >
                                                            <option value="cash">💵 Cash</option>
                                                            <option value="bank_transfer">🏦 Bank Transfer</option>
                                                            <option value="check">📝 Check</option>
                                                            <option value="money_order">💰 Money Order</option>
                                                  </select>
                                        </div>

                                        {/* Received From */}
                                        <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Received From *
                                                  </label>
                                                  <input
                                                            {...register('received_from')}
                                                            type="text"
                                                            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                            placeholder="John Doe / ABC Company"
                                                  />
                                                  {errors.received_from && (
                                                            <p className="mt-1 text-sm text-red-600">{errors.received_from.message}</p>
                                                  )}
                                        </div>

                                        {/* Payment Date */}
                                        <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Payment Date *
                                                  </label>
                                                  <div className="relative">
                                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                            <input
                                                                      {...register('payment_date')}
                                                                      type="date"
                                                                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                            />
                                                  </div>
                                                  {errors.payment_date && (
                                                            <p className="mt-1 text-sm text-red-600">{errors.payment_date.message}</p>
                                                  )}
                                        </div>

                                        {/* Reference Number */}
                                        <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Reference/Receipt Number
                                                  </label>
                                                  <input
                                                            {...register('reference')}
                                                            type="text"
                                                            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                            placeholder="TXN-123456, Receipt #789"
                                                  />
                                                  {errors.reference && (
                                                            <p className="mt-1 text-sm text-red-600">{errors.reference.message}</p>
                                                  )}
                                        </div>

                                        {/* Description */}
                                        <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Description *
                                                  </label>
                                                  <textarea
                                                            {...register('description')}
                                                            rows={3}
                                                            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                            placeholder="What was this payment for? (e.g., Invoice #123, Service fee, Product purchase)"
                                                  />
                                                  {errors.description && (
                                                            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                                  )}
                                        </div>

                                        {/* Additional Notes */}
                                        <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Additional Notes
                                                  </label>
                                                  <textarea
                                                            {...register('notes')}
                                                            rows={2}
                                                            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                            placeholder="Any additional information about this payment..."
                                                  />
                                                  {errors.notes && (
                                                            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                                                  )}
                                        </div>

                                        {/* File Attachments */}
                                        <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Attachments (Optional)
                                                  </label>
                                                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                                                            <div className="text-center">
                                                                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                                      <label className="cursor-pointer">
                                                                                <span className="text-blue-600 hover:text-blue-700">Upload receipts or documents</span>
                                                                                <input
                                                                                          type="file"
                                                                                          multiple
                                                                                          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                                                                          onChange={handleFileChange}
                                                                                          className="hidden"
                                                                                />
                                                                      </label>
                                                                      <p className="text-xs text-gray-500 mt-1">
                                                                                JPG, PNG, PDF, DOC up to 10MB each
                                                                      </p>
                                                            </div>
                                                  </div>

                                                  {attachments.length > 0 && (
                                                            <div className="mt-3 space-y-2">
                                                                      {attachments.map((file, index) => (
                                                                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                                                          <div className="flex items-center">
                                                                                                    <FileText className="w-4 h-4 text-gray-500 mr-2" />
                                                                                                    <span className="text-sm text-gray-700">{file.name}</span>
                                                                                          </div>
                                                                                          <button
                                                                                                    type="button"
                                                                                                    onClick={() => removeAttachment(index)}
                                                                                                    className="text-red-600 hover:text-red-700"
                                                                                          >
                                                                                                    <X className="w-4 h-4" />
                                                                                          </button>
                                                                                </div>
                                                                      ))}
                                                            </div>
                                                  )}
                                        </div>

                                        {/* Summary */}
                                        {watchedAmount > 0 && (
                                                  <div className="bg-gray-50 rounded-lg p-4">
                                                            <h4 className="font-medium text-gray-900 mb-2">Payment Summary</h4>
                                                            <div className="space-y-1 text-sm">
                                                                      <div className="flex justify-between">
                                                                                <span className="text-gray-600">Amount:</span>
                                                                                <span className="font-medium">${Number(watchedAmount).toFixed(2)}</span>
                                                                      </div>
                                                                      <div className="flex justify-between">
                                                                                <span className="text-gray-600">Method:</span>
                                                                                <span className="font-medium">
                                                                                          {getMethodIcon(watchedMethod)} {watchedMethod?.replace('_', ' ')}
                                                                                </span>
                                                                      </div>
                                                            </div>
                                                  </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                                  type="submit"
                                                  disabled={isSubmitting || !isValid}
                                                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                        >
                                                  {isSubmitting ? (
                                                            <>
                                                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                                      Recording Payment...
                                                            </>
                                                  ) : (
                                                            <>
                                                                      <Save className="w-4 h-4 mr-2" />
                                                                      Record Payment
                                                            </>
                                                  )}
                                        </button>
                              </form>
                    </div>
          );
};