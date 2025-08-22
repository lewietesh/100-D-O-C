'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code, Calendar, Users, Zap } from 'lucide-react';

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

  // Get grid classes based on number of projects
  const getGridClasses = () => {
    const projectCount = filteredProjects.length;
    if (projectCount === 1) {
      return 'grid grid-cols-1 max-w-2xl mx-auto';
    } else if (projectCount === 2) {
      return 'grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto';
    } else {
      return 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section id="projects" className="w-full overflow-x-hidden py-20 px-6 bg-alternate dark:bg-background-dark text-text-light dark:text-text-dark">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <div className="h-4 w-32 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-12 w-96 bg-gray-300 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 w-[600px] bg-gray-300 rounded mx-auto animate-pulse"></div>
          </div>
          
          {/* Filter skeleton */}
          <div className="flex justify-center content-around flex-wrap gap-4 mb-12">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-20 bg-gray-300 rounded-full animate-pulse"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white-custom dark:bg-surface-dark rounded-xl shadow animate-pulse">
                <div className="h-64 bg-gray-300 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-2/3"></div>
                  <div className="h-16 bg-gray-300 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
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
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Code className="w-4 h-4" />
              Project Portfolio
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-brand dark:text-brand-dark"
            >
              Case Studies & Projects
            </motion.h2>
          </div>
          
          <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl p-8 max-w-md mx-auto">
            <p className="font-medium text-lg">Error loading projects</p>
            <p className="text-sm mt-2">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
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
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Code className="w-4 h-4" />
              Project Portfolio
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-brand dark:text-brand-dark"
            >
              Case Studies & Projects
            </motion.h2>
          </div>
          
          <div className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-12 max-w-md mx-auto">
            <div className="text-6xl mb-6">🚀</div>
            <p className="text-xl font-medium mb-2">Projects Coming Soon</p>
            <p className="text-sm">I'm currently working on some exciting projects that will be showcased here.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="w-full overflow-x-hidden py-20 px-6 bg-alternate dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Code className="w-4 h-4" />
            Project Portfolio
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-brand dark:text-brand-dark"
          >
            Case Studies & Projects
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-text-secondary dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Real-world solutions I've built for clients across different industries. 
            Each project showcases my technical expertise and problem-solving approach.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 mt-8 text-sm"
          >
            <div className="flex items-center gap-2 text-text-secondary dark:text-gray-400">
              <Zap className="w-4 h-4 text-brand" />
              <span>{projects.length} Project{projects.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary dark:text-gray-400">
              <Users className="w-4 h-4 text-brand" />
              <span>{projects.filter(p => p.client).length} Client{projects.filter(p => p.client).length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary dark:text-gray-400">
              <Calendar className="w-4 h-4 text-brand" />
              <span>{projects.filter(p => p.status === 'completed').length} Completed</span>
            </div>
          </motion.div>
        </div>

        {/* Filter Buttons */}
        {filters.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex justify-center content-around flex-wrap gap-3 mb-12"
          >
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-full border transition-all duration-200 text-sm font-medium ${
                  activeFilter === filter
                    ? 'bg-cta text-white border-brand shadow-lg shadow-brand/20'
                    : 'bg-surface-light dark:bg-surface-dark text-text-secondary hover:bg-brand/5 hover:border-brand/20 dark:hover:bg-surface-dark/80'
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>
        )}

        {/* Projects Grid with Responsive Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className={getGridClasses()}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white-custom dark:bg-surface-dark border border-gray-100 dark:border-gray-800"
            >
              <a
                href={formatUrl(project.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {/* Project Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-64 lg:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60';
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ⭐ Featured
                      </span>
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize shadow-sm ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  {/* External link indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <ExternalLink className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-text-light dark:text-text-dark mb-3 group-hover:text-brand transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm text-text-secondary dark:text-gray-400">
                    <span className="font-medium">{project.category}</span>
                    {project.domain && (
                      <>
                        <span>•</span>
                        <span>{project.domain}</span>
                      </>
                    )}
                    {project.client && (
                      <>
                        <span>•</span>
                        <span className="text-brand font-medium">{project.client}</span>
                      </>
                    )}
                  </div>

                  <p className="text-text-secondary dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech.id}
                        className="text-xs bg-brand/10 text-brand dark:text-brand-dark px-3 py-1 rounded-full font-medium"
                      >
                        {tech.name}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full font-medium">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Project Stats */}
                  <div className="flex items-center justify-between text-sm text-text-secondary dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        💬 {project.comments_count}
                      </span>
                      {project.gallery_images_count > 0 && (
                        <span className="flex items-center gap-1">
                          🖼️ {project.gallery_images_count}
                        </span>
                      )}
                    </div>
                    {project.completion_date && (
                      <span className="font-medium">
                        {new Date(project.completion_date).getFullYear()}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* No filtered results */}
        {filteredProjects.length === 0 && activeFilter !== 'All' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 max-w-md mx-auto">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-lg font-medium mb-2">No projects found for "{activeFilter}"</p>
              <p className="text-sm">Try selecting a different category or view all projects.</p>
              <button
                onClick={() => setActiveFilter('All')}
                className="mt-4 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
              >
                View All Projects
              </button>
            </div>
          </motion.div>
        )}

        {/* Projects count */}
        {filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12 text-text-secondary dark:text-gray-400"
          >
            <p className="text-sm">
              Showing {filteredProjects.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
              {activeFilter !== 'All' && ` in ${activeFilter}`}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}