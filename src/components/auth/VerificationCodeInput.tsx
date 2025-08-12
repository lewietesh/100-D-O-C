// components/auth/VerificationCodeInput.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface VerificationCodeInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string | null | undefined; // ✅ Accept null, undefined, and string
  label?: string;
  inputRef?: (ref: HTMLInputElement | null) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function VerificationCodeInput({
  length = 6,
  value,
  onChange,
  error,
  label = 'Verification Code',
  inputRef,
  onKeyDown,
  disabled = false,
  placeholder
}: VerificationCodeInputProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[activeIndex] && !disabled) {
      inputRefs.current[activeIndex]?.focus();
      if (activeIndex === 0 && inputRef) {
        inputRef(inputRefs.current[0]);
      }
    }
  }, [activeIndex, inputRef, disabled]);

  // Handle input change
  const handleChange = (index: number, inputValue: string) => {
    if (disabled) return;
    
    // Only allow numeric input
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    
    // Prevent multiple characters in one input
    if (numericValue.length > 1) {
      return;
    }
    
    const newValue = value.split('');
    newValue[index] = numericValue;
    const updatedValue = newValue.join('');
    
    onChange(updatedValue);
    
    // Move to next input if value is entered
    if (numericValue && index < length - 1) {
      setActiveIndex(index + 1);
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('Text').replace(/[^0-9]/g, '');
    
    // Handle different paste scenarios
    if (pastedData.length === length) {
      onChange(pastedData);
      setActiveIndex(length - 1);
    } else if (pastedData.length > 0 && pastedData.length <= length) {
      onChange(pastedData);
      setActiveIndex(Math.min(pastedData.length - 1, length - 1));
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Backspace':
        e.preventDefault();
        if (value[index]) {
          // Clear current input
          const newValue = value.split('');
          newValue[index] = '';
          onChange(newValue.join(''));
        } else if (index > 0) {
          // Move to previous input and clear it
          setActiveIndex(index - 1);
          const newValue = value.split('');
          newValue[index - 1] = '';
          onChange(newValue.join(''));
        }
        break;
        
      case 'ArrowLeft':
        e.preventDefault();
        if (index > 0) {
          setActiveIndex(index - 1);
        }
        break;
        
      case 'ArrowRight':
        e.preventDefault();
        if (index < length - 1) {
          setActiveIndex(index + 1);
        }
        break;
        
      case 'Delete':
        e.preventDefault();
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
        break;
        
      default:
        // Allow only numeric keys
        if (!/[0-9]/.test(e.key) && !['Tab', 'Shift'].includes(e.key)) {
          e.preventDefault();
        }
        break;
    }
    
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  // Handle focus
  const handleFocus = (index: number) => {
    if (!disabled) {
      setActiveIndex(index);
    }
  };

  // Check if there's an error to display
  const hasError = error && error.trim().length > 0;

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-900 sm:text-base">
          {label}
        </label>
      )}
      
      <div className="flex justify-center space-x-2 sm:space-x-3">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
              if (index === 0 && inputRef) inputRef(el);
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            className={cn(
              'h-12 w-10 sm:h-14 sm:w-12 text-center text-lg sm:text-xl font-semibold rounded-lg border-2 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              hasError
                ? 'border-red-300 bg-red-50 text-red-900'
                : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400',
              activeIndex === index && !hasError && 'border-blue-400',
              disabled && 'opacity-50 cursor-not-allowed bg-gray-50'
            )}
            value={value[index] || ''}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => handleChange(index, e.target.value)}
            onFocus={() => handleFocus(index)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            autoComplete="one-time-code"
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-describedby={hasError ? 'verification-error' : undefined}
          />
        ))}
      </div>

      {hasError && (
        <div 
          id="verification-error"
          className="text-sm text-red-600 text-center" 
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
      
      {!hasError && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Enter the {length}-digit code sent to your email
          </p>
        </div>
      )}
    </div>
  );
}