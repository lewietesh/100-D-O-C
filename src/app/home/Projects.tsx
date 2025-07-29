//app/home/Projects.tsx
'use client';

import { useState, useEffect } from 'react';

// API interfaces matching your response structure
interface Technology {
  id: number;
  name: string;
  icon_url: string;
  category: string;
}

interface ApiProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  domain: string;
  client: string | null;
  image_url: string;
  description: string;
  url: string;
  repository_url: string;
  likes: number;
  featured: boolean;
  completion_date: string;
  status: 'ongoing' | 'completed' | 'maintenance';
  technologies: Technology[];
  comments_count: number;
  gallery_images_count: number;
  date_created: string;
}

interface ProjectsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiProject[];
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function Projects() {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract unique categories from projects for filter buttons
  const getFilters = () => {
    const categories = projects.map(p => p.category).filter(Boolean);
    const domains = projects.map(p => p.domain).filter(Boolean);
    const uniqueFilters = Array.from(new Set([...categories, ...domains]));
    return ['All', ...uniqueFilters.sort()];
  };

  const filters = getFilters();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/v1/projects/projects/`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }
        
        const data: ProjectsResponse = await response.json();
        setProjects(data.results);
        
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter || p.domain === activeFilter);

  // Format project URL for display
  const formatUrl = (url: string) => {
    if (!url) return '#';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ongoing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section id="projects" className="w-full overflow-x-hidden py-20 px-6 bg-alternate dark:bg-background-dark text-text-light dark:text-text-dark">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10 text-brand dark:text-brand-dark">
            Featured Projects
          </h2>
          
          {/* Loading skeleton */}
          <div className="flex justify-center content-around flex-wrap gap-4 mb-12">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-16 bg-gray-300 rounded-full animate-pulse"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white-custom dark:bg-surface-dark rounded-lg shadow animate-pulse">
                <div className="h-56 bg-gray-300 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-2/3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-300 rounded w-12"></div>
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="projects" className="w-full overflow-x-hidden py-20 px-6 bg-alternate dark:bg-background-dark text-text-light dark:text-text-dark">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10 text-brand dark:text-brand-dark">
            Featured Projects
          </h2>
          <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg p-6 max-w-md mx-auto">
            <p className="font-medium">Error loading projects</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // No projects state
  if (projects.length === 0) {
    return (
      <section id="projects" className="w-full overflow-x-hidden py-20 px-6 bg-alternate dark:bg-background-dark text-text-light dark:text-text-dark">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10 text-brand dark:text-brand-dark">
            Featured Projects
          </h2>
          <div className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-lg font-medium">No projects available</p>
            <p className="text-sm mt-2">Check back later for new projects.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="w-full overflow-x-hidden py-20 px-6 bg-alternate dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10 text-brand dark:text-brand-dark">
          Featured Projects
        </h2>

        {/* Filter Buttons */}
        {filters.length > 1 && (
          <div className="flex justify-center content-around flex-wrap gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full border transition text-sm font-medium ${
                  activeFilter === filter
                    ? 'bg-cta text-white border-brand'
                    : 'bg-surface-light dark:bg-surface-dark text-text-secondary hover:bg-gray-200 dark:hover:bg-surface-dark/80'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {filteredProjects.map((project) => (
            <a
              key={project.id}
              href={formatUrl(project.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer overflow-hidden rounded-lg shadow hover:shadow-lg transition bg-white-custom dark:bg-surface-dark"
            >
              {/* Project Image */}
              <div className="relative">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to a placeholder image if the image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60';
                  }}
                />
                
                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-cta text-white text-xs font-medium px-2 py-1 rounded-full">
                      ⭐ Featured
                    </span>
                  </div>
                )}

                {/* Status badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-1 group-hover:text-brand transition-colors">
                  {project.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-2 text-sm text-text-secondary dark:text-gray-400">
                  <span>{project.category}</span>
                  {project.domain && (
                    <>
                      <span>•</span>
                      <span>{project.domain}</span>
                    </>
                  )}
                </div>

                <p className="text-sm text-text-secondary dark:text-gray-400 mb-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech.id}
                      className="text-xs bg-brand/10 text-brand dark:text-brand-dark px-2 py-1 rounded"
                    >
                      {tech.name}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>

                {/* Project Stats */}
                <div className="flex items-center justify-between text-xs text-text-secondary dark:text-gray-400">
                  <div className="flex items-center gap-3">
                    {/* <span>❤️ {project.likes}</span> */}
                    <span>💬 {project.comments_count}</span>
                    {project.gallery_images_count > 0 && (
                      <span>🖼️ {project.gallery_images_count}</span>
                    )}
                  </div>
                  {project.completion_date && (
                    <span>
                      {new Date(project.completion_date).getFullYear()}
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* No filtered results */}
        {filteredProjects.length === 0 && activeFilter !== 'All' && (
          <div className="text-center py-12">
            <div className="text-gray-600 dark:text-gray-400">
              <p className="text-lg font-medium">No projects found for "{activeFilter}"</p>
              <p className="text-sm mt-2">Try selecting a different category.</p>
            </div>
          </div>
        )}

        {/* Projects count */}
        {filteredProjects.length > 0 && (
          <div className="text-center mt-12 text-text-secondary dark:text-gray-400">
            <p className="text-sm">
              Showing {filteredProjects.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
              {activeFilter !== 'All' && ` in ${activeFilter}`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}