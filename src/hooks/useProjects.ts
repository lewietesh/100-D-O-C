'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Project, 
  ProjectsApiResponse, 
  ProjectsQueryParams, 
  UseProjectsReturn,
  ProjectComment,
  Technology 
} from '@/types/projects';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// API Service Functions
class ProjectsApiService {
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error instanceof Error ? error : new Error('Unknown API error');
    }
  }

  async getProjects(params: ProjectsQueryParams): Promise<ProjectsApiResponse> {
    const searchParams = new URLSearchParams();

    // Add pagination
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('page_size', params.limit.toString());

    // Add search
    if (params.search) searchParams.set('search', params.search);

    // Add filters
    if (params.category) searchParams.set('category', params.category);
    if (params.status) searchParams.set('status', params.status);
    if (params.featured !== undefined) searchParams.set('featured', params.featured.toString());
    if (params.technologies) searchParams.set('technologies', params.technologies);
    if (params.ordering) searchParams.set('ordering', params.ordering);

    // Add nested filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.set(key, value.toString());
        }
      });
    }

    const url = `${API_BASE_URL}/projects/?${searchParams.toString()}`;
    return this.fetchWithErrorHandling<ProjectsApiResponse>(url);
  }

  async getProject(slug: string): Promise<Project> {
    const url = `${API_BASE_URL}/projects/${slug}/`;
    return this.fetchWithErrorHandling<Project>(url);
  }

  async getFeaturedProjects(): Promise<Project[]> {
    const response = await this.getProjects({ featured: true, limit: 6 });
    return response.results;
  }

  async getTechnologies(): Promise<Technology[]> {
    const url = `${API_BASE_URL}/technologies/`;
    return this.fetchWithErrorHandling<Technology[]>(url);
  }

  async addProjectComment(projectId: string, comment: {
    name: string;
    email?: string;
    message: string;
  }): Promise<ProjectComment> {
    const url = `${API_BASE_URL}/projects/${projectId}/comments/`;
    return this.fetchWithErrorHandling<ProjectComment>(url, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  async likeProject(projectId: string): Promise<{ likes: number }> {
    const url = `${API_BASE_URL}/projects/${projectId}/like/`;
    return this.fetchWithErrorHandling<{ likes: number }>(url, {
      method: 'POST',
    });
  }
}

const apiService = new ProjectsApiService();

// Custom Hook: useProjects
export const useProjects = (initialParams: ProjectsQueryParams = {}): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<ProjectsQueryParams>(initialParams);

  // Memoized computed values
  const hasNext = useMemo(() => !!nextUrl, [nextUrl]);
  const hasPrevious = useMemo(() => !!previousUrl, [previousUrl]);

  // Fetch projects function
  const fetchProjects = useCallback(async (
    params: ProjectsQueryParams, 
    appendResults: boolean = false
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getProjects(params);

      // Update projects
      if (appendResults) {
        setProjects(prev => [...prev, ...response.results]);
      } else {
        setProjects(response.results);
      }

      // Update metadata
      setTotalCount(response.count);
      setNextUrl(response.next);
      setPreviousUrl(response.previous);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      console.error('useProjects error:', err);

      // Don't clear projects on error if we have some data
      if (!appendResults && projects.length === 0) {
        setProjects([]);
      }
    } finally {
      setLoading(false);
    }
  }, [projects.length]);

  // Refetch current data
  const refetch = useCallback(() => {
    fetchProjects(currentParams, false);
  }, [fetchProjects, currentParams]);

  // Load more (for infinite scroll)
  const loadMore = useCallback(() => {
    if (hasNext && !loading) {
      const nextPageParams = {
        ...currentParams,
        page: (currentParams.page || 1) + 1
      };
      fetchProjects(nextPageParams, true);
    }
  }, [hasNext, loading, currentParams, fetchProjects]);

  // Update filters and refetch
  const updateFilters = useCallback((newParams: Partial<ProjectsQueryParams>) => {
    const updatedParams = {
      ...currentParams,
      ...newParams,
      // Reset to page 1 when filters change (unless explicitly setting page)
      page: 'page' in newParams ? newParams.page : 1
    };

    setCurrentParams(updatedParams);
    fetchProjects(updatedParams, false);
  }, [currentParams, fetchProjects]);

  // Initial fetch
  useEffect(() => {
    fetchProjects(currentParams, false);
  }, []); // Only run on mount

  // Update current params when initial params change
  useEffect(() => {
    setCurrentParams(initialParams);
  }, [initialParams]);

  return {
    projects,
    loading,
    error,
    totalCount,
    hasNext,
    hasPrevious,
    refetch,
    loadMore,
    updateFilters,
  };
};

// Custom Hook: useProject (for single project)
export const useProject = (slug: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProject(slug);
      setProject(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch project';
      setError(errorMessage);
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const refetch = useCallback(() => {
    fetchProject();
  }, [fetchProject]);

  return { 
    project, 
    loading, 
    error, 
    refetch 
  };
};

// Custom Hook: useProjectComments
export const useProjectComments = (projectId: string) => {
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = useCallback(async (commentData: {
    name: string;
    email?: string;
    message: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const newComment = await apiService.addProjectComment(projectId, commentData);
      
      // Add the new comment to the list (it might be pending approval)
      setComments(prev => [newComment, ...prev]);
      
      return newComment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add comment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  return {
    comments,
    loading,
    error,
    addComment,
  };
};

// Custom Hook: useProjectLikes
export const useProjectLikes = (projectId: string, initialLikes: number = 0) => {
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleLike = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.likeProject(projectId);
      setLikes(response.likes);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update likes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  return {
    likes,
    loading,
    error,
    toggleLike,
  };
};

// Custom Hook: useTechnologies
export const useTechnologies = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getTechnologies();
        setTechnologies(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch technologies';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  return { technologies, loading, error };
};

// Utility function for data formatting
export const formatProjectData = (project: Project) => {
  return {
    ...project,
    // Format dates
    formattedCreatedDate: new Date(project.date_created).toLocaleDateString(),
    formattedUpdatedDate: project.date_updated ? new Date(project.date_updated).toLocaleDateString() : null,
    formattedCompletionDate: project.completion_date ? new Date(project.completion_date).toLocaleDateString() : null,
    
    // Format URLs
    hasLiveDemo: !!project.url,
    hasRepository: !!project.repository_url,
    
    // Status helpers
    isCompleted: project.status === 'completed',
    isOngoing: project.status === 'ongoing',
    isMaintenance: project.status === 'maintenance',
    
    // Format image URL
    imageUrl: project.image_url || '/images/project-placeholder.jpg',
  };
};

export default useProjects;
