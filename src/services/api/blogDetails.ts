import { BlogPostWithDetails } from '@/types/blog';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const BLOG_DETAIL_API_URL = `${API_BASE}/api/v1/blog/posts/`;
const BLOG_COMMENT_API_URL = `${API_BASE}/api/v1/blog/comments/`;


// Post a comment to a blog post by ID (to /api/v1/blog/comments/)
export async function postCommentToBlog(blogpost: string, data: {
          name: string;
          email?: string;
          website?: string;
          message: string;
          parent?: string;
          blogpost: string;
}): Promise<any> {
          const url = `${BLOG_COMMENT_API_URL}`;
          const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                              'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
          });
          if (!res.ok) {
                    const error = await res.json().catch(() => ({}));
                    throw new Error(error.detail || 'Failed to submit comment');
          }
          return res.json();
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPostWithDetails> {
          const url = `${BLOG_DETAIL_API_URL}${slug}/`;
          const res = await fetch(url, { cache: 'no-store' });
          if (!res.ok) throw new Error('Failed to fetch blog post');
          return res.json();
}
