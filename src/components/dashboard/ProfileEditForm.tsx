// src/components/dashboard/ProfileEditForm.tsx - Version 3
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Save, X, User, Phone, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../../types/user';


// Align with backend and Yup schema: all fields optional and nullable
export type ProfileFormData = {
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
};

const profileSchema: yup.ObjectSchema<ProfileFormData> = yup.object({
          first_name: yup
                    .string()
                    .nullable()
                    .max(50, 'First name must be less than 50 characters')
                    .matches(/^[a-zA-Z\s]*$/, 'First name can only contain letters and spaces'),
          last_name: yup
                    .string()
                    .nullable()
                    .max(50, 'Last name must be less than 50 characters')
                    .matches(/^[a-zA-Z\s]*$/, 'Last name can only contain letters and spaces'),
          phone: yup
                    .string()
                    .nullable()
                    .matches(
                              /^(\+?[1-9]\d{1,14})?$/,
                              'Please enter a valid phone number (international format accepted)'
                    ),
});

interface ProfileEditFormProps {
          profile: UserProfile;
          onSave: (data: Partial<UserProfile>) => Promise<boolean>;
          onCancel: () => void;
          loading?: boolean;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
          profile,
          onSave,
          onCancel,
          loading = false,
}) => {
          const [submitting, setSubmitting] = useState(false);
          const [hasChanges, setHasChanges] = useState(false);

          const {
                    register,
                    handleSubmit,
                    formState: { errors, isDirty },
                    watch,
                    reset,
          } = useForm<ProfileFormData>({
                    resolver: yupResolver(profileSchema) as any, // type workaround for resolver
                    defaultValues: {
                              first_name: profile.first_name ?? '',
                              last_name: profile.last_name ?? '',
                              phone: profile.phone ?? '',
                    },
          });

          // Watch for changes
          const watchedValues = watch();
          React.useEffect(() => {
                    setHasChanges(isDirty);
          }, [isDirty, watchedValues]);

          const onSubmit: import('react-hook-form').SubmitHandler<ProfileFormData> = async (data) => {
                    try {
                              setSubmitting(true);

                              // Only send fields that have actually changed
                              const changedData: Partial<UserProfile> = {};

                              if (data.first_name !== (profile.first_name || '')) {
                                        changedData.first_name = data.first_name || null;
                              }
                              if (data.last_name !== (profile.last_name || '')) {
                                        changedData.last_name = data.last_name || null;
                              }
                              if (data.phone !== (profile.phone || '')) {
                                        changedData.phone = data.phone || null;
                              }

                              if (Object.keys(changedData).length === 0) {
                                        onCancel();
                                        return;
                              }

                              const success = await onSave(changedData);
                              if (success) {
                                        setHasChanges(false);
                              }
                    } catch (error) {
                              console.error('Failed to update profile:', error);
                    } finally {
                              setSubmitting(false);
                    }
          };

          const handleCancel = () => {
                    if (hasChanges) {
                              if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                                        reset();
                                        onCancel();
                              }
                    } else {
                              onCancel();
                    }
          };

          return (
                    <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">Edit Profile Information</h3>
                                        {hasChanges && (
                                                  <div className="flex items-center text-amber-600 text-sm">
                                                            <AlertTriangle className="w-4 h-4 mr-1" />
                                                            You have unsaved changes
                                                  </div>
                                        )}
                              </div>

                              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                  <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                      <User className="w-4 h-4 inline mr-1" />
                                                                      First Name
                                                            </label>
                                                            <input
                                                                      {...register('first_name')}
                                                                      type="text"
                                                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                      placeholder="Enter your first name"
                                                            />
                                                            {errors.first_name && (
                                                                      <p className="mt-1 text-sm text-red-600 flex items-center">
                                                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                                                {errors.first_name.message}
                                                                      </p>
                                                            )}
                                                  </div>

                                                  <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                      <User className="w-4 h-4 inline mr-1" />
                                                                      Last Name
                                                            </label>
                                                            <input
                                                                      {...register('last_name')}
                                                                      type="text"
                                                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                      placeholder="Enter your last name"
                                                            />
                                                            {errors.last_name && (
                                                                      <p className="mt-1 text-sm text-red-600 flex items-center">
                                                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                                                {errors.last_name.message}
                                                                      </p>
                                                            )}
                                                  </div>

                                                  <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                      <Phone className="w-4 h-4 inline mr-1" />
                                                                      Phone Number
                                                            </label>
                                                            <input
                                                                      {...register('phone')}
                                                                      type="tel"
                                                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                      placeholder="Enter your phone number (e.g., +1234567890)"
                                                            />
                                                            {errors.phone && (
                                                                      <p className="mt-1 text-sm text-red-600 flex items-center">
                                                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                                                {errors.phone.message}
                                                                      </p>
                                                            )}
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                      Include country code for international numbers (e.g., +1 for US, +254 for Kenya)
                                                            </p>
                                                  </div>

                                                  <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                      Email Address
                                                            </label>
                                                            <input
                                                                      type="email"
                                                                      value={profile.email}
                                                                      disabled
                                                                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                                                            />
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                      Email address cannot be changed. Contact support if you need to update your email.
                                                            </p>
                                                  </div>
                                        </div>

                                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                                  <button
                                                            type="button"
                                                            onClick={handleCancel}
                                                            disabled={submitting}
                                                            className="flex items-center px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                                                  >
                                                            <X className="w-4 h-4 mr-2" />
                                                            Cancel
                                                  </button>
                                                  <button
                                                            type="submit"
                                                            disabled={submitting || loading || !hasChanges}
                                                            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                  >
                                                            {submitting || loading ? (
                                                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                            ) : (
                                                                      <Save className="w-4 h-4 mr-2" />
                                                            )}
                                                            {submitting ? 'Saving...' : 'Save Changes'}
                                                  </button>
                                        </div>
                              </form>
                    </div>
          );
};