import { useEffect, useState } from 'react';
import { BlogPost } from '@/types/blog';
import { fetchBlogPosts, BlogApiResponse } from '@/services/api/blog';

export function useBlog() {
          const [blogs, setBlogs] = useState<BlogPost[]>([]);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState<string | null>(null);

          useEffect(() => {
                    setLoading(true);
                    fetchBlogPosts()
                              .then((data: BlogApiResponse) => {
                                        setBlogs(data.results);
                                        setLoading(false);
                              })
                              .catch((err) => {
                                        setError(err.message || 'Failed to fetch blogs');
                                        setLoading(false);
                              });
          }, []);

          return { blogs, loading, error };
}
