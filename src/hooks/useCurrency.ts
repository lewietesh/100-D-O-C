// src/hooks/useCurrency.ts
import { useState, useEffect, useMemo } from 'react';
import exchangeRatesData from '@/data/exchangeRates.json';

export interface Currency {
          code: string;
          name: string;
          symbol: string;
          flag: string;
          rate: number;
}

export interface CurrencyConversion {
          amount: number;
          fromCurrency: string;
          toCurrency: string;
          convertedAmount: number;
          rate: number;
}

interface UseCurrencyReturn {
          currencies: Currency[];
          selectedCurrency: string;
          setSelectedCurrency: (currency: string) => void;
          convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => CurrencyConversion;
          formatAmount: (amount: number, currency: string) => string;
          getCurrencyInfo: (currencyCode: string) => Currency | null;
          exchangeRates: Record<string, number>;
          lastUpdated: string;
}

export const useCurrency = (): UseCurrencyReturn => {
          // Get user's preferred currency from localStorage or default to USD
          const [selectedCurrency, setSelectedCurrencyState] = useState<string>(() => {
                    if (typeof window !== 'undefined') {
                              return localStorage.getItem('preferredCurrency') || 'USD';
                    }
                    return 'USD';
          });

          // Parse exchange rates data
          const exchangeRates = useMemo(() => exchangeRatesData.rates, []);
          const currencyInfo = useMemo(() => exchangeRatesData.currencies, []);
          const lastUpdated = exchangeRatesData.lastUpdated;

          // Create currencies array with rates
          const currencies = useMemo(() => {
                    return Object.keys(currencyInfo).map(code => ({
                              code,
                              name: currencyInfo[code as keyof typeof currencyInfo].name,
                              symbol: currencyInfo[code as keyof typeof currencyInfo].symbol,
                              flag: currencyInfo[code as keyof typeof currencyInfo].flag,
                              rate: exchangeRates[code as keyof typeof exchangeRates],
                    }));
          }, [currencyInfo, exchangeRates]);

          // Save selected currency to localStorage
          const setSelectedCurrency = (currency: string) => {
                    setSelectedCurrencyState(currency);
                    if (typeof window !== 'undefined') {
                              localStorage.setItem('preferredCurrency', currency);
                    }
          };

          // Convert amount between currencies
          const convertAmount = (
                    amount: number,
                    fromCurrency: string,
                    toCurrency: string
          ): CurrencyConversion => {
                    const fromRate = exchangeRates[fromCurrency as keyof typeof exchangeRates] || 1;
                    const toRate = exchangeRates[toCurrency as keyof typeof exchangeRates] || 1;

                    // Convert to USD first, then to target currency
                    const usdAmount = amount / fromRate;
                    const convertedAmount = usdAmount * toRate;
                    const rate = toRate / fromRate;

                    return {
                              amount,
                              fromCurrency,
                              toCurrency,
                              convertedAmount,
                              rate,
                    };
          };

          // Format amount with currency symbol
          const formatAmount = (amount: number, currencyCode: string): string => {
                    const currency = currencyInfo[currencyCode as keyof typeof currencyInfo];
                    if (!currency) return `${amount.toFixed(2)} ${currencyCode}`;

                    const symbol = currency.symbol;

                    // Format based on currency conventions
                    if (currencyCode === 'USD' || currencyCode === 'CAD' || currencyCode === 'AUD') {
                              return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    } else if (currencyCode === 'EUR') {
                              return `${symbol}${amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    } else if (currencyCode === 'GBP') {
                              return `${symbol}${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    } else if (currencyCode === 'JPY' || currencyCode === 'KRW') {
                              // No decimal places for these currencies
                              return `${symbol}${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
                    } else if (currencyCode === 'INR') {
                              return `${symbol}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    } else {
                              return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    }
          };

          // Get currency information by code
          const getCurrencyInfo = (currencyCode: string): Currency | null => {
                    return currencies.find(currency => currency.code === currencyCode) || null;
          };

          return {
                    currencies,
                    selectedCurrency,
                    setSelectedCurrency,
                    convertAmount,
                    formatAmount,
                    getCurrencyInfo,
                    exchangeRates,
                    lastUpdated,
          };
};