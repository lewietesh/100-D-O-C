// components/auth/VerificationCodeInput.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface VerificationCodeInputProps {
          length?: number;
          value: string;
          onChange: (value: string) => void;
          error?: string;
          label?: string;
}

export function VerificationCodeInput({
          length = 6,
          value,
          onChange,
          error,
          label = 'Verification Code'
}: VerificationCodeInputProps) {
          const [activeIndex, setActiveIndex] = useState(0);
          const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

          useEffect(() => {
                    if (inputRefs.current[activeIndex]) {
                              inputRefs.current[activeIndex]?.focus();
                    }
          }, [activeIndex]);

          const handleChange = (index: number, inputValue: string) => {
                    const newValue = value.split('');
                    newValue[index] = inputValue;
                    const updatedValue = newValue.join('');

                    onChange(updatedValue);

                    // Move to next input if value is entered
                    if (inputValue && index < length - 1) {
                              setActiveIndex(index + 1);
                    }
          };

          const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
                    if (e.key === 'Backspace' && !value[index] && index > 0) {
                              setActiveIndex(index - 1);
                    }
          };

          const handlePaste = (e: React.ClipboardEvent) => {
                    e.preventDefault();
                    const pastedData = e.clipboardData.getData('text').slice(0, length);
                    onChange(pastedData);
                    setActiveIndex(Math.min(pastedData.length, length - 1));
          };

          return (
                    <div className="space-y-3">
                              {label && (
                                        <label className="block text-sm font-medium text-gray-900 sm:text-base">
                                                  {label}
                                        </label>
                              )}

                              <div className="flex justify-center space-x-2 sm:space-x-3">
                                        {[...Array(length)].map((_, index) => (
                                                  <input
                                                            key={index}
                                                            ref={el => { inputRefs.current[index] = el; }}
                                                            type="text"
                                                            inputMode="numeric"
                                                            pattern="[0-9]*"
                                                            maxLength={1}
                                                            value={value[index] || ''}
                                                            onChange={(e) => handleChange(index, e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                                            onPaste={handlePaste}
                                                            onFocus={() => setActiveIndex(index)}
                                                            className={cn(
                                                                      'h-12 w-10 sm:h-14 sm:w-12 text-center text-lg sm:text-xl font-semibold rounded-lg border-2 transition-all duration-200',
                                                                      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                                                                      error
                                                                                ? 'border-red-300 bg-red-50 text-red-900'
                                                                                : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400',
                                                                      activeIndex === index && !error && 'border-blue-400'
                                                            )}
                                                  />
                                        ))}
                              </div>

                              {error && (
                                        <p className="text-sm text-red-600 text-center" role="alert">
                                                  {error}
                                        </p>
                              )}
                    </div>
          );
}
