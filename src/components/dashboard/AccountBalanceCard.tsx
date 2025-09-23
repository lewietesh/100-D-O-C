// src/components/dashboard/AccountBalanceCard.tsx
import React, { useState } from 'react';
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

          const handleCurrencyChange = (currencyCode: string) => {
                    console.log('Currency change clicked:', currencyCode);
                    console.log('Current selected currency:', selectedCurrency);
                    setSelectedCurrency(currencyCode);
                    setShowCurrencyDropdown(false);
                    console.log('Currency changed to:', currencyCode);
          };

          return (
                    <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-lg p-6 text-dark relative">
                              {/* Background Pattern */}
                              <div className="absolute inset-0 opacity-10 overflow-hidden rounded-xl">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                              </div>

                              {/* Header */}
                              <div className="relative z-10 flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                            <CreditCard className="w-5 h-5 text-white" />
                                                  </div>
                                                  <div>
                                                            <h3 className="text-lg font-semibold text-accent-950">Account Balance</h3>
                                                            <p className="text-dark text-sm">
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
                                                            className="p-2 hover:bg-white/15 rounded-lg transition-colors text-success-600"
                                                            title={showBalance ? 'Hide balance' : 'Show balance'}
                                                  >
                                                            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                  </button>

                                                  {onRefresh && (
                                                            <button
                                                                      onClick={onRefresh}
                                                                      disabled={loading}
                                                                      className="p-2 hover:bg-white/15 rounded-lg transition-colors disabled:opacity-50 text-white"
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
                                                                      <div className="text-dark text-sm">
                                                                                ≈ {formatAmount(accountBalance.available, accountBalance.currency)}
                                                                                <span className="ml-1 text-xs text-white/70">({accountBalance.currency})</span>
                                                                      </div>
                                                            )}

                                                            {/* Pending amount */}
                                                            {convertedPending && convertedPending.convertedAmount > 0 && (
                                                                      <div className="text-dark text-sm mt-1 flex items-center">
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
                              <div className="relative z-10">
                                        <div className="flex items-center justify-between">
                                                  <span className="text-dark text-sm font-medium">Display Currency</span>

                                                  <div className="relative">
                                                            <button
                                                                      onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                setShowCurrencyDropdown(!showCurrencyDropdown);
                                                                      }}
                                                                      className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 transition-colors backdrop-blur-sm text-gray-900 border border-white/30"
                                                            >
                                                                      <span className="text-lg">{selectedCurrencyInfo?.flag}</span>
                                                                      <span className="font-medium">{selectedCurrency}</span>
                                                                      <ChevronDown className={`w-4 h-4 transform transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''
                                                                                }`} />
                                                            </button>

                                                            {/* Currency Dropdown */}
                                                            {showCurrencyDropdown && (
                                                                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto z-[100]">
                                                                                <div className="p-2">
                                                                                          {currencies.map((currency) => (
                                                                                                    <button
                                                                                                              key={currency.code}
                                                                                                              onClick={(e) => {
                                                                                                                        e.preventDefault();
                                                                                                                        e.stopPropagation();
                                                                                                                        handleCurrencyChange(currency.code);
                                                                                                              }}
                                                                                                              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left hover:bg-gray-50 transition-colors ${selectedCurrency === currency.code
                                                                                                                        ? 'bg-primary-50 text-primary-700 font-medium'
                                                                                                                        : 'text-gray-700'
                                                                                                                        }`}
                                                                                                    >
                                                                                                              <span className="text-lg">{currency.flag}</span>
                                                                                                              <div className="flex-1">
                                                                                                                        <div className="font-medium text-gray-900">{currency.code}</div>
                                                                                                                        <div className="text-sm text-gray-500">{currency.name}</div>
                                                                                                              </div>
                                                                                                              <div className="text-sm text-gray-400 font-mono">{currency.symbol}</div>
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

                              {/* Click outside to close dropdown */}
                              {showCurrencyDropdown && (
                                        <div
                                                  className="fixed inset-0 z-[80]"
                                                  onClick={() => setShowCurrencyDropdown(false)}
                                        />
                              )}
                    </div>
          );
};