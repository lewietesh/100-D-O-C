import { useEffect, useState } from 'react';
import { BlogPostWithDetails } from '@/types/blog';
import { fetchBlogPostBySlug, postCommentToBlog } from '@/services/api/blogDetails';

export function useBlogDetails(slug: string | undefined) {
          const [post, setPost] = useState<BlogPostWithDetails | null>(null);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState<string | null>(null);
          const [submitting, setSubmitting] = useState(false);
          const [submitError, setSubmitError] = useState<string | null>(null);

          // Fetch blog post details
          const fetchDetails = async () => {
                    if (!slug) return;
                    setLoading(true);
                    setError(null);
                    try {
                              const data = await fetchBlogPostBySlug(slug);
                              setPost(data);
                    } catch (err: any) {
                              setError(err.message || 'Failed to fetch blog post');
                    } finally {
                              setLoading(false);
                    }
          };

          useEffect(() => {
                    fetchDetails();
                    // eslint-disable-next-line react-hooks/exhaustive-deps
          }, [slug]);

          // Submit comment with validation
          type SubmitCommentResult = { detail: string } | string | boolean;
          const submitComment = async (comment: {
                    name: string;
                    email: string;
                    website?: string;
                    message: string;
                    parent?: string;
          }): Promise<SubmitCommentResult> => {
                    setSubmitting(true);
                    setSubmitError(null);
                    // Validation
                    if (!comment.name.trim()) {
                              setSubmitError('Name is required.');
                              setSubmitting(false);
                              return 'Name is required.';
                    }
                    if (!comment.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(comment.email)) {
                              setSubmitError('A valid email is required.');
                              setSubmitting(false);
                              return 'A valid email is required.';
                    }
                    const wordCount = comment.message.trim().split(/\s+/).length;
                    if (wordCount > 500) {
                              setSubmitError('Comment cannot exceed 500 words.');
                              setSubmitting(false);
                              return 'Comment cannot exceed 500 words.';
                    }
                    if (wordCount < 10) {
                              setSubmitError('Comment must be at least 10 words.');
                              setSubmitting(false);
                              return 'Comment must be at least 10 words.';
                    }
                    try {
                              // Always use the blog post ID for comment POSTs
                              if (!post || !post.id) throw new Error('No blog post specified');
                              const payload = { ...comment, blogpost: post.id };
                              const response = await postCommentToBlog(post.id, payload);
                              await fetchDetails(); // Refresh post/comments
                              setSubmitting(false);
                              return response;
                    } catch (err: any) {
                              setSubmitError(err.message || 'Failed to submit comment');
                              setSubmitting(false);
                              return err.message || false;
                    }
          };

          return { post, loading, error, submitComment, submitting, submitError };
}
