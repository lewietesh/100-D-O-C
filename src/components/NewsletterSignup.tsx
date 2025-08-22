'use client';

import { useState } from 'react';
import { useNewsletter } from '../hooks/useNewsletter';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const { subscribe, loading, error, success } = useNewsletter();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    await subscribe(email);
    setEmail('');
  };

  return (
    <section className="mt-16 bg-gray-50 rounded-lg p-6 text-center">
      <h3 className="text-xl font-bold mb-2">Stay Inspired</h3>
      <p className="text-sm text-gray-600 mb-4">Get design tips and new projects in your inbox.</p>
      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="border border-gray-300 px-4 py-2 rounded w-full sm:max-w-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Subscribe
        </button>
      </form>
      {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      {loading && <p className="text-blue-600 text-sm mt-2">Subscribing...</p>}
    </section>
  );
};

export default NewsletterSignup;
