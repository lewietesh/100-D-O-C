export default function LoadingProjectsPage() {
          return (
            <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-48 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md"
                  />
                ))}
              </div>
            </div>
          );
        }
        