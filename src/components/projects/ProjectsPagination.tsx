'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface ProjectsPaginationProps {
          currentPage: number;
          totalPages: number;
          hasNext: boolean;
          hasPrevious: boolean;
          onPageChange: (page: number) => void;
          className?: string;
}

export default function ProjectsPagination({
          currentPage,
          totalPages,
          hasNext,
          hasPrevious,
          onPageChange,
          className
}: ProjectsPaginationProps) {
          // Generate page numbers to show
          const getPageNumbers = () => {
                    const delta = 2; // Show 2 pages before and after current page
                    const pages: (number | string)[] = [];

                    // Always show first page
                    pages.push(1);

                    // Add ellipsis if there's a gap
                    if (currentPage - delta > 2) {
                              pages.push('...');
                    }

                    // Add pages around current page
                    for (let i = Math.max(2, currentPage - delta);
                              i <= Math.min(totalPages - 1, currentPage + delta);
                              i++) {
                              pages.push(i);
                    }

                    // Add ellipsis if there's a gap
                    if (currentPage + delta < totalPages - 1) {
                              pages.push('...');
                    }

                    // Always show last page (if it's not the first page)
                    if (totalPages > 1) {
                              pages.push(totalPages);
                    }

                    // Remove duplicates while preserving order
                    return pages.filter((page, index, array) =>
                              array.indexOf(page) === index
                    );
          };

          if (totalPages <= 1) {
                    return null;
          }

          return (
                    <nav
                              className={cn("flex items-center justify-center space-x-2", className)}
                              aria-label="Pagination"
                    >
                              {/* Previous Button */}
                              <button
                                        onClick={() => onPageChange(currentPage - 1)}
                                        disabled={!hasPrevious}
                                        className={cn(
                                                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                                                  "border border-gray-300 bg-white text-gray-500",
                                                  "hover:bg-gray-50 hover:text-gray-700",
                                                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500",
                                                  "transition-colors duration-200"
                                        )}
                                        aria-label="Go to previous page"
                              >
                                        <ChevronLeftIcon className="w-4 h-4 mr-1" />
                                        Previous
                              </button>

                              {/* Page Numbers */}
                              <div className="flex items-center space-x-1">
                                        {getPageNumbers().map((page, index) => (
                                                  <button
                                                            key={`${page}-${index}`}
                                                            onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
                                                            disabled={typeof page === 'string'}
                                                            className={cn(
                                                                      "px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                                                                      "min-w-[40px] flex items-center justify-center",
                                                                      typeof page === 'string'
                                                                                ? "text-gray-400 cursor-default"
                                                                                : page === currentPage
                                                                                          ? "bg-blue-600 text-white border border-blue-600 shadow-sm"
                                                                                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                                                            )}
                                                            aria-label={
                                                                      typeof page === 'number'
                                                                                ? page === currentPage
                                                                                          ? `Current page ${page}`
                                                                                          : `Go to page ${page}`
                                                                                : undefined
                                                            }
                                                            aria-current={page === currentPage ? 'page' : undefined}
                                                  >
                                                            {page}
                                                  </button>
                                        ))}
                              </div>

                              {/* Next Button */}
                              <button
                                        onClick={() => onPageChange(currentPage + 1)}
                                        disabled={!hasNext}
                                        className={cn(
                                                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                                                  "border border-gray-300 bg-white text-gray-500",
                                                  "hover:bg-gray-50 hover:text-gray-700",
                                                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500",
                                                  "transition-colors duration-200"
                                        )}
                                        aria-label="Go to next page"
                              >
                                        Next
                                        <ChevronRightIcon className="w-4 h-4 ml-1" />
                              </button>

                              {/* Page info for screen readers */}
                              <span className="sr-only">
                                        Page {currentPage} of {totalPages}
                              </span>
                    </nav>
          );
}
