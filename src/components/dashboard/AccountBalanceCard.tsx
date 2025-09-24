// src/components/dashboard/AccountBalanceCard.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
          DollarSign,
          CreditCard,
          Settings,
          ChevronDown,
          RefreshCw,
          TrendingUp,
          Eye,
          EyeOff,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { AccountBalance } from '@/types/payment';

interface AccountBalanceCardProps {
          accountBalance: AccountBalance | null;
          loading?: boolean;
          onRefresh?: () => void;
}

export const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({
          accountBalance,
          loading = false,
          onRefresh,
}) => {
          const [showBalance, setShowBalance] = useState(true);
          const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
          const dropdownRef = useRef<HTMLDivElement>(null);
          
          const {
                    selectedCurrency,
                    setSelectedCurrency,
                    convertAmount,
                    formatAmount,
                    getCurrencyInfo,
                    currencies
          } = useCurrency();

          // Convert balance to selected currency
          const convertedBalance = accountBalance
                    ? convertAmount(accountBalance.available, accountBalance.currency, selectedCurrency)
                    : null;

          const convertedPending = accountBalance && accountBalance.pending > 0
                    ? convertAmount(accountBalance.pending, accountBalance.currency, selectedCurrency)
                    : null;

          const selectedCurrencyInfo = getCurrencyInfo(selectedCurrency);

          // Close dropdown when clicking outside
          useEffect(() => {
                    const handleClickOutside = (event: MouseEvent) => {
                              if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                                        setShowCurrencyDropdown(false);
                              }
                    };

                    if (showCurrencyDropdown) {
                              document.addEventListener('mousedown', handleClickOutside);
                              return () => document.removeEventListener('mousedown', handleClickOutside);
                    }
          }, [showCurrencyDropdown]);

          const handleCurrencyChange = (currencyCode: string) => {
                    console.log('Currency change clicked:', currencyCode);
                    console.log('Current selected currency:', selectedCurrency);
                    setSelectedCurrency(currencyCode);

                    // Force re-calculation of converted balance
                    const newConvertedBalance = accountBalance && accountBalance.available > 0
                              ? convertAmount(accountBalance.available, accountBalance.currency, currencyCode)
                              : null;

                    console.log('New converted balance:', newConvertedBalance);
                    setShowCurrencyDropdown(false);
                    console.log('Currency changed to:', currencyCode);
          };

          const toggleCurrencyDropdown = (e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowCurrencyDropdown(prev => !prev);
          };

          return (
                    <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-large p-6 text-dark relative">
                              {/* Background Pattern */}
                              <div className="absolute inset-0 opacity-10 overflow-hidden rounded-xl">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                              </div>

                              {/* Header */}
                              <div className="relative z-10 flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                            <CreditCard className="w-5 h-5 text-dark" />
                                                  </div>
                                                  <div>
                                                            <h3 className="text-lg font-semibold text-dark">Account Balance</h3>
                                                            <p className="text-dark/80 text-sm">
                                                                      {accountBalance?.last_updated
                                                                                ? `Updated ${new Date(accountBalance.last_updated).toLocaleDateString()}`
                                                                                : 'Real-time balance'
                                                                      }
                                                            </p>
                                                  </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                                  <button
                                                            onClick={() => setShowBalance(!showBalance)}
                                                            className="p-2 hover:bg-white/15 rounded-lg transition-colors text-dark/90 hover:text-white"
                                                            title={showBalance ? 'Hide balance' : 'Show balance'}
                                                  >
                                                            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                  </button>

                                                  {onRefresh && (
                                                            <button
                                                                      onClick={onRefresh}
                                                                      disabled={loading}
                                                                      className="p-2 hover:bg-white/15 rounded-lg transition-colors disabled:opacity-50 text-dark/90 hover:text-white"
                                                                      title="Refresh balance"
                                                            >
                                                                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                                            </button>
                                                  )}
                                        </div>
                              </div>

                              {/* Balance Amount */}
                              <div className="relative z-10 mb-6">
                                        {showBalance ? (
                                                  <div>
                                                            <div className="text-3xl font-bold mb-1 text-dark">
                                                                      {convertedBalance
                                                                                ? formatAmount(convertedBalance.convertedAmount, selectedCurrency)
                                                                                : '$0.00'
                                                                      }
                                                            </div>

                                                            {/* Original currency amount if different */}
                                                            {accountBalance && selectedCurrency !== accountBalance.currency && (
                                                                      <div className="text-dark/80 text-sm">
                                                                                ≈ {formatAmount(accountBalance.available, accountBalance.currency)}
                                                                                <span className="ml-1 text-xs text-dark/60">({accountBalance.currency})</span>
                                                                      </div>
                                                            )}

                                                            {/* Pending amount */}
                                                            {convertedPending && convertedPending.convertedAmount > 0 && (
                                                                      <div className="text-dark/80 text-sm mt-1 flex items-center">
                                                                                <TrendingUp className="w-3 h-3 mr-1" />
                                                                                {formatAmount(convertedPending.convertedAmount, selectedCurrency)} pending
                                                                      </div>
                                                            )}
                                                  </div>
                                        ) : (
                                                  <div className="text-3xl font-bold text-dark">
                                                            ••••••••
                                                  </div>
                                        )}
                              </div>

                              {/* Currency Selector */}
                              <div className="relative z-10" ref={dropdownRef}>
                                        <div className="flex items-center justify-between">
                                                  <span className="text-dark/80 text-sm font-medium">Display Currency</span>

                                                  <div className="relative">
                                                            <button
                                                                      onClick={toggleCurrencyDropdown}
                                                                      className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 transition-colors backdrop-blur-sm text-dark border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                                                            >
                                                                      <span className="text-lg">{selectedCurrencyInfo?.flag}</span>
                                                                      <span className="font-medium">{selectedCurrency}</span>
                                                                      <ChevronDown className={`w-4 h-4 transform transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''
                                                                                }`} />
                                                            </button>

                                                            {/* Currency Dropdown */}
                                                            {showCurrencyDropdown && (
                                                                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-neutral-200 max-h-60 overflow-y-auto z-[100]">
                                                                                <div className="p-2">
                                                                                          {currencies.map((currency) => (
                                                                                                    <button
                                                                                                              key={currency.code}
                                                                                                              onClick={() => handleCurrencyChange(currency.code)}
                                                                                                              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left hover:bg-neutral-50 transition-colors ${selectedCurrency === currency.code
                                                                                                                        ? 'bg-primary-50 text-primary-700 font-medium'
                                                                                                                        : 'text-neutral-700'
                                                                                                                        }`}
                                                                                                    >
                                                                                                              <span className="text-lg">{currency.flag}</span>
                                                                                                              <div className="flex-1">
                                                                                                                        <div className="font-medium text-neutral-900">{currency.code}</div>
                                                                                                                        <div className="text-sm text-neutral-500">{currency.name}</div>
                                                                                                              </div>
                                                                                                              <div className="text-sm text-neutral-400 font-mono">{currency.symbol}</div>
                                                                                                    </button>
                                                                                          ))}
                                                                                </div>
                                                                      </div>
                                                            )}
                                                  </div>
                                        </div>
                              </div>

                              {/* Loading State */}
                              {loading && (
                                        <div className="absolute inset-0 bg-primary-700/60 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
                                                  <div className="bg-white/95 rounded-lg p-3 flex items-center space-x-2 shadow-lg">
                                                            <RefreshCw className="w-4 h-4 animate-spin text-primary-600" />
                                                            <span className="text-neutral-700 text-sm font-medium">Updating balance...</span>
                                                  </div>
                                        </div>
                              )}
                    </div>
          );
};