// src/components/blog/BlogSearch.tsx
'use client';
import { useState } from 'react';

interface BlogSearchProps {
          onSearch: (query: string) => void;
}

const BlogSearch = ({ onSearch }: BlogSearchProps) => {
          const [query, setQuery] = useState('');

          const handleSubmit = (e: React.FormEvent) => {
                    e.preventDefault();
                    onSearch(query.trim());
          };

          return (
                    <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row items-stretch gap-2 mb-6">
                              <input
                                        type="text"
                                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Search blog posts..."
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                              />
                              <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                              >
                                        Search
                              </button>
                    </form>
          );
};

export default BlogSearch;
