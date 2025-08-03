'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Hero from '@/components/Hero';
import ProjectGrid from '@/components/projects/ProjectGrid';
import ProjectsFilters from '@/components/projects/ProjectsFilters';
import ProjectsPagination from '@/components/projects/ProjectsPagination';
import SearchBar from '@/components/projects/SearchBar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useProjects } from '@/hooks/useProjects';
import { ProjectsQueryParams } from '@/types/projects';

// Simple static hero component for projects page
const ProjectsHero = () => (
          <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                        My Projects
                              </h1>
                              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                                        A showcase of my design, development, and creative work projects.
                              </p>
                    </div>
          </section>
);

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

          // Memoize query parameters to prevent unnecessary re-renders
          const queryParams: ProjectsQueryParams = useMemo(() => ({
                    page: Number(searchParams.page) || 1,
                    limit: 12, // Using limit instead of page_size to match your types
                    category: searchParams.category,
                    search: searchParams.search,
                    filters: {
                              status: searchParams.status as any,
                              featured: searchParams.featured === 'true' ? true : undefined,
                    },
          }), [searchParams.page, searchParams.category, searchParams.search, searchParams.status, searchParams.featured]);

          const {
                    projects,
                    loading,
                    error,
                    totalCount,
                    hasNext,
                    hasPrevious,
                    refetch
          } = useProjects(queryParams);

          // Update URL with new search parameters - memoized to prevent recreation
          const updateURL = useMemo(() => (newParams: Partial<ProjectsQueryParams>) => {
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
          }, [currentSearchParams, router]);

          const handleFiltersChange = useMemo(() => (filters: Partial<ProjectsQueryParams>) => {
                    updateURL(filters);
          }, [updateURL]);

          const handlePageChange = useMemo(() => (page: number) => {
                    updateURL({ page });
          }, [updateURL]);

          const handleSearch = useMemo(() => (search: string) => {
                    updateURL({ search });
          }, [updateURL]);

          if (loading && (!projects || projects.length === 0)) {
                    return (
                              <>
                                        <Hero
                                                  routeName="projects"
                                                  fallbackTitle="My Projects"
                                                  fallbackSubtitle="A showcase of my design, development, and creative work."
                                        />
                                        <div className="flex items-center justify-center min-h-96">
                                                  <LoadingSpinner className="h-8 w-8" />
                                        </div>
                              </>
                    );
          }

          if (error) {
                    return (
                              <>
                                        <Hero
                                                  routeName="projects"
                                                  fallbackTitle="My Projects"
                                                  fallbackSubtitle="A showcase of my design, development, and creative work."
                                        />
                                        <div className="max-w-7xl mx-auto p-6">
                                                  <ErrorMessage message={error} onRetry={refetch} />
                                        </div>
                              </>
                    );
          }

          const totalPages = Math.ceil((totalCount || 0) / (queryParams.limit || 12));
          const currentPage = queryParams.page || 1;

          return (
                    <>
                              <Hero
                                        routeName="projects"
                                        fallbackTitle="My Projects"
                                        fallbackSubtitle="A showcase of my design, development, and creative work projects."
                              />
                              <main className="max-w-7xl mx-auto p-6">
                                        {/* Search Bar */}
                                        <SearchBar
                                                  defaultValue={queryParams.search}
                                                  onSearch={handleSearch}
                                                  placeholder="Search projects..."
                                                  className="max-w-md mx-auto mb-8"
                                        />

                                        {/* Filters */}
                                        <ProjectsFilters
                                                  currentFilters={queryParams}
                                                  onFiltersChange={handleFiltersChange}
                                                  totalCount={totalCount || 0}
                                                  className="mb-8"
                                        />

                                        {/* Results */}
                                        {projects && projects.length > 0 ? (
                                                  <>
                                                            <ProjectGrid projects={projects} loading={loading} />

                                                            {totalPages > 1 && (
                                                                      <ProjectsPagination
                                                                                currentPage={currentPage}
                                                                                totalPages={totalPages}
                                                                                hasNext={hasNext}
                                                                                hasPrevious={hasPrevious}
                                                                                onPageChange={handlePageChange}
                                                                                className="mt-12"
                                                                      />
                                                            )}
                                                  </>
                                        ) : (
                                                  <div className="text-center py-12">
                                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                                      No projects found
                                                            </h3>
                                                            <p className="text-gray-500 mb-4">
                                                                      Try adjusting your search criteria or filters.
                                                            </p>
                                                            <button
                                                                      onClick={() => updateURL({})}
                                                                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                                            >
                                                                      Clear all filters
                                                            </button>
                                                  </div>
                                        )}
                              </main>
                    </>
          );
}
