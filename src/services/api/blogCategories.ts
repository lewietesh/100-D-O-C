const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const BLOG_API_URL = `${API_BASE}/api/v1/blog/posts/`;

export interface BlogCategory {
          name: string;
          count: number;
}

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
          const res = await fetch(BLOG_API_URL);
          if (!res.ok) throw new Error('Failed to fetch blog posts');
          const data = await res.json();
          // Aggregate categories and counts
          const categoryMap: Record<string, number> = {};
          (data.results || data).forEach((post: any) => {
                    if (post.category) {
                              categoryMap[post.category] = (categoryMap[post.category] || 0) + 1;
                    }
          });
          return Object.entries(categoryMap).map(([name, count]) => ({ name, count }));
}
