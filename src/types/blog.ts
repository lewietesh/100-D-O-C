// types/blog.ts
// Blog and Content Management Types

export type BlogPostStatus = 'draft' | 'published' | 'archived';

export interface Tag {
  id: number;
  name: string;
  slug: string;
  color?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  datePublished?: string;
  category?: string;
  status: BlogPostStatus;
  author: string; // User ID
  viewCount: number;
  featured: boolean;
  dateCreated: string;
  dateUpdated: string;
}

export interface BlogPostWithDetails extends BlogPost {
  authorDetails: {
    id: string;
    email: string;
    fullName: string;
  };
  tags: Tag[];
  comments: BlogComment[];
  commentsCount: number;
  approvedCommentsCount: number;
  readingTime: number; // in minutes
}

export interface BlogPostTag {
  blogpost: string; // BlogPost ID
  tag: number; // Tag ID
}

export interface BlogComment {
  id: string;
  blogpost: string; // BlogPost ID
  parent?: string; // Parent comment ID for replies
  name: string;
  email?: string;
  website?: string;
  message: string;
  approved: boolean;
  dateCreated: string;
  // Extended fields for moderation, threading, and user info
  isReply?: boolean;
  replies?: BlogComment[];
  avatarUrl?: string;
  userAgent?: string;
  ipAddress?: string;
  // Add any backend-provided moderation fields
  flagged?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface BlogCommentWithDetails extends BlogComment {
  blogpostTitle: string;
  blogpostSlug: string;
  replies?: BlogComment[];
  isReply: boolean;
}

// Content creation and editing types
export interface BlogPostCreateRequest {
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  category?: string;
  status?: BlogPostStatus;
  featured?: boolean;
  datePublished?: string;
  tagIds?: number[];
}

export interface BlogPostUpdateRequest {
  title?: string;
  excerpt?: string;
  content?: string;
  imageUrl?: string;
  category?: string;
  status?: BlogPostStatus;
  featured?: boolean;
  datePublished?: string;
  tagIds?: number[];
}

export interface TagCreateRequest {
  name: string;
  color?: string;
}

export interface TagUpdateRequest {
  name?: string;
  color?: string;
}

// Comment management types
export interface CommentCreateRequest {
  blogpostId: string;
  parentId?: string;
  name: string;
  email?: string;
  website?: string;
  message: string;
  // Optionally support user agent, IP, and anti-spam fields
  userAgent?: string;
  recaptchaToken?: string;
}

export interface CommentModerationRequest {
  commentIds: string[];
  action: 'approve' | 'reject' | 'delete';
}

// Blog statistics and analytics
export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  featuredPosts: number;
  totalViews: number;
  totalComments: number;
  approvedComments: number;
  pendingComments: number;
  totalTags: number;
}

export interface PostAnalytics {
  postId: string;
  title: string;
  views: number;
  comments: number;
  likes: number;
  shares: number;
  readingTime: number;
  bounceRate: number;
  avgTimeOnPage: number;
  topReferrers: string[];
}

// Content filtering and search
export interface BlogPostFilters {
  status?: BlogPostStatus;
  category?: string;
  author?: string;
  featured?: boolean;
  tags?: number[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface BlogPostSearchParams {
  query?: string;
  filters?: BlogPostFilters;
  sortBy?: 'dateCreated' | 'dateUpdated' | 'datePublished' | 'viewCount' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Content calendar and scheduling
export interface ContentCalendarEvent {
  id: string;
  title: string;
  type: 'post' | 'draft' | 'scheduled' | 'published';
  date: string;
  status: BlogPostStatus;
  author: string;
  category?: string;
  tags: Tag[];
}

export interface ScheduledPost {
  id: string;
  post: BlogPost;
  scheduledDate: string;
  status: 'pending' | 'published' | 'failed';
  attempts: number;
  lastAttempt?: string;
  error?: string;
}

// SEO and metadata types
export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
}

export interface BlogPostWithSEO extends BlogPost {
  seo: SEOMetadata;
}

// Newsletter and subscription types
export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
  preferences: string[];
}

export interface Newsletter {
  id: string;
  subject: string;
  content: string;
  htmlContent: string;
  posts: string[]; // BlogPost IDs
  subscribers: string[]; // Subscriber IDs
  sentAt?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
}

// Related content and recommendations
export interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl?: string;
  datePublished: string;
  readingTime: number;
  relevanceScore: number;
}