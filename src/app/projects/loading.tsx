// app/projects/loading.tsx

export default function ProjectsLoading() {
          return (
                    <>

                              <main className="max-w-7xl mx-auto p-6">
                                        {/* Loading skeleton */}
                                        <div className="animate-pulse">
                                                  {/* Search bar skeleton */}
                                                  <div className="max-w-md mx-auto mb-8">
                                                            <div className="h-12 bg-gray-200 rounded-lg"></div>
                                                  </div>

                                                  {/* Filters skeleton */}
                                                  <div className="flex flex-wrap gap-4 justify-center mb-8">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                      <div key={i} className="h-8 w-20 bg-gray-200 rounded-full"></div>
                                                            ))}
                                                  </div>

                                                  {/* Grid skeleton */}
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                            {Array.from({ length: 9 }).map((_, i) => (
                                                                      <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                                                                                <div className="h-60 bg-gray-200"></div>
                                                                                <div className="p-6 space-y-3">
                                                                                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                                                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                                                          <div className="space-y-2">
                                                                                                    <div className="h-3 bg-gray-200 rounded"></div>
                                                                                                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                                                                          </div>
                                                                                </div>
                                                                      </div>
                                                            ))}
                                                  </div>
                                        </div>
                              </main>
                    </>
          );
}
