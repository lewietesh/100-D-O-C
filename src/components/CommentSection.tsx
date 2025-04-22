'use client';

import { useState } from 'react';
import { ProjectComment } from '@/data/projects';

interface Props {
  initialComments?: ProjectComment[];
}

const CommentsSection = ({ initialComments = [] }: Props) => {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newComment: ProjectComment = {
      id: crypto.randomUUID(),
      name,
      message,
      createdAt: new Date().toISOString(),
    };

    setComments([newComment, ...comments]);
    setName('');
    setMessage('');
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
        <textarea
          required
          placeholder="Your comment"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded min-h-[100px]"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post Comment
        </button>
        {submitted && (
          <p className="text-green-600 text-sm">Your comment has been posted!</p>
        )}
      </form>

      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm">No comments yet. Be the first to contribute!</p>
      ) : (
        <ul className="space-y-6">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="border-l-4 border-blue-500 pl-4 text-sm text-gray-700"
            >
              <p className="font-semibold">{comment.name}</p>
              <p className="text-xs text-gray-400 mb-1">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
              <p>{comment.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default CommentsSection;
