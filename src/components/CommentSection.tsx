// src/components/CommentSection.tsx
'use client';

import { useState } from 'react';
import { useData } from '@/app/context/DataContext';
import { BlogComment } from '@/app/models/blog.model';

interface Props {
  postId: string;  // Add postId prop
  initialComments?: BlogComment[];
}

const CommentsSection = ({ postId, initialComments = [] }: Props) => {
  const { blogs, updateBlog } = useData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Add email field
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Get the blog post and its comments
  const post = blogs.find(blog => blog.id === postId);
  const comments = post?.comments?.filter(comment => comment.approved) || initialComments;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new comment
    const newComment: BlogComment = {
      id: crypto.randomUUID(),
      name,
      email, // Include email
      message,
      createdAt: new Date().toISOString(),
      approved: false, // Set to false for moderation
    };

    // Update the blog post with the new comment
    if (post) {
      const updatedComments = post.comments ? [...post.comments, newComment] : [newComment];
      
      // Use the data context to update the blog
      updateBlog(postId, {
        comments: updatedComments
      });
    }

    // Reset form and show success message
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 4000);
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
          />
          <input
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <textarea
          required
          placeholder="Your comment"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded min-h-[100px] focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Post Comment
        </button>
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
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="border-l-4 border-blue-500 pl-4 bg-gray-50 p-4 rounded-r"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{comment.name}</p>
                  <p className="text-xs text-gray-400 mb-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
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