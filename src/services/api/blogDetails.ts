import { BlogPostWithDetails } from '@/types/blog';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const BLOG_DETAIL_API_URL = `${API_BASE}/api/v1/blog/posts/`;

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPostWithDetails> {
          const url = `${BLOG_DETAIL_API_URL}${slug}/`;
          const res = await fetch(url, { cache: 'no-store' });
          if (!res.ok) throw new Error('Failed to fetch blog post');
          return res.json();
}
