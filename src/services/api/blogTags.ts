const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const TAGS_API_URL = `${API_BASE}/api/v1/blog/tags/`;

export interface BlogTag {
          id: number;
          name: string;
          slug: string;
          color?: string;
}

export async function fetchBlogTags(): Promise<BlogTag[]> {
          const res = await fetch(TAGS_API_URL);
          if (!res.ok) throw new Error('Failed to fetch tags');
          const data = await res.json();
          if (Array.isArray(data)) return data;
          if (data && Array.isArray(data.results)) return data.results;
          return [];
}
