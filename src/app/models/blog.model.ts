// app/models/blog.model.ts
export interface BlogComment {
  id: string;
  name: string;
  email?: string;
  message: string;
  date_created?: string;
  approved: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  tags?: string[];
  author: string;
  authorId: string;
  image: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  comments?: BlogComment[];
  viewCount?: number;
  featured?: boolean;
  updatedAt?: string;
}