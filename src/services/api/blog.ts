import { BlogPost } from '@/types/blog';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const BLOG_API_URL = `${API_BASE}/api/v1/blog/posts/`;

export interface BlogApiResponse {
          count: number;
          next: string | null;
          previous: string | null;
          results: BlogPost[];
}

export async function fetchBlogPosts(): Promise<BlogApiResponse> {
          const res = await fetch(BLOG_API_URL, { cache: 'no-store' });
          if (!res.ok) throw new Error('Failed to fetch blog posts');
          return res.json();
}
