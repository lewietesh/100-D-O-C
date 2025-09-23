// src/components/CommentSection.tsx
'use client';


import { useState } from 'react';
import { useToast } from '@/app/context/ToastContext';
import { BlogComment } from '@/app/models/blog.model';
import { BlogPostWithDetails } from '@/types/blog';
import { useBlogDetails } from '@/hooks/useBlogDetails';


interface Props {
  postSlug: string;
  initialComments?: BlogComment[];
}


const CommentsSection = ({ postSlug, initialComments = [] }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  // Use the blog details hook for comment submission and state
  const { post, submitComment, submitting, submitError } = useBlogDetails(postSlug);
  // Use approved comments from post, fallback to initialComments
  let comments: BlogComment[] = initialComments;
  if (post && 'comments' in post && Array.isArray((post as BlogPostWithDetails).comments)) {
    comments = ((post as BlogPostWithDetails).comments as BlogComment[]).filter((c) => c.approved);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !post.id) {
      showToast('Blog post not loaded. Please try again.', 'error');
      return;
    }
    const result = await submitComment({
      name,
      email,
      website: website || undefined,
      message,
    });
    if (typeof result === 'object' && result !== null && 'detail' in result) {
      showToast(result.detail, 'success');
    } else if (result === true) {
      showToast('Comment submitted successfully.', 'success');
    } else if (typeof result === 'string') {
      showToast(result, 'error');
    } else if (result === false) {
      showToast('Failed to submit comment.', 'error');
    }
    if (result === true || (typeof result === 'object' && result !== null && 'detail' in result)) {
      setName('');
      setEmail('');
      setWebsite('');
      setMessage('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 200);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>


      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-blue-500 focus:border-blue-500"
            disabled={submitting}
          />
          <input
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-blue-500 focus:border-blue-500"
            disabled={submitting}
          />
        </div>
        <input
          type="url"
          placeholder="Your website (optional)"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-blue-500 focus:border-blue-500"
          disabled={submitting}
        />
        <textarea
          required
          placeholder="Your comment (10-500 words)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded min-h-[100px] focus:ring-blue-500 focus:border-blue-500"
          disabled={submitting}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={submitting}
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>{submitError}</p>
          </div>
        )}
        {submitted && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <p>Thank you for your comment! It will be visible after approval.</p>
          </div>
        )}
      </form>

      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm">No comments yet. Be the first to contribute!</p>
      ) : (
        <ul className="space-y-6">
          {comments.map((comment: BlogComment) => (
            <li
              key={comment.id}
              className="border-l-4 border-blue-500 pl-4 bg-gray-50 p-4 rounded-r"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{comment.name}</p>
                  <p className="text-xs text-gray-400 mb-2">
                    {(() => {
                      // Support both snake_case and camelCase for date fields
                      const dateStr = (comment.date_created );
                      if (!dateStr) return '';
                      const date = new Date(dateStr);
                      return date.toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                    })()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{comment.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default CommentsSection;