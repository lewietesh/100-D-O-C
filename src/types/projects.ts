// types/projects.ts
// Projects and Portfolio Management Types

export type ProjectStatus = 'ongoing' | 'completed' | 'maintenance';

export interface Technology {
  id: number;
  name: string;
  icon_url?: string;
  category?: string;
}

export interface Client {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category?: string;
  domain?: string;
  client_id?: string;
  client?: Client; // Nested client data when populated
  image_url?: string;
  description: string;
  content?: string;
  url?: string;
  repository_url?: string;
  likes: number;
  featured: boolean;
  completion_date?: string;
  status: ProjectStatus;
  date_created: string;
  date_updated: string;
}

export interface ProjectWithDetails extends Project {
  client_details?: Client;
  technologies: Technology[];
  gallery_images: ProjectGalleryImage[];
  comments: ProjectComment[];
  reviews: ProjectReview[];
  comments_count: number;
  technologies_count: number;
  reviews_count: number;
}

// API Response types
export interface ProjectsResponse {
  results: Project[];
  count: number;
  next?: string;
  previous?: string;
}

export interface ProjectsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: 'date_created' | 'date_updated' | 'completion_date' | 'likes' | 'title';
  sortOrder?: 'asc' | 'desc';
  filters?: ProjectFilters;
}

export interface ProjectTechnology {
  project: string; // Project ID
  technology: number; // Technology ID
}

export interface ProjectGalleryImage {
  id: number;
  project: string; // Project ID
  image_url: string;
  alt_text?: string;
  sort_order: number;
}

export interface ProjectComment {
  id: string;
  project: string; // Project ID
  parent_comment?: string; // Parent comment ID for threading
  name: string;
  email?: string;
  message: string;
  approved: boolean;
  date_created: string;
  replies?: ProjectComment[]; // Nested replies for threaded display
  is_reply?: boolean;
  thread_level?: number;
}

export interface ProjectReview {
  id: string;
  project: string; // Project ID
  client: string; // Client ID
  content: string;
  rating?: number; // 1-5 rating
  display_name?: string;
  company_name?: string;
  featured: boolean;
  approved: boolean;
  date_created: string;
  reviewer_name?: string; // Computed property from backend
}

export interface ProjectCommentWithDetails extends ProjectComment {
  projectTitle: string;
  projectSlug: string;
}

// Project creation and management
export interface ProjectCreateRequest {
  title: string;
  category?: string;
  domain?: string;
  clientId?: string;
  imageUrl?: string;
  description: string;
  content?: string;
  url?: string;
  repositoryUrl?: string;
  status?: ProjectStatus;
  featured?: boolean;
  completionDate?: string;
  technologyIds?: number[];
  galleryImages?: Omit<ProjectGalleryImage, 'id' | 'project'>[];
}

export interface ProjectUpdateRequest {
  title?: string;
  category?: string;
  domain?: string;
  clientId?: string;
  imageUrl?: string;
  description?: string;
  content?: string;
  url?: string;
  repositoryUrl?: string;
  status?: ProjectStatus;
  featured?: boolean;
  completionDate?: string;
  technologyIds?: number[];
  galleryImages?: Omit<ProjectGalleryImage, 'id' | 'project'>[];
}

export interface TechnologyCreateRequest {
  name: string;
  iconUrl?: string;
  category?: string;
}

export interface TechnologyUpdateRequest {
  name?: string;
  iconUrl?: string;
  category?: string;
}

// Project filtering and search
export interface ProjectFilters {
  status?: ProjectStatus;
  category?: string;
  domain?: string;
  client?: string;
  featured?: boolean;
  technologies?: number[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ProjectSearchParams {
  query?: string;
  filters?: ProjectFilters;
  sortBy?: 'dateCreated' | 'dateUpdated' | 'completionDate' | 'likes' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// API Response types to match Django REST Framework
export interface ProjectsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}

export interface ProjectsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: ProjectStatus;
  featured?: boolean;
  technologies?: string;
  ordering?: string;
  filters?: ProjectFilters;
}

// Hook return type
export interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  refetch: () => void;
  loadMore: () => void;
  updateFilters: (filters: Partial<ProjectsQueryParams>) => void;
}

// Project statistics and analytics
export interface ProjectStats {
  totalProjects: number;
  completedProjects: number;
  ongoingProjects: number;
  maintenanceProjects: number;
  featuredProjects: number;
  totalLikes: number;
  totalComments: number;
  approvedComments: number;
  totalTechnologies: number;
  projectsByCategory: Record<string, number>;
  projectsByDomain: Record<string, number>;
  technologiesByCategory: Record<string, number>;
}

export interface ProjectAnalytics {
  projectId: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clickThroughs: number;
  repositoryViews: number;
  topReferrers: string[];
  timeSpent: number;
}

// Portfolio presentation types
export interface PortfolioSection {
  id: string;
  title: string;
  description: string;
  projects: Project[];
  layout: 'grid' | 'list' | 'carousel' | 'masonry';
  itemsPerRow?: number;
  showDescription?: boolean;
  showTechnologies?: boolean;
  showClient?: boolean;
}

export interface PortfolioPage {
  id: string;
  title: string;
  description: string;
  sections: PortfolioSection[];
  featured: boolean;
  isPublic: boolean;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  dateCreated: string;
  dateUpdated: string;
}

// Case study types
export interface CaseStudy {
  id: string;
  project: string; // Project ID
  title: string;
  slug: string;
  overview: string;
  challenge: string;
  solution: string;
  results: string;
  images: string[];
  metrics: CaseStudyMetric[];
  testimonial?: Testimonial;
  featured: boolean;
  dateCreated: string;
  dateUpdated: string;
}

export interface CaseStudyMetric {
  id: string;
  label: string;
  value: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface Testimonial {
  id: string;
  client: string; // User ID
  content: string;
  rating: number;
  position?: string;
  company?: string;
  image?: string;
  featured: boolean;
  approved: boolean;
  dateCreated: string;
}

// Technology showcase types
export interface TechnologyShowcase {
  technology: Technology;
  projectsCount: number;
  recentProjects: Project[];
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  certifications?: string[];
}

export interface TechnologyStack {
  id: string;
  name: string;
  description: string;
  technologies: Technology[];
  projects: Project[];
  featured: boolean;
}

// Comment management
export interface ProjectCommentCreateRequest {
  projectId: string;
  name: string;
  email?: string;
  message: string;
}

export interface ProjectCommentModerationRequest {
  commentIds: string[];
  action: 'approve' | 'reject' | 'delete';
}

// Project timeline and milestones
export interface ProjectMilestone {
  id: string;
  project: string; // Project ID
  title: string;
  description: string;
  dueDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  sortOrder: number;
}

export interface ProjectTimeline {
  project: string; // Project ID
  milestones: ProjectMilestone[];
  startDate: string;
  endDate?: string;
  estimatedDuration: number; // in days
  actualDuration?: number; // in days
}

// Collaboration and client communication
export interface ProjectUpdate {
  id: string;
  project: string; // Project ID
  title: string;
  content: string;
  type: 'progress' | 'milestone' | 'issue' | 'completion';
  visibility: 'client' | 'internal' | 'public';
  author: string; // User ID
  dateCreated: string;
}

export interface ClientFeedback {
  id: string;
  project: string; // Project ID
  client: string; // User ID
  content: string;
  rating?: number;
  status: 'pending' | 'addressed' | 'closed';
  dateCreated: string;
  dateUpdated: string;
}