import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
          message: string;
          onRetry?: () => void;
          className?: string;
}

export default function ErrorMessage({ message, onRetry, className }: ErrorMessageProps) {
          return (
                    <div className={cn("text-center py-12", className)}>
                              <div className="text-red-400 mb-4">
                                        <ExclamationTriangleIcon className="mx-auto h-12 w-12" />
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
                              <p className="text-gray-500 mb-4">{message}</p>
                              {onRetry && (
                                        <button
                                                  onClick={onRetry}
                                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                                  Try again
                                        </button>
                              )}
                    </div>
          );
}
