//src/components/projects/projectsContainer.tsx
//src/components/projects/projectsContainer.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RotateCcw } from 'lucide-react';
import ProjectsHero from '@/components/projects/ProjectsHero';
import ProjectGrid from '@/components/projects/ProjectGrid';
import ProjectsFilters from '@/components/projects/ProjectsFilters';
import ProjectsPagination from '@/components/projects/ProjectsPagination';
import SearchBar from '@/components/projects/SearchBar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useProjects } from '@/hooks/useProjects';
import { ProjectsQueryParams } from '@/types/projects';

interface ProjectsContainerProps {
  searchParams: {
    page?: string;
    category?: string;
    search?: string;
    status?: string;
    featured?: string;
    technology?: string;
  };
}

export default function ProjectsContainer({ searchParams }: ProjectsContainerProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  // Memoize queryParams to prevent infinite re-renders
  const queryParams: ProjectsQueryParams = useMemo(() => {
    // Only allow valid status values
    const validStatuses = ['ongoing', 'completed', 'maintenance'];
    const status = validStatuses.includes(searchParams.status || '') ? searchParams.status : undefined;
    return {
      page: Number(searchParams.page) || 1,
      limit: 12,
      category: searchParams.category,
      search: searchParams.search,
      filters: {
        status: status as any,
        featured: searchParams.featured === 'true' ? true : undefined,
      },
    };
  }, [searchParams.page, searchParams.category, searchParams.search, searchParams.status, searchParams.featured]);

  const {
    projects,
    loading,
    error,
    totalCount,
    hasNext,
    hasPrevious,
    refetch
  } = useProjects(queryParams);

  // Update URL with new search parameters
  const updateURL = (newParams: Partial<ProjectsQueryParams>) => {
    const params = new URLSearchParams(currentSearchParams);

    // Handle nested filters
    if (newParams.filters) {
      Object.entries(newParams.filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value.toString());
        }
      });
    }

    // Handle other parameters
    Object.entries(newParams).forEach(([key, value]) => {
      if (key === 'filters') return; // Already handled above

      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    // Reset to page 1 when filters change (except for page changes)
    if (!('page' in newParams)) {
      params.delete('page');
    }

    const newURL = params.toString() ? `/projects?${params.toString()}` : '/projects';
    router.push(newURL, { scroll: false });
  };

  const handleFiltersChange = (filters: Partial<ProjectsQueryParams>) => {
    updateURL(filters);
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  const handleSearch = (search: string) => {
    updateURL({ search });
  };

  if (loading && (!projects || projects.length === 0)) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900">
        <ProjectsHero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner className="h-8 w-8" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900">
        <ProjectsHero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorMessage message={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil((totalCount || 0) / (queryParams.limit || 12));
  const currentPage = queryParams.page || 1;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Hero Section */}
      <ProjectsHero />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            defaultValue={queryParams.search}
            onSearch={handleSearch}
            placeholder="Search projects..."
            className="max-w-md mx-auto"
          />
        </div>

        {/* Filters */}
        <div className="mb-12">
          <ProjectsFilters
            currentFilters={queryParams}
            onFiltersChange={handleFiltersChange}
            totalCount={totalCount || 0}
          />
        </div>

        {/* Results */}
        {projects && projects.length > 0 ? (
          <div className="space-y-12">
            <ProjectGrid projects={projects} loading={loading} />

            {totalPages > 1 && (
              <ProjectsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                onPageChange={handlePageChange}
                className="flex justify-center"
              />
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="text-neutral-400 dark:text-neutral-600 mb-6">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find what you're looking for.
            </p>
            <button
              onClick={() => updateURL({})}
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {/* Bottom CTA Section */}
      <section className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can bring your vision to life with modern web solutions
              and technical expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
              >
                Start a Project
              </a>
              <a
                href="/services"
                className="inline-flex items-center px-8 py-4 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors font-medium"
              >
                View Services
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}