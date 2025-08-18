import { useEffect, useState } from 'react';
import { BlogPostWithDetails } from '@/types/blog';
import { fetchBlogPostBySlug } from '@/services/api/blogDetails';

export function useBlogDetails(slug: string | undefined) {
          const [post, setPost] = useState<BlogPostWithDetails | null>(null);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState<string | null>(null);

          useEffect(() => {
                    if (!slug) return;
                    setLoading(true);
                    fetchBlogPostBySlug(slug)
                              .then((data) => {
                                        setPost(data);
                                        setLoading(false);
                              })
                              .catch((err) => {
                                        setError(err.message || 'Failed to fetch blog post');
                                        setLoading(false);
                              });
          }, [slug]);

          return { post, loading, error };
}
