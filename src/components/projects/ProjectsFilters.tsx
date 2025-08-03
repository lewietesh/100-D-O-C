'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { ProjectsQueryParams, ProjectStatus } from '@/types/projects';

interface ProjectsFiltersProps {
          currentFilters: ProjectsQueryParams;
          onFiltersChange: (filters: Partial<ProjectsQueryParams>) => void;
          totalCount: number;
          className?: string;
}

const statusOptions: { value: ProjectStatus; label: string }[] = [
          { value: 'completed', label: 'Completed' },
          { value: 'ongoing', label: 'Ongoing' },
          { value: 'maintenance', label: 'Maintenance' },
];

const categoryOptions = [
          'Web Application',
          'E-commerce',
          'Mobile App',
          'Landing Page',
          'Dashboard',
          'Portfolio',
          'Blog',
          'API',
];

export default function ProjectsFilters({
          currentFilters,
          onFiltersChange,
          totalCount,
          className
}: ProjectsFiltersProps) {
          const [showFilters, setShowFilters] = useState(false);

          const handleStatusChange = (status: ProjectStatus | '') => {
                    onFiltersChange({
                              filters: {
                                        ...currentFilters.filters,
                                        status: status || undefined,
                              }
                    });
          };

          const handleCategoryChange = (category: string) => {
                    onFiltersChange({
                              category: category || undefined,
                    });
          };

          const handleFeaturedToggle = () => {
                    const newFeatured = currentFilters.filters?.featured ? undefined : true;
                    onFiltersChange({
                              filters: {
                                        ...currentFilters.filters,
                                        featured: newFeatured,
                              }
                    });
          };

          const clearAllFilters = () => {
                    onFiltersChange({
                              category: undefined,
                              search: undefined,
                              filters: {},
                              page: 1,
                    });
          };

          const hasActiveFilters = !!(
                    currentFilters.category ||
                    currentFilters.search ||
                    currentFilters.filters?.status ||
                    currentFilters.filters?.featured
          );

          return (
                    <div className={cn("space-y-4", className)}>
                              {/* Results count and toggle */}
                              <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600">
                                                  {totalCount} {totalCount === 1 ? 'project' : 'projects'} found
                                        </p>
                                        <button
                                                  onClick={() => setShowFilters(!showFilters)}
                                                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                                  Filters
                                                  <ChevronDownIcon
                                                            className={cn(
                                                                      "ml-2 h-4 w-4 transition-transform duration-200",
                                                                      showFilters && "rotate-180"
                                                            )}
                                                  />
                                        </button>
                              </div>

                              {/* Filter options */}
                              {showFilters && (
                                        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            {/* Status Filter */}
                                                            <div>
                                                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                Status
                                                                      </label>
                                                                      <select
                                                                                value={currentFilters.filters?.status || ''}
                                                                                onChange={(e) => handleStatusChange(e.target.value as ProjectStatus | '')}
                                                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                                      >
                                                                                <option value="">All Status</option>
                                                                                {statusOptions.map((option) => (
                                                                                          <option key={option.value} value={option.value}>
                                                                                                    {option.label}
                                                                                          </option>
                                                                                ))}
                                                                      </select>
                                                            </div>

                                                            {/* Category Filter */}
                                                            <div>
                                                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                Category
                                                                      </label>
                                                                      <select
                                                                                value={currentFilters.category || ''}
                                                                                onChange={(e) => handleCategoryChange(e.target.value)}
                                                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                                      >
                                                                                <option value="">All Categories</option>
                                                                                {categoryOptions.map((category) => (
                                                                                          <option key={category} value={category}>
                                                                                                    {category}
                                                                                          </option>
                                                                                ))}
                                                                      </select>
                                                            </div>

                                                            {/* Featured Toggle */}
                                                            <div>
                                                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                Featured
                                                                      </label>
                                                                      <button
                                                                                onClick={handleFeaturedToggle}
                                                                                className={cn(
                                                                                          "w-full px-3 py-2 text-left border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                                                                                          currentFilters.filters?.featured
                                                                                                    ? "bg-blue-50 border-blue-300 text-blue-700"
                                                                                                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                                                                )}
                                                                      >
                                                                                {currentFilters.filters?.featured ? 'Featured Only' : 'All Projects'}
                                                                      </button>
                                                            </div>
                                                  </div>

                                                  {/* Clear filters */}
                                                  {hasActiveFilters && (
                                                            <div className="pt-2 border-t border-gray-200">
                                                                      <button
                                                                                onClick={clearAllFilters}
                                                                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                                      >
                                                                                Clear all filters
                                                                      </button>
                                                            </div>
                                                  )}
                                        </div>
                              )}

                              {/* Active filters display */}
                              {hasActiveFilters && (
                                        <div className="flex flex-wrap gap-2">
                                                  {currentFilters.filters?.status && (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                      Status: {statusOptions.find(s => s.value === currentFilters.filters?.status)?.label}
                                                                      <button
                                                                                onClick={() => handleStatusChange('')}
                                                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                                                      >
                                                                                ×
                                                                      </button>
                                                            </span>
                                                  )}
                                                  {currentFilters.category && (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                      Category: {currentFilters.category}
                                                                      <button
                                                                                onClick={() => handleCategoryChange('')}
                                                                                className="ml-2 text-green-600 hover:text-green-800"
                                                                      >
                                                                                ×
                                                                      </button>
                                                            </span>
                                                  )}
                                                  {currentFilters.filters?.featured && (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                      Featured
                                                                      <button
                                                                                onClick={handleFeaturedToggle}
                                                                                className="ml-2 text-yellow-600 hover:text-yellow-800"
                                                                      >
                                                                                ×
                                                                      </button>
                                                            </span>
                                                  )}
                                                  {currentFilters.search && (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                                      Search: "{currentFilters.search}"
                                                                      <button
                                                                                onClick={() => onFiltersChange({ search: undefined })}
                                                                                className="ml-2 text-purple-600 hover:text-purple-800"
                                                                      >
                                                                                ×
                                                                      </button>
                                                            </span>
                                                  )}
                                        </div>
                              )}
                    </div>
          );
}
