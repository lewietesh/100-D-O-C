'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// Utility to join class names conditionally
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface SearchBarProps {
          defaultValue?: string;
          onSearch: (searchTerm: string) => void;
          placeholder?: string;
          className?: string;
}

export default function SearchBar({
          defaultValue = '',
          onSearch,
          placeholder = 'Search...',
          className
}: SearchBarProps) {
          const [searchTerm, setSearchTerm] = useState(defaultValue);

          useEffect(() => {
                    setSearchTerm(defaultValue);
          }, [defaultValue]);

          const handleSubmit = (e: React.FormEvent) => {
                    e.preventDefault();
                    onSearch(searchTerm.trim());
          };

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchTerm(e.target.value);
          };

          const handleClear = () => {
                    setSearchTerm('');
                    onSearch('');
          };

          return (
                    <form onSubmit={handleSubmit} className={cn("relative", className)}>
                              <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                                  type="text"
                                                  value={searchTerm}
                                                  onChange={handleChange}
                                                  placeholder={placeholder}
                                                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        {searchTerm && (
                                                  <button
                                                            type="button"
                                                            onClick={handleClear}
                                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                                  >
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                  </button>
                                        )}
                              </div>
                    </form>
          );
}
