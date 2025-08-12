// components/auth/PasswordInput.tsx
'use client';

import { useState } from 'react';
import { Input } from '../ui/Input';
import { validatePassword, type PasswordStrength } from '../../lib/validation';

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showStrengthIndicator?: boolean;
  required?: boolean;
}

export function PasswordInput({
  label = 'Password',
  placeholder = 'Enter your password',
  value,
  onChange,
  error,
  showStrengthIndicator = false,
  required = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (showStrengthIndicator && newValue) {
      setPasswordStrength(validatePassword(newValue));
    } else {
      setPasswordStrength(null);
    }
  };

  const getStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score <= 1) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          error={error}
          required={required}
        />
        <button
          type="button"
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>

      {showStrengthIndicator && passwordStrength && value && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Password strength: {getStrengthText(passwordStrength.score)}
            </span>
            <span className="text-xs text-gray-500">
              {passwordStrength.score}/5
            </span>
          </div>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i < passwordStrength.score
                    ? getStrengthColor(passwordStrength.score)
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          {passwordStrength.feedback.length > 0 && (
            <ul className="space-y-1">
              {passwordStrength.feedback.map((feedback, index) => (
                <li key={index} className="flex items-center text-xs text-gray-600">
                  <span className="mr-2">
                    {passwordStrength.checks.length && 
                     passwordStrength.checks.hasLetters && 
                     passwordStrength.checks.hasNumbers ? '✓' : '•'}
                  </span>
                  {feedback}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}